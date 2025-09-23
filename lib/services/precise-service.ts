import db from "@/lib/db/db";
import {
  uploadToCloudinary,
  deleteFromCloudinaryByUrl,
} from "@/lib/cloudinary";
import type {
  Precise,
  PreciseSection,
  PreciseCardStyle,
  Prisma,
} from "@/app/generated/prisma";

export interface PreciseSectionData {
  id?: string; // For existing sections during updates
  imageUrl?: string; // Existing image URL
  imageFile?: File; // New image file to upload
  title?: string;
  descriptionTitle?: string;
  description?: string;
  cardStyle: PreciseCardStyle;
  sortOrder: number;
}

export interface PreciseData {
  sections: PreciseSectionData[];
}

export interface PreciseWithSections extends Precise {
  sections: PreciseSection[];
}

export class PreciseService {
  /**
   * Get the single Precise record with its sections
   * Returns null if no Precise record exists
   */
  static async getPrecise(): Promise<PreciseWithSections | null> {
    try {
      const precise = await db.precise.findFirst({
        include: {
          sections: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      return precise;
    } catch (error) {
      console.error("Error fetching Precise:", error);
      throw new Error("Failed to fetch Precise data");
    }
  }

  /**
   * Create or update the Precise record
   * Ensures only one Precise record exists in the system
   * Only deletes images from Cloudinary that are actually being replaced
   */
  static async createOrUpdatePrecise(
    data: PreciseData
  ): Promise<PreciseWithSections> {
    const uploadedImages: { [key: string]: string } = {};
    const imagesToDelete: string[] = [];

    try {
      // Get existing Precise to collect old image URLs for cleanup
      const existingPrecise = await db.precise.findFirst({
        include: {
          sections: true,
        },
      });

      // Collect old image URLs that will be replaced
      if (existingPrecise?.sections) {
        for (let i = 0; i < data.sections.length; i++) {
          const newSection = data.sections[i];

          // Only proceed if this section has a new image file to upload
          if (newSection.imageFile) {
            // If this section has an ID, find the existing section and mark its image for deletion
            if (newSection.id) {
              const existingSection = existingPrecise.sections.find(
                (section) => section.id === newSection.id
              );

              if (existingSection?.imageUrl) {
                imagesToDelete.push(existingSection.imageUrl);
              }
            }
          }
        }

        // Also collect images from sections that will be completely removed
        const incomingSectionIds = data.sections
          .map((s) => s.id)
          .filter(Boolean);
        const sectionsToRemove = existingPrecise.sections.filter(
          (section) => !incomingSectionIds.includes(section.id)
        );

        for (const section of sectionsToRemove) {
          if (section.imageUrl) {
            imagesToDelete.push(section.imageUrl);
          }
        }
      }

      // Handle image uploads outside of transaction
      for (let i = 0; i < data.sections.length; i++) {
        const section = data.sections[i];
        if (section.imageFile) {
          // Convert File to Buffer for Cloudinary upload
          const arrayBuffer = await section.imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult = await uploadToCloudinary(buffer, {
            folder: `precise/sections`,
            public_id: `precise_section_${Date.now()}_${i}`,
          });
          uploadedImages[`section_${i}`] = uploadResult.secure_url;
        }
      }

      // Database operations in transaction
      const result = await db.$transaction(
        async (prisma: Prisma.TransactionClient) => {
          // Check for existing Precise records
          const existingPrecises = await prisma.precise.findMany({
            include: {
              sections: true,
            },
            orderBy: { createdAt: "asc" },
          });

          let preciseToUpdate: PreciseWithSections | null = null;

          if (existingPrecises.length === 0) {
            // No existing Precise - create new one
            preciseToUpdate = await prisma.precise.create({
              data: {},
              include: {
                sections: {
                  orderBy: { sortOrder: "asc" },
                },
              },
            });
          } else {
            // Use the first Precise and delete others if they exist
            const firstPrecise = existingPrecises[0];
            preciseToUpdate = firstPrecise;

            // Delete extra Precise records if they exist
            if (existingPrecises.length > 1) {
              const extraPreciseIds = existingPrecises
                .slice(1)
                .map((precise: Precise) => precise.id);

              // Delete sections of extra Precises first (due to cascade)
              await prisma.preciseSection.deleteMany({
                where: {
                  preciseId: { in: extraPreciseIds },
                },
              });

              // Delete extra Precise records
              await prisma.precise.deleteMany({
                where: {
                  id: { in: extraPreciseIds },
                },
              });
            }

            // Update the first Precise
            preciseToUpdate = await prisma.precise.update({
              where: { id: firstPrecise.id },
              data: {
                updatedAt: new Date(),
              },
              include: {
                sections: {
                  orderBy: { sortOrder: "asc" },
                },
              },
            });

            // Handle sections more precisely: update existing, create new, delete removed
            const existingSections = preciseToUpdate.sections;
            const incomingIds = data.sections.map((s) => s.id).filter(Boolean);

            // Delete sections that are no longer in the incoming data
            const sectionsToDelete = existingSections.filter(
              (section) => !incomingIds.includes(section.id)
            );

            if (sectionsToDelete.length > 0) {
              await prisma.preciseSection.deleteMany({
                where: {
                  id: { in: sectionsToDelete.map((s) => s.id) },
                },
              });
            }
          }

          // Process each section: update existing or create new
          for (let index = 0; index < data.sections.length; index++) {
            const section = data.sections[index];

            let imageUrl: string | undefined;

            // Use uploaded image if we uploaded one for this section
            if (uploadedImages[`section_${index}`]) {
              imageUrl = uploadedImages[`section_${index}`];
            } else {
              // Keep existing image URL if no new image was uploaded
              imageUrl = section.imageUrl;
            }

            const sectionData = {
              preciseId: preciseToUpdate!.id,
              imageUrl,
              title: section.title,
              descriptionTitle: section.descriptionTitle,
              description: section.description,
              cardStyle: section.cardStyle,
              sortOrder: section.sortOrder,
            };

            if (section.id) {
              // Update existing section
              await prisma.preciseSection.update({
                where: { id: section.id },
                data: sectionData,
              });
            } else {
              // Create new section
              await prisma.preciseSection.create({
                data: sectionData,
              });
            }
          }

          // Return the updated Precise with new sections
          return (await prisma.precise.findUnique({
            where: { id: preciseToUpdate.id },
            include: {
              sections: {
                orderBy: { sortOrder: "asc" },
              },
            },
          })) as PreciseWithSections;
        }
      );

      // After successful database transaction, delete old images from Cloudinary
      if (imagesToDelete.length > 0) {
        console.log(
          `Cleaning up ${imagesToDelete.length} old images:`,
          imagesToDelete
        );
      }

      for (const imageUrl of imagesToDelete) {
        try {
          await deleteFromCloudinaryByUrl(imageUrl);
          console.log(`Successfully deleted old image: ${imageUrl}`);
        } catch (cleanupError) {
          console.error("Failed to cleanup old image:", imageUrl, cleanupError);
          // Continue with other deletions even if one fails
        }
      }

      return result;
    } catch (error) {
      // Cleanup uploaded images on error (but don't delete old images since transaction failed)
      for (const imageUrl of Object.values(uploadedImages)) {
        try {
          await deleteFromCloudinaryByUrl(imageUrl);
        } catch (cleanupError) {
          console.error(
            "Failed to cleanup uploaded image:",
            imageUrl,
            cleanupError
          );
        }
      }

      console.error("Error creating/updating Precise:", error);
      throw new Error("Failed to save Precise data");
    }
  }

  /**
   * Delete the Precise record and all its sections
   * Also cleans up associated images from Cloudinary
   */
  static async deletePrecise(): Promise<boolean> {
    try {
      const precise = await db.precise.findFirst({
        include: {
          sections: true,
        },
      });

      if (!precise) {
        return true; // Already deleted or doesn't exist
      }

      // Collect image URLs for cleanup
      const imageUrls = precise.sections
        .map((section: PreciseSection) => section.imageUrl)
        .filter((url): url is string => Boolean(url));

      // Delete from database (cascade will handle sections)
      await db.precise.delete({
        where: { id: precise.id },
      });

      // Cleanup images from Cloudinary
      for (const imageUrl of imageUrls) {
        try {
          await deleteFromCloudinaryByUrl(imageUrl);
        } catch (cleanupError) {
          console.error("Failed to cleanup image:", imageUrl, cleanupError);
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting Precise:", error);
      throw new Error("Failed to delete Precise");
    }
  }

  /**
   * Ensure only one Precise record exists
   * Used for data integrity maintenance
   */
  static async ensureOnlyPreciseRecord(): Promise<void> {
    try {
      const precises = await db.precise.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (precises.length > 1) {
        // Keep the first one, delete the rest
        const extraPreciseIds = precises
          .slice(1)
          .map((precise: Precise) => precise.id);

        await db.precise.deleteMany({
          where: {
            id: { in: extraPreciseIds },
          },
        });
      }
    } catch (error) {
      console.error("Error ensuring single Precise record:", error);
      throw new Error("Failed to ensure single Precise record");
    }
  }
}

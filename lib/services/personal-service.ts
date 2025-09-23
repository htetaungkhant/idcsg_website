import db from "@/lib/db/db";
import {
  uploadToCloudinary,
  deleteFromCloudinaryByUrl,
} from "@/lib/cloudinary";
import type {
  Personal,
  PersonalSection,
  PersonalCardStyle,
  Prisma,
} from "@/app/generated/prisma";

export interface PersonalSectionData {
  id?: string; // For existing sections during updates
  imageUrl?: string; // Existing image URL
  imageFile?: File; // New image file to upload
  title?: string;
  descriptionTitle?: string;
  description?: string;
  cardStyle: PersonalCardStyle;
  sortOrder: number;
}

export interface PersonalData {
  sections: PersonalSectionData[];
}

export interface PersonalWithSections extends Personal {
  sections: PersonalSection[];
}

export class PersonalService {
  /**
   * Get the single Personal record with its sections
   * Returns null if no Personal record exists
   */
  static async getPersonal(): Promise<PersonalWithSections | null> {
    try {
      const personal = await db.personal.findFirst({
        include: {
          sections: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      return personal;
    } catch (error) {
      console.error("Error fetching Personal:", error);
      throw new Error("Failed to fetch Personal data");
    }
  }

  /**
   * Create or update the Personal record
   * Ensures only one Personal record exists in the system
   * Only deletes images from Cloudinary that are actually being replaced
   */
  static async createOrUpdatePersonal(
    data: PersonalData
  ): Promise<PersonalWithSections> {
    const uploadedImages: { [key: string]: string } = {};
    const imagesToDelete: string[] = [];

    try {
      // Get existing Personal to collect old image URLs for cleanup
      const existingPersonal = await db.personal.findFirst({
        include: {
          sections: true,
        },
      });

      // Collect old image URLs that will be replaced
      if (existingPersonal?.sections) {
        for (let i = 0; i < data.sections.length; i++) {
          const newSection = data.sections[i];

          // Only proceed if this section has a new image file to upload
          if (newSection.imageFile) {
            // If this section has an ID, find the existing section and mark its image for deletion
            if (newSection.id) {
              const existingSection = existingPersonal.sections.find(
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
        const sectionsToRemove = existingPersonal.sections.filter(
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
            folder: `personal/sections`,
            public_id: `personal_section_${Date.now()}_${i}`,
          });
          uploadedImages[`section_${i}`] = uploadResult.secure_url;
        }
      }

      // Database operations in transaction
      const result = await db.$transaction(
        async (prisma: Prisma.TransactionClient) => {
          // Check for existing Personal records
          const existingPersonals = await prisma.personal.findMany({
            include: {
              sections: true,
            },
            orderBy: { createdAt: "asc" },
          });

          let personalToUpdate: PersonalWithSections | null = null;

          if (existingPersonals.length === 0) {
            // No existing Personal - create new one
            personalToUpdate = await prisma.personal.create({
              data: {},
              include: {
                sections: {
                  orderBy: { sortOrder: "asc" },
                },
              },
            });
          } else {
            // Use the first Personal and delete others if they exist
            const firstPersonal = existingPersonals[0];
            personalToUpdate = firstPersonal;

            // Delete extra Personal records if they exist
            if (existingPersonals.length > 1) {
              const extraPersonalIds = existingPersonals
                .slice(1)
                .map((personal: Personal) => personal.id);

              // Delete sections of extra Personals first (due to cascade)
              await prisma.personalSection.deleteMany({
                where: {
                  personalId: { in: extraPersonalIds },
                },
              });

              // Delete extra Personal records
              await prisma.personal.deleteMany({
                where: {
                  id: { in: extraPersonalIds },
                },
              });
            }

            // Update the first Personal
            personalToUpdate = await prisma.personal.update({
              where: { id: firstPersonal.id },
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
            const existingSections = personalToUpdate.sections;
            const incomingIds = data.sections.map((s) => s.id).filter(Boolean);

            // Delete sections that are no longer in the incoming data
            const sectionsToDelete = existingSections.filter(
              (section) => !incomingIds.includes(section.id)
            );

            if (sectionsToDelete.length > 0) {
              await prisma.personalSection.deleteMany({
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
              personalId: personalToUpdate!.id,
              imageUrl,
              title: section.title,
              descriptionTitle: section.descriptionTitle,
              description: section.description,
              cardStyle: section.cardStyle,
              sortOrder: section.sortOrder,
            };

            if (section.id) {
              // Update existing section
              await prisma.personalSection.update({
                where: { id: section.id },
                data: sectionData,
              });
            } else {
              // Create new section
              await prisma.personalSection.create({
                data: sectionData,
              });
            }
          }

          // Return the updated Personal with new sections
          return (await prisma.personal.findUnique({
            where: { id: personalToUpdate.id },
            include: {
              sections: {
                orderBy: { sortOrder: "asc" },
              },
            },
          })) as PersonalWithSections;
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

      console.error("Error creating/updating Personal:", error);
      throw new Error("Failed to save Personal data");
    }
  }

  /**
   * Delete the Personal record and all its sections
   * Also cleans up associated images from Cloudinary
   */
  static async deletePersonal(): Promise<boolean> {
    try {
      const personal = await db.personal.findFirst({
        include: {
          sections: true,
        },
      });

      if (!personal) {
        return true; // Already deleted or doesn't exist
      }

      // Collect image URLs for cleanup
      const imageUrls = personal.sections
        .map((section: PersonalSection) => section.imageUrl)
        .filter((url): url is string => Boolean(url));

      // Delete from database (cascade will handle sections)
      await db.personal.delete({
        where: { id: personal.id },
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
      console.error("Error deleting Personal:", error);
      throw new Error("Failed to delete Personal");
    }
  }

  /**
   * Ensure only one Personal record exists
   * Used for data integrity maintenance
   */
  static async ensureOnlyPersonalRecord(): Promise<void> {
    try {
      const personals = await db.personal.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (personals.length > 1) {
        // Keep the first one, delete the rest
        const extraPersonalIds = personals
          .slice(1)
          .map((personal: Personal) => personal.id);

        await db.personal.deleteMany({
          where: {
            id: { in: extraPersonalIds },
          },
        });
      }
    } catch (error) {
      console.error("Error ensuring single Personal record:", error);
      throw new Error("Failed to ensure single Personal record");
    }
  }
}

import db from "@/lib/db/db";
import {
  uploadToCloudinary,
  deleteFromCloudinaryByUrl,
} from "@/lib/cloudinary";
import type {
  Safe,
  SafeSection,
  SafeCardStyle,
  Prisma,
} from "@/app/generated/prisma";

export interface SafeSectionData {
  id?: string; // For existing sections during updates
  imageUrl?: string; // Existing image URL
  imageFile?: File; // New image file to upload
  title?: string;
  descriptionTitle?: string;
  description?: string;
  cardStyle: SafeCardStyle;
  sortOrder: number;
}

export interface SafeData {
  sections: SafeSectionData[];
}

export interface SafeWithSections extends Safe {
  sections: SafeSection[];
}

export class SafeService {
  /**
   * Get the single Safe record with its sections
   * Returns null if no Safe record exists
   */
  static async getSafe(): Promise<SafeWithSections | null> {
    try {
      const safe = await db.safe.findFirst({
        include: {
          sections: {
            orderBy: { sortOrder: "asc" },
          },
        },
      });

      return safe;
    } catch (error) {
      console.error("Error fetching Safe:", error);
      throw new Error("Failed to fetch Safe data");
    }
  }

  /**
   * Create or update the Safe record
   * Ensures only one Safe record exists in the system
   * Only deletes images from Cloudinary that are actually being replaced
   */
  static async createOrUpdateSafe(data: SafeData): Promise<SafeWithSections> {
    const uploadedImages: { [key: string]: string } = {};
    const imagesToDelete: string[] = [];

    try {
      // Get existing Safe to collect old image URLs for cleanup
      const existingSafe = await db.safe.findFirst({
        include: {
          sections: true,
        },
      });

      // Collect old image URLs that will be replaced
      if (existingSafe?.sections) {
        for (let i = 0; i < data.sections.length; i++) {
          const newSection = data.sections[i];
          
          // Only proceed if this section has a new image file to upload
          if (newSection.imageFile) {
            // If this section has an ID, find the existing section and mark its image for deletion
            if (newSection.id) {
              const existingSection = existingSafe.sections.find(
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
        const sectionsToRemove = existingSafe.sections.filter(
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
            folder: `safe/sections`,
            public_id: `safe_section_${Date.now()}_${i}`,
          });
          uploadedImages[`section_${i}`] = uploadResult.secure_url;
        }
      }

      // Database operations in transaction
      const result = await db.$transaction(
        async (prisma: Prisma.TransactionClient) => {
          // Check for existing Safe records
          const existingSafes = await prisma.safe.findMany({
            include: {
              sections: true,
            },
            orderBy: { createdAt: "asc" },
          });

          let safeToUpdate: SafeWithSections | null = null;

          if (existingSafes.length === 0) {
            // No existing Safe - create new one
            safeToUpdate = await prisma.safe.create({
              data: {},
              include: {
                sections: {
                  orderBy: { sortOrder: "asc" },
                },
              },
            });
          } else {
            // Use the first Safe and delete others if they exist
            const firstSafe = existingSafes[0];
            safeToUpdate = firstSafe;

            // Delete extra Safe records if they exist
            if (existingSafes.length > 1) {
              const extraSafeIds = existingSafes
                .slice(1)
                .map((safe: Safe) => safe.id);

              // Delete sections of extra Safes first (due to cascade)
              await prisma.safeSection.deleteMany({
                where: {
                  safeId: { in: extraSafeIds },
                },
              });

              // Delete extra Safe records
              await prisma.safe.deleteMany({
                where: {
                  id: { in: extraSafeIds },
                },
              });
            }

            // Update the first Safe
            safeToUpdate = await prisma.safe.update({
              where: { id: firstSafe.id },
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
            const existingSections = safeToUpdate.sections;
            const incomingIds = data.sections.map(s => s.id).filter(Boolean);
            
            // Delete sections that are no longer in the incoming data
            const sectionsToDelete = existingSections.filter(
              section => !incomingIds.includes(section.id)
            );
            
            if (sectionsToDelete.length > 0) {
              await prisma.safeSection.deleteMany({
                where: {
                  id: { in: sectionsToDelete.map(s => s.id) }
                }
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
              safeId: safeToUpdate!.id,
              imageUrl,
              title: section.title,
              descriptionTitle: section.descriptionTitle,
              description: section.description,
              cardStyle: section.cardStyle,
              sortOrder: section.sortOrder,
            };
            
            if (section.id) {
              // Update existing section
              await prisma.safeSection.update({
                where: { id: section.id },
                data: sectionData
              });
            } else {
              // Create new section
              await prisma.safeSection.create({
                data: sectionData
              });
            }
          }

          // Return the updated Safe with new sections
          return (await prisma.safe.findUnique({
            where: { id: safeToUpdate.id },
            include: {
              sections: {
                orderBy: { sortOrder: "asc" },
              },
            },
          })) as SafeWithSections;
        }
      );

      // After successful database transaction, delete old images from Cloudinary
      if (imagesToDelete.length > 0) {
        console.log(`Cleaning up ${imagesToDelete.length} old images:`, imagesToDelete);
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

      console.error("Error creating/updating Safe:", error);
      throw new Error("Failed to save Safe data");
    }
  }

  /**
   * Delete the Safe record and all its sections
   * Also cleans up associated images from Cloudinary
   */
  static async deleteSafe(): Promise<boolean> {
    try {
      const safe = await db.safe.findFirst({
        include: {
          sections: true,
        },
      });

      if (!safe) {
        return true; // Already deleted or doesn't exist
      }

      // Collect image URLs for cleanup
      const imageUrls = safe.sections
        .map((section: SafeSection) => section.imageUrl)
        .filter((url): url is string => Boolean(url));

      // Delete from database (cascade will handle sections)
      await db.safe.delete({
        where: { id: safe.id },
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
      console.error("Error deleting Safe:", error);
      throw new Error("Failed to delete Safe");
    }
  }

  /**
   * Ensure only one Safe record exists
   * Used for data integrity maintenance
   */
  static async ensureOnlySafeRecord(): Promise<void> {
    try {
      const safes = await db.safe.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (safes.length > 1) {
        // Keep the first one, delete the rest
        const extraSafeIds = safes.slice(1).map((safe: Safe) => safe.id);

        await db.safe.deleteMany({
          where: {
            id: { in: extraSafeIds },
          },
        });
      }
    } catch (error) {
      console.error("Error ensuring single Safe record:", error);
      throw new Error("Failed to ensure single Safe record");
    }
  }
}

import db from "@/lib/db/db";
import {
  uploadToCloudinary,
  deleteFromCloudinaryByUrl,
} from "@/lib/cloudinary";
import type {
  FirstVisit,
  FirstVisitSection,
  FirstVisitVideoSection,
  FirstVisitInformationSection,
  Prisma,
} from "@/app/generated/prisma";

export interface FirstVisitSectionData {
  id?: string; // For existing sections during updates
  imageUrl?: string; // Existing image URL
  imageFile?: File; // New image file to upload
  title?: string;
  descriptionTitle?: string;
  description: string; // Required field
  sortOrder: number;
}

export interface FirstVisitVideoSectionData {
  id?: string; // For existing video section during updates
  videoUrl: string; // Required field
}

export interface FirstVisitInformationSectionData {
  id?: string; // For existing information section during updates
  imageUrl?: string; // Existing image URL
  imageFile?: File; // New image file to upload
  descriptionTitle?: string;
  description: string; // Required field
}

export interface FirstVisitData {
  sections: FirstVisitSectionData[];
  videoSection?: FirstVisitVideoSectionData;
  informationSection?: FirstVisitInformationSectionData;
}

export interface FirstVisitWithSections extends FirstVisit {
  sections: FirstVisitSection[];
  videoSection: FirstVisitVideoSection | null;
  informationSection: FirstVisitInformationSection | null;
}

export class FirstVisitService {
  /**
   * Get the single FirstVisit record with all its sections
   * Returns null if no FirstVisit record exists
   */
  static async getFirstVisit(): Promise<FirstVisitWithSections | null> {
    try {
      const firstVisit = await db.firstVisit.findFirst({
        include: {
          sections: {
            orderBy: { sortOrder: "asc" },
          },
          videoSection: true,
          informationSection: true,
        },
      });

      return firstVisit;
    } catch (error) {
      console.error("Error fetching FirstVisit:", error);
      throw new Error("Failed to fetch FirstVisit data");
    }
  }

  /**
   * Create or update the FirstVisit record
   * Ensures only one FirstVisit record exists in the system
   * Only deletes images from Cloudinary that are actually being replaced
   */
  static async createOrUpdateFirstVisit(
    data: FirstVisitData
  ): Promise<FirstVisitWithSections> {
    const uploadedImages: { [key: string]: string } = {};
    const imagesToDelete: string[] = [];

    try {
      // Get existing FirstVisit to collect old image URLs for cleanup
      const existingFirstVisit = await db.firstVisit.findFirst({
        include: {
          sections: true,
          videoSection: true,
          informationSection: true,
        },
      });

      // Collect old image URLs that will be replaced for general sections
      if (existingFirstVisit?.sections) {
        for (let i = 0; i < data.sections.length; i++) {
          const newSection = data.sections[i];

          // Only proceed if this section has a new image file to upload
          if (newSection.imageFile) {
            // If this section has an ID, find the existing section and mark its image for deletion
            if (newSection.id) {
              const existingSection = existingFirstVisit.sections.find(
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
        const sectionsToRemove = existingFirstVisit.sections.filter(
          (section) => !incomingSectionIds.includes(section.id)
        );

        for (const section of sectionsToRemove) {
          if (section.imageUrl) {
            imagesToDelete.push(section.imageUrl);
          }
        }
      }

      // Collect old image URL from information section if being replaced
      if (
        data.informationSection?.imageFile &&
        existingFirstVisit?.informationSection?.imageUrl
      ) {
        imagesToDelete.push(existingFirstVisit.informationSection.imageUrl);
      }

      // Collect old image URL from information section if being completely removed
      if (
        !data.informationSection &&
        existingFirstVisit?.informationSection?.imageUrl
      ) {
        imagesToDelete.push(existingFirstVisit.informationSection.imageUrl);
      }

      // Handle image uploads outside of transaction
      // Upload images for general sections
      for (let i = 0; i < data.sections.length; i++) {
        const section = data.sections[i];
        if (section.imageFile) {
          // Convert File to Buffer for Cloudinary upload
          const arrayBuffer = await section.imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult = await uploadToCloudinary(buffer, {
            folder: `first-visit/sections`,
            public_id: `first_visit_section_${Date.now()}_${i}`,
          });
          uploadedImages[`section_${i}`] = uploadResult.secure_url;
        }
      }

      // Upload image for information section if provided
      if (data.informationSection?.imageFile) {
        const arrayBuffer =
          await data.informationSection.imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await uploadToCloudinary(buffer, {
          folder: `first-visit/information`,
          public_id: `first_visit_information_${Date.now()}`,
        });
        uploadedImages["information_section"] = uploadResult.secure_url;
      }

      // Database operations in transaction
      const result = await db.$transaction(
        async (prisma: Prisma.TransactionClient) => {
          // Check for existing FirstVisit records
          const existingFirstVisits = await prisma.firstVisit.findMany({
            include: {
              sections: true,
              videoSection: true,
              informationSection: true,
            },
            orderBy: { createdAt: "asc" },
          });

          let firstVisitToUpdate: FirstVisitWithSections | null = null;

          if (existingFirstVisits.length === 0) {
            // No existing FirstVisit - create new one
            firstVisitToUpdate = await prisma.firstVisit.create({
              data: {},
              include: {
                sections: {
                  orderBy: { sortOrder: "asc" },
                },
                videoSection: true,
                informationSection: true,
              },
            });
          } else {
            // Use the first FirstVisit and delete others if they exist
            const firstFirstVisit = existingFirstVisits[0];
            firstVisitToUpdate = firstFirstVisit;

            // Delete extra FirstVisit records if they exist
            if (existingFirstVisits.length > 1) {
              const extraFirstVisitIds = existingFirstVisits
                .slice(1)
                .map((firstVisit: FirstVisit) => firstVisit.id);

              // Delete sections of extra FirstVisits first (due to cascade)
              await prisma.firstVisitSection.deleteMany({
                where: {
                  firstVisitId: { in: extraFirstVisitIds },
                },
              });

              await prisma.firstVisitVideoSection.deleteMany({
                where: {
                  firstVisitId: { in: extraFirstVisitIds },
                },
              });

              await prisma.firstVisitInformationSection.deleteMany({
                where: {
                  firstVisitId: { in: extraFirstVisitIds },
                },
              });

              // Delete extra FirstVisit records
              await prisma.firstVisit.deleteMany({
                where: {
                  id: { in: extraFirstVisitIds },
                },
              });
            }

            // Update the first FirstVisit
            firstVisitToUpdate = await prisma.firstVisit.update({
              where: { id: firstFirstVisit.id },
              data: {
                updatedAt: new Date(),
              },
              include: {
                sections: {
                  orderBy: { sortOrder: "asc" },
                },
                videoSection: true,
                informationSection: true,
              },
            });

            // Handle general sections: update existing, create new, delete removed
            const existingSections = firstVisitToUpdate.sections;
            const incomingIds = data.sections.map((s) => s.id).filter(Boolean);

            // Delete sections that are no longer in the incoming data
            const sectionsToDelete = existingSections.filter(
              (section) => !incomingIds.includes(section.id)
            );

            if (sectionsToDelete.length > 0) {
              await prisma.firstVisitSection.deleteMany({
                where: {
                  id: { in: sectionsToDelete.map((s) => s.id) },
                },
              });
            }
          }

          // Process each general section: update existing or create new
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
              firstVisitId: firstVisitToUpdate!.id,
              imageUrl,
              title: section.title,
              descriptionTitle: section.descriptionTitle,
              description: section.description,
              sortOrder: section.sortOrder,
            };

            if (section.id) {
              // Update existing section
              await prisma.firstVisitSection.update({
                where: { id: section.id },
                data: sectionData,
              });
            } else {
              // Create new section
              await prisma.firstVisitSection.create({
                data: sectionData,
              });
            }
          }

          // Handle video section
          if (data.videoSection) {
            const videoSectionData = {
              firstVisitId: firstVisitToUpdate!.id,
              videoUrl: data.videoSection.videoUrl,
            };

            if (data.videoSection.id) {
              // Update existing video section
              await prisma.firstVisitVideoSection.update({
                where: { id: data.videoSection.id },
                data: videoSectionData,
              });
            } else {
              // Create new video section or update existing one by firstVisitId
              await prisma.firstVisitVideoSection.upsert({
                where: { firstVisitId: firstVisitToUpdate!.id },
                update: videoSectionData,
                create: videoSectionData,
              });
            }
          } else {
            // Delete video section if not provided
            await prisma.firstVisitVideoSection.deleteMany({
              where: { firstVisitId: firstVisitToUpdate!.id },
            });
          }

          // Handle information section
          if (data.informationSection) {
            let imageUrl: string | undefined;

            // Use uploaded image if we uploaded one for information section
            if (uploadedImages["information_section"]) {
              imageUrl = uploadedImages["information_section"];
            } else {
              // Keep existing image URL if no new image was uploaded
              imageUrl = data.informationSection.imageUrl;
            }

            const informationSectionData = {
              firstVisitId: firstVisitToUpdate!.id,
              imageUrl,
              descriptionTitle: data.informationSection.descriptionTitle,
              description: data.informationSection.description,
            };

            if (data.informationSection.id) {
              // Update existing information section
              await prisma.firstVisitInformationSection.update({
                where: { id: data.informationSection.id },
                data: informationSectionData,
              });
            } else {
              // Create new information section or update existing one by firstVisitId
              await prisma.firstVisitInformationSection.upsert({
                where: { firstVisitId: firstVisitToUpdate!.id },
                update: informationSectionData,
                create: informationSectionData,
              });
            }
          } else {
            // Delete information section if not provided
            await prisma.firstVisitInformationSection.deleteMany({
              where: { firstVisitId: firstVisitToUpdate!.id },
            });
          }

          // Return the updated FirstVisit with new sections
          return (await prisma.firstVisit.findUnique({
            where: { id: firstVisitToUpdate.id },
            include: {
              sections: {
                orderBy: { sortOrder: "asc" },
              },
              videoSection: true,
              informationSection: true,
            },
          })) as FirstVisitWithSections;
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

      console.error("Error creating/updating FirstVisit:", error);
      throw new Error("Failed to save FirstVisit data");
    }
  }

  /**
   * Delete the FirstVisit record and all its sections
   * Also cleans up associated images from Cloudinary
   */
  static async deleteFirstVisit(): Promise<boolean> {
    try {
      const firstVisit = await db.firstVisit.findFirst({
        include: {
          sections: true,
          videoSection: true,
          informationSection: true,
        },
      });

      if (!firstVisit) {
        return true; // Already deleted or doesn't exist
      }

      // Collect image URLs for cleanup
      const imageUrls = [
        ...firstVisit.sections
          .map((section: FirstVisitSection) => section.imageUrl)
          .filter((url): url is string => Boolean(url)),
        firstVisit.informationSection?.imageUrl,
      ].filter((url): url is string => Boolean(url));

      // Delete from database (cascade will handle sections)
      await db.firstVisit.delete({
        where: { id: firstVisit.id },
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
      console.error("Error deleting FirstVisit:", error);
      throw new Error("Failed to delete FirstVisit");
    }
  }

  /**
   * Ensure only one FirstVisit record exists
   * Used for data integrity maintenance
   */
  static async ensureOnlyFirstVisitRecord(): Promise<void> {
    try {
      const firstVisits = await db.firstVisit.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (firstVisits.length > 1) {
        // Keep the first one, delete the rest
        const extraFirstVisitIds = firstVisits
          .slice(1)
          .map((firstVisit: FirstVisit) => firstVisit.id);

        await db.firstVisit.deleteMany({
          where: {
            id: { in: extraFirstVisitIds },
          },
        });
      }
    } catch (error) {
      console.error("Error ensuring single FirstVisit record:", error);
      throw new Error("Failed to ensure single FirstVisit record");
    }
  }
}

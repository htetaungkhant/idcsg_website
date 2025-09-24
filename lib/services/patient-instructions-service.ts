import db from "@/lib/db/db";
import {
  uploadToCloudinaryAsOriginal,
  deleteFromCloudinaryByUrl,
} from "@/lib/cloudinary";
import type {
  PatientInstructions,
  PatientInstructionCard,
  Prisma,
} from "@/app/generated/prisma";

/**
 * Helper function to determine if a file should preserve its format
 * Returns true for non-image files that should maintain their original format
 */
function shouldPreserveFormat(file: File): boolean {
  const imageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ];

  return !imageTypes.includes(file.type.toLowerCase());
}

/**
 * Helper function to determine the appropriate resource type for Cloudinary
 */
function getCloudinaryResourceType(
  file: File
): "image" | "video" | "raw" | "auto" {
  const imageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ];

  const videoTypes = [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
    "video/webm",
    "video/mkv",
    "video/m4v",
  ];

  if (imageTypes.includes(file.type.toLowerCase())) {
    return "image";
  } else if (videoTypes.includes(file.type.toLowerCase())) {
    return "video";
  } else {
    // For documents, PDFs, and other non-media files, use raw to preserve format
    return "raw";
  }
}

export interface PatientInstructionCardData {
  id?: string; // For existing cards during updates
  backgroundImage?: string; // Existing background image URL
  backgroundImageFile?: File; // New background image file to upload
  contentTitle: string; // Required field
  contentImage?: string; // Existing content image URL
  contentImageFile?: File; // New content image file to upload
  contentDescription: string; // Required field
  downloadableFile?: string; // Existing downloadable file URL
  downloadableFileFile?: File; // New downloadable file to upload
}

export interface PatientInstructionsData {
  bannerImage?: string; // Existing banner image URL
  bannerImageFile?: File; // New banner image file to upload
  cards: PatientInstructionCardData[];
}

export interface PatientInstructionsWithCards extends PatientInstructions {
  cards: PatientInstructionCard[];
}

export class PatientInstructionsService {
  /**
   * Get the single PatientInstructions record with all its cards
   * Returns null if no PatientInstructions record exists
   */
  static async getPatientInstructions(): Promise<PatientInstructionsWithCards | null> {
    try {
      const patientInstructions = await db.patientInstructions.findFirst({
        include: {
          cards: true,
        },
      });

      return patientInstructions;
    } catch (error) {
      console.error("Error fetching PatientInstructions:", error);
      throw new Error("Failed to fetch PatientInstructions data");
    }
  }

  /**
   * Create or update the PatientInstructions record
   * Ensures only one PatientInstructions record exists in the system
   * Only deletes images from Cloudinary that are actually being replaced
   */
  static async createOrUpdatePatientInstructions(
    data: PatientInstructionsData
  ): Promise<PatientInstructionsWithCards> {
    const uploadedImages: { [key: string]: string } = {};
    const imagesToDelete: string[] = [];

    try {
      // Get existing PatientInstructions to collect old image URLs for cleanup
      const existingPatientInstructions =
        await db.patientInstructions.findFirst({
          include: {
            cards: true,
          },
        });

      // Collect old banner image URL if being replaced
      if (data.bannerImageFile && existingPatientInstructions?.bannerImage) {
        imagesToDelete.push(existingPatientInstructions.bannerImage);
      }

      // Collect old image URLs that will be replaced for cards
      if (existingPatientInstructions?.cards) {
        for (let i = 0; i < data.cards.length; i++) {
          const newCard = data.cards[i];

          // Only proceed if this card has an ID (existing card)
          if (newCard.id) {
            const existingCard = existingPatientInstructions.cards.find(
              (card) => card.id === newCard.id
            );

            if (existingCard) {
              // Check for background image replacement
              if (newCard.backgroundImageFile && existingCard.backgroundImage) {
                imagesToDelete.push(existingCard.backgroundImage);
              }

              // Check for content image replacement
              if (newCard.contentImageFile && existingCard.contentImage) {
                imagesToDelete.push(existingCard.contentImage);
              }

              // Check for downloadable file replacement
              if (
                newCard.downloadableFileFile &&
                existingCard.downloadableFile
              ) {
                imagesToDelete.push(existingCard.downloadableFile);
              }
            }
          }
        }

        // Also collect files from cards that will be completely removed
        const incomingCardIds = data.cards.map((c) => c.id).filter(Boolean);
        const cardsToRemove = existingPatientInstructions.cards.filter(
          (card) => !incomingCardIds.includes(card.id)
        );

        for (const card of cardsToRemove) {
          if (card.backgroundImage) {
            imagesToDelete.push(card.backgroundImage);
          }
          if (card.contentImage) {
            imagesToDelete.push(card.contentImage);
          }
          if (card.downloadableFile) {
            imagesToDelete.push(card.downloadableFile);
          }
        }
      }

      // Handle image uploads outside of transaction
      // Upload banner image if provided
      if (data.bannerImageFile) {
        const arrayBuffer = await data.bannerImageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await uploadToCloudinaryAsOriginal(buffer, {
          folder: `patient-instructions/banner`,
          public_id: `patient_instructions_banner_${Date.now()}`,
        });
        uploadedImages["banner"] = uploadResult.secure_url;
      }

      // Upload images for cards
      for (let i = 0; i < data.cards.length; i++) {
        const card = data.cards[i];

        // Upload background image
        if (card.backgroundImageFile) {
          const arrayBuffer = await card.backgroundImageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult = await uploadToCloudinaryAsOriginal(buffer, {
            folder: `patient-instructions/cards`,
            public_id: `patient_instructions_card_bg_${Date.now()}_${i}`,
          });
          uploadedImages[`card_${i}_background`] = uploadResult.secure_url;
        }

        // Upload content image
        if (card.contentImageFile) {
          const arrayBuffer = await card.contentImageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult = await uploadToCloudinaryAsOriginal(buffer, {
            folder: `patient-instructions/cards`,
            public_id: `patient_instructions_card_content_${Date.now()}_${i}`,
          });
          uploadedImages[`card_${i}_content`] = uploadResult.secure_url;
        }

        // Upload downloadable file
        if (card.downloadableFileFile) {
          const arrayBuffer = await card.downloadableFileFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const resourceType = getCloudinaryResourceType(
            card.downloadableFileFile
          );
          const preserveFormat = shouldPreserveFormat(
            card.downloadableFileFile
          );

          // Get file extension from the original file name
          const fileName = card.downloadableFileFile.name;
          let fileExtension = "";

          if (fileName && fileName.includes(".")) {
            fileExtension = fileName.substring(fileName.lastIndexOf("."));
          } else {
            // Fallback: try to get extension from MIME type
            const mimeType = card.downloadableFileFile.type;
            if (mimeType === "application/pdf") {
              fileExtension = ".pdf";
            } else if (
              mimeType ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              fileExtension = ".docx";
            } else if (mimeType === "application/msword") {
              fileExtension = ".doc";
            } else if (mimeType === "text/plain") {
              fileExtension = ".txt";
            }
            // Add more MIME type mappings as needed
          }

          const basePublicId = `patient_instructions_file_${Date.now()}_${i}`;
          const publicIdWithExtension =
            resourceType === "raw" && fileExtension
              ? `${basePublicId}${fileExtension}`
              : basePublicId;

          console.log(
            `Uploading file: ${fileName}, MIME: ${card.downloadableFileFile.type}, Resource Type: ${resourceType}, Public ID: ${publicIdWithExtension}`
          );

          const uploadResult = await uploadToCloudinaryAsOriginal(buffer, {
            folder: `patient-instructions/files`,
            public_id: publicIdWithExtension,
            resource_type: resourceType,
            preserve_format: preserveFormat,
          });
          uploadedImages[`card_${i}_file`] = uploadResult.secure_url;
        }
      }

      // Database operations in transaction
      const result = await db.$transaction(
        async (prisma: Prisma.TransactionClient) => {
          // Check for existing PatientInstructions records
          const existingPatientInstructionsList =
            await prisma.patientInstructions.findMany({
              include: {
                cards: true,
              },
              orderBy: { createdAt: "asc" },
            });

          let patientInstructionsToUpdate: PatientInstructionsWithCards | null =
            null;

          if (existingPatientInstructionsList.length === 0) {
            // No existing PatientInstructions - create new one
            patientInstructionsToUpdate =
              await prisma.patientInstructions.create({
                data: {
                  bannerImage: uploadedImages["banner"] || data.bannerImage,
                },
                include: {
                  cards: true,
                },
              });
          } else {
            // Use the first PatientInstructions and delete others if they exist
            const firstPatientInstructions = existingPatientInstructionsList[0];
            patientInstructionsToUpdate = firstPatientInstructions;

            // Delete extra PatientInstructions records if they exist
            if (existingPatientInstructionsList.length > 1) {
              const extraPatientInstructionsIds =
                existingPatientInstructionsList
                  .slice(1)
                  .map((pi: PatientInstructions) => pi.id);

              // Delete cards of extra PatientInstructions first (due to cascade)
              await prisma.patientInstructionCard.deleteMany({
                where: {
                  patientInstructionsId: { in: extraPatientInstructionsIds },
                },
              });

              // Delete extra PatientInstructions records
              await prisma.patientInstructions.deleteMany({
                where: {
                  id: { in: extraPatientInstructionsIds },
                },
              });
            }

            // Update the first PatientInstructions
            patientInstructionsToUpdate =
              await prisma.patientInstructions.update({
                where: { id: firstPatientInstructions.id },
                data: {
                  bannerImage: uploadedImages["banner"] || data.bannerImage,
                  updatedAt: new Date(),
                },
                include: {
                  cards: true,
                },
              });

            // Handle cards: update existing, create new, delete removed
            const existingCards = patientInstructionsToUpdate.cards;
            const incomingIds = data.cards.map((c) => c.id).filter(Boolean);

            // Delete cards that are no longer in the incoming data
            const cardsToDelete = existingCards.filter(
              (card) => !incomingIds.includes(card.id)
            );

            if (cardsToDelete.length > 0) {
              await prisma.patientInstructionCard.deleteMany({
                where: {
                  id: { in: cardsToDelete.map((c) => c.id) },
                },
              });
            }
          }

          // Process each card: update existing or create new
          for (let index = 0; index < data.cards.length; index++) {
            const card = data.cards[index];

            // Determine image URLs
            let backgroundImage: string;
            let contentImage: string | undefined;
            let downloadableFile: string | undefined;

            // Background image (required)
            if (uploadedImages[`card_${index}_background`]) {
              backgroundImage = uploadedImages[`card_${index}_background`];
            } else if (card.backgroundImage) {
              backgroundImage = card.backgroundImage;
            } else {
              throw new Error(
                `Background image is required for card ${index + 1}`
              );
            }

            // Content image (optional)
            if (uploadedImages[`card_${index}_content`]) {
              contentImage = uploadedImages[`card_${index}_content`];
            } else {
              contentImage = card.contentImage;
            }

            // Downloadable file (optional)
            if (uploadedImages[`card_${index}_file`]) {
              downloadableFile = uploadedImages[`card_${index}_file`];
            } else {
              downloadableFile = card.downloadableFile;
            }

            const cardData = {
              patientInstructionsId: patientInstructionsToUpdate!.id,
              backgroundImage,
              contentTitle: card.contentTitle,
              contentImage,
              contentDescription: card.contentDescription,
              downloadableFile,
            };

            if (card.id) {
              // Update existing card
              await prisma.patientInstructionCard.update({
                where: { id: card.id },
                data: cardData,
              });
            } else {
              // Create new card
              await prisma.patientInstructionCard.create({
                data: cardData,
              });
            }
          }

          // Return the updated PatientInstructions with new cards
          return (await prisma.patientInstructions.findUnique({
            where: { id: patientInstructionsToUpdate!.id },
            include: {
              cards: true,
            },
          })) as PatientInstructionsWithCards;
        }
      );

      // After successful database transaction, delete old images from Cloudinary
      if (imagesToDelete.length > 0) {
        console.log(
          `Cleaning up ${imagesToDelete.length} old files:`,
          imagesToDelete
        );
      }

      for (const imageUrl of imagesToDelete) {
        try {
          // Detect resource type from URL for proper deletion
          let resourceType: "image" | "video" | "raw" = "image";
          if (imageUrl.includes("/raw/upload/")) {
            resourceType = "raw";
          } else if (imageUrl.includes("/video/upload/")) {
            resourceType = "video";
          }

          await deleteFromCloudinaryByUrl(imageUrl, resourceType);
          console.log(`Successfully deleted old file: ${imageUrl}`);
        } catch (cleanupError) {
          console.error("Failed to cleanup old file:", imageUrl, cleanupError);
          // Continue with other deletions even if one fails
        }
      }

      return result;
    } catch (error) {
      // Cleanup uploaded images on error (but don't delete old images since transaction failed)
      for (const imageUrl of Object.values(uploadedImages)) {
        try {
          // Detect resource type from URL for proper deletion
          let resourceType: "image" | "video" | "raw" = "image";
          if (imageUrl.includes("/raw/upload/")) {
            resourceType = "raw";
          } else if (imageUrl.includes("/video/upload/")) {
            resourceType = "video";
          }

          await deleteFromCloudinaryByUrl(imageUrl, resourceType);
        } catch (cleanupError) {
          console.error(
            "Failed to cleanup uploaded file:",
            imageUrl,
            cleanupError
          );
        }
      }

      console.error("Error creating/updating PatientInstructions:", error);
      throw new Error("Failed to save PatientInstructions data");
    }
  }

  /**
   * Delete the PatientInstructions record and all its cards
   * Also cleans up associated files from Cloudinary
   */
  static async deletePatientInstructions(): Promise<boolean> {
    try {
      const patientInstructions = await db.patientInstructions.findFirst({
        include: {
          cards: true,
        },
      });

      if (!patientInstructions) {
        return true; // Already deleted or doesn't exist
      }

      // Collect file URLs for cleanup
      const fileUrls = [
        patientInstructions.bannerImage,
        ...patientInstructions.cards.flatMap((card: PatientInstructionCard) => [
          card.backgroundImage,
          card.contentImage,
          card.downloadableFile,
        ]),
      ].filter((url): url is string => Boolean(url));

      // Delete from database (cascade will handle cards)
      await db.patientInstructions.delete({
        where: { id: patientInstructions.id },
      });

      // Cleanup files from Cloudinary
      for (const fileUrl of fileUrls) {
        try {
          // Detect resource type from URL for proper deletion
          let resourceType: "image" | "video" | "raw" = "image";
          if (fileUrl.includes("/raw/upload/")) {
            resourceType = "raw";
          } else if (fileUrl.includes("/video/upload/")) {
            resourceType = "video";
          }

          await deleteFromCloudinaryByUrl(fileUrl, resourceType);
        } catch (cleanupError) {
          console.error("Failed to cleanup file:", fileUrl, cleanupError);
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting PatientInstructions:", error);
      throw new Error("Failed to delete PatientInstructions");
    }
  }

  /**
   * Ensure only one PatientInstructions record exists
   * Used for data integrity maintenance
   */
  static async ensureOnlyPatientInstructionsRecord(): Promise<void> {
    try {
      const patientInstructionsList = await db.patientInstructions.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (patientInstructionsList.length > 1) {
        // Keep the first one, delete the rest
        const extraPatientInstructionsIds = patientInstructionsList
          .slice(1)
          .map((pi: PatientInstructions) => pi.id);

        await db.patientInstructions.deleteMany({
          where: {
            id: { in: extraPatientInstructionsIds },
          },
        });
      }
    } catch (error) {
      console.error("Error ensuring single PatientInstructions record:", error);
      throw new Error("Failed to ensure single PatientInstructions record");
    }
  }
}

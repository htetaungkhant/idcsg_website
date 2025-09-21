import db from "@/lib/db/db";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  type CloudinaryUploadResult,
} from "@/lib/cloudinary";

export interface CreateHomepageSettingsData {
  backgroundMediaUrl?: string | null;
  backgroundMediaType?: "image" | "video" | null;
  backgroundColor?: string | null;
  backgroundOpacity: number;
}

export interface UpdateHomepageSettingsData extends CreateHomepageSettingsData {
  id: string;
}

export class HomepageSettingsService {
  /**
   * Get the current homepage settings (there should only be one)
   */
  static async getActiveSettings() {
    try {
      const settings = await db.homepageSettings.findFirst({
        orderBy: { createdAt: "asc" },
      });

      return settings;
    } catch (error) {
      console.error("Error fetching homepage settings:", error);
      throw new Error("Failed to fetch homepage settings");
    }
  }

  /**
   * Create or update homepage settings with media upload
   */
  static async createOrUpdateSettings(
    data: CreateHomepageSettingsData,
    mediaFile?: Buffer,
    mediaFileName?: string
  ) {
    try {
      let cloudinaryResult: CloudinaryUploadResult | null = null;

      // Upload media to Cloudinary if provided
      if (mediaFile && mediaFileName) {
        const fileExtension = mediaFileName.split(".").pop()?.toLowerCase();
        const isVideo = ["mp4", "webm", "mov", "avi"].includes(
          fileExtension || ""
        );

        cloudinaryResult = await uploadToCloudinary(mediaFile, {
          folder: "homepage-backgrounds",
          resource_type: isVideo ? "video" : "image",
          public_id: `homepage-bg-${Date.now()}`,
        });
      }

      // Start a transaction to ensure data consistency
      const result = await db.$transaction(async (tx) => {
        // Get all existing homepage settings
        const existingSettings = await tx.homepageSettings.findMany({
          orderBy: { createdAt: "asc" }, // Order by creation date to get the first one
        });

        if (existingSettings.length === 0) {
          // No existing settings - create new one
          const newSettings = await tx.homepageSettings.create({
            data: {
              backgroundMediaUrl:
                cloudinaryResult?.secure_url || data.backgroundMediaUrl,
              backgroundMediaType:
                cloudinaryResult?.resource_type === "video"
                  ? "video"
                  : cloudinaryResult?.resource_type === "image"
                  ? "image"
                  : data.backgroundMediaType,
              backgroundColor: data.backgroundColor,
              backgroundOpacity: data.backgroundOpacity,
              isActive: true,
            },
          });

          return newSettings;
        } else {
          // Existing settings found - update the first one
          const firstSettings = existingSettings[0];

          // Clean up old media from Cloudinary if uploading new media
          if (mediaFile && firstSettings.backgroundMediaUrl) {
            try {
              const oldPublicId = this.extractPublicIdFromUrl(
                firstSettings.backgroundMediaUrl
              );
              if (oldPublicId) {
                await deleteFromCloudinary(
                  oldPublicId,
                  firstSettings.backgroundMediaType as "image" | "video"
                );
              }
            } catch (cleanupError) {
              console.warn("Failed to cleanup old media:", cleanupError);
            }
          }

          // Update the first settings
          const updatedSettings = await tx.homepageSettings.update({
            where: { id: firstSettings.id },
            data: {
              backgroundMediaUrl:
                cloudinaryResult?.secure_url ||
                data.backgroundMediaUrl ||
                firstSettings.backgroundMediaUrl,
              backgroundMediaType:
                cloudinaryResult?.resource_type === "video"
                  ? "video"
                  : cloudinaryResult?.resource_type === "image"
                  ? "image"
                  : data.backgroundMediaType ||
                    firstSettings.backgroundMediaType,
              backgroundColor:
                data.backgroundColor !== undefined
                  ? data.backgroundColor
                  : firstSettings.backgroundColor,
              backgroundOpacity: data.backgroundOpacity,
              isActive: true,
            },
          });

          // If there are multiple settings, delete the remaining ones
          if (existingSettings.length > 1) {
            const settingsToDelete = existingSettings.slice(1);

            // Clean up media from Cloudinary for settings being deleted
            for (const settingToDelete of settingsToDelete) {
              if (settingToDelete.backgroundMediaUrl) {
                try {
                  const publicId = this.extractPublicIdFromUrl(
                    settingToDelete.backgroundMediaUrl
                  );
                  if (publicId) {
                    await deleteFromCloudinary(
                      publicId,
                      settingToDelete.backgroundMediaType as "image" | "video"
                    );
                  }
                } catch (cleanupError) {
                  console.warn(
                    "Failed to cleanup media for deleted settings:",
                    cleanupError
                  );
                }
              }
            }

            // Delete remaining settings from database
            await tx.homepageSettings.deleteMany({
              where: {
                id: {
                  in: settingsToDelete.map((setting) => setting.id),
                },
              },
            });
          }

          return updatedSettings;
        }
      });

      return result;
    } catch (error) {
      console.error("Error creating/updating homepage settings:", error);
      throw new Error("Failed to save homepage settings");
    }
  }

  /**
   * Update existing settings
   */
  static async updateSettings(
    id: string,
    data: Partial<CreateHomepageSettingsData>,
    mediaFile?: Buffer,
    mediaFileName?: string
  ) {
    try {
      let cloudinaryResult: CloudinaryUploadResult | null = null;

      // Get current settings to potentially clean up old media
      const currentSettings = await db.homepageSettings.findUnique({
        where: { id },
      });

      if (!currentSettings) {
        throw new Error("Settings not found");
      }

      // Upload new media if provided
      if (mediaFile && mediaFileName) {
        const fileExtension = mediaFileName.split(".").pop()?.toLowerCase();
        const isVideo = ["mp4", "webm", "mov", "avi"].includes(
          fileExtension || ""
        );

        cloudinaryResult = await uploadToCloudinary(mediaFile, {
          folder: "homepage-backgrounds",
          resource_type: isVideo ? "video" : "image",
          public_id: `homepage-bg-${Date.now()}`,
        });

        // Clean up old media from Cloudinary if it exists
        if (currentSettings.backgroundMediaUrl) {
          try {
            const oldPublicId = this.extractPublicIdFromUrl(
              currentSettings.backgroundMediaUrl
            );
            if (oldPublicId) {
              await deleteFromCloudinary(
                oldPublicId,
                currentSettings.backgroundMediaType as "image" | "video"
              );
            }
          } catch (cleanupError) {
            console.warn("Failed to cleanup old media:", cleanupError);
            // Don't throw here, as the main operation should still succeed
          }
        }
      }

      // Update settings
      const updatedSettings = await db.homepageSettings.update({
        where: { id },
        data: {
          backgroundMediaUrl:
            cloudinaryResult?.secure_url || data.backgroundMediaUrl,
          backgroundMediaType:
            cloudinaryResult?.resource_type === "video"
              ? "video"
              : cloudinaryResult?.resource_type === "image"
              ? "image"
              : data.backgroundMediaType,
          backgroundColor: data.backgroundColor,
          backgroundOpacity:
            data.backgroundOpacity ?? currentSettings.backgroundOpacity,
        },
      });

      return updatedSettings;
    } catch (error) {
      console.error("Error updating homepage settings:", error);
      throw new Error("Failed to update homepage settings");
    }
  }

  /**
   * Delete settings and associated media
   */
  static async deleteSettings(id: string) {
    try {
      const settings = await db.homepageSettings.findUnique({
        where: { id },
      });

      if (!settings) {
        throw new Error("Settings not found");
      }

      // Delete from Cloudinary if media exists
      if (settings.backgroundMediaUrl) {
        try {
          const publicId = this.extractPublicIdFromUrl(
            settings.backgroundMediaUrl
          );
          if (publicId) {
            await deleteFromCloudinary(
              publicId,
              settings.backgroundMediaType as "image" | "video"
            );
          }
        } catch (cleanupError) {
          console.warn("Failed to cleanup media:", cleanupError);
        }
      }

      // Delete from database
      await db.homepageSettings.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting homepage settings:", error);
      throw new Error("Failed to delete homepage settings");
    }
  }

  /**
   * Remove only the background media, keep other settings intact
   */
  static async removeMediaOnly(id: string) {
    try {
      const settings = await db.homepageSettings.findUnique({
        where: { id },
      });

      if (!settings) {
        throw new Error("Settings not found");
      }

      // Delete media from Cloudinary if it exists
      if (settings.backgroundMediaUrl) {
        try {
          const publicId = this.extractPublicIdFromUrl(
            settings.backgroundMediaUrl
          );
          if (publicId) {
            await deleteFromCloudinary(
              publicId,
              settings.backgroundMediaType as "image" | "video"
            );
          }
        } catch (cleanupError) {
          console.warn("Failed to cleanup media:", cleanupError);
        }
      }

      // Update settings to remove only media-related fields
      const updatedSettings = await db.homepageSettings.update({
        where: { id },
        data: {
          backgroundMediaUrl: null,
          backgroundMediaType: null,
        },
      });

      return updatedSettings;
    } catch (error) {
      console.error("Error removing media from homepage settings:", error);
      throw new Error("Failed to remove background media");
    }
  }

  /**
   * Extract public_id from Cloudinary URL
   */
  private static extractPublicIdFromUrl(url: string): string | null {
    try {
      // Cloudinary URLs typically follow this pattern:
      // https://res.cloudinary.com/[cloud_name]/[resource_type]/upload/[transformations]/[folder]/[public_id].[format]
      const urlParts = url.split("/");
      const uploadIndex = urlParts.indexOf("upload");

      if (uploadIndex === -1) return null;

      // Get everything after 'upload', skipping version numbers if they exist (v1234567890)
      let afterUpload = urlParts.slice(uploadIndex + 1);

      // Skip version number if it exists (starts with 'v' followed by digits)
      if (afterUpload[0] && afterUpload[0].match(/^v\d+$/)) {
        afterUpload = afterUpload.slice(1);
      }

      if (afterUpload.length === 0) return null;

      // The last part contains the filename with extension
      const lastPart = afterUpload[afterUpload.length - 1];
      const filenameWithoutExtension = lastPart.split(".")[0];

      // Reconstruct the full public_id including folder path
      const folderParts = afterUpload.slice(0, -1); // All parts except the last one
      folderParts.push(filenameWithoutExtension);

      const fullPublicId = folderParts.join("/");

      console.log(`Extracted public_id: ${fullPublicId} from URL: ${url}`);
      return fullPublicId;
    } catch (error) {
      console.error("Error extracting public_id from URL:", error);
      return null;
    }
  }
}

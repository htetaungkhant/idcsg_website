// Cloudinary configuration and upload utilities
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check for required environment variables
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing required Cloudinary environment variables");
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video" | "raw" | "auto";
  format: string;
  bytes: number;
  asset_id?: string;
  version?: number;
  version_id?: string;
  signature?: string;
  api_key?: string;
  width?: number;
  height?: number;
  created_at?: string;
  tags?: string[];
  pages?: number;
  type?: "upload" | "fetch";
  etag?: string;
  placeholder?: boolean;
  url?: string;
  asset_folder?: string;
  display_name?: string;
  original_filename?: string;
  original_extension?: string;
  original_width?: number;
  original_height?: number;
  duration?: number;
}

/**
 * Upload a file buffer to Cloudinary
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder?: string;
    resource_type?: "image" | "video" | "auto";
    public_id?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || "homepage-backgrounds",
      resource_type: options.resource_type || "auto",
      public_id: options.public_id,
      // Optimize images and videos
      quality: "auto:best",
      fetch_format: "auto",
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error("Upload failed - no result returned"));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Upload a file buffer to Cloudinary
 */
export async function uploadToCloudinaryAsOriginal(
  fileBuffer: Buffer,
  options: {
    folder?: string;
    resource_type?: "image" | "video" | "auto" | "raw";
    public_id?: string;
    preserve_format?: boolean;
  } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const resourceType = options.resource_type || "auto";

    const uploadOptions: {
      folder: string;
      resource_type: "image" | "video" | "auto" | "raw";
      public_id?: string;
      quality?: string;
      fetch_format?: string;
    } = {
      folder: options.folder || "homepage-backgrounds",
      resource_type: resourceType,
      public_id: options.public_id,
    };

    // For raw files, don't add any format optimization settings
    if (resourceType === "raw") {
      // Raw files should maintain their original format without any transformations
    } else if (resourceType === "image" || !options.preserve_format) {
      // Only add optimization settings for images and videos
      uploadOptions.quality = "auto:best";
      uploadOptions.fetch_format = "auto";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error("Upload failed - no result returned"));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ result: string }> {
  try {
    console.log(
      `Attempting to delete from Cloudinary: ${publicId} (type: ${resourceType})`
    );

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    console.log(`Cloudinary deletion result:`, result);

    if (result.result === "ok") {
      console.log(`Successfully deleted ${publicId} from Cloudinary`);
    } else if (result.result === "not found") {
      console.warn(
        `File ${publicId} not found in Cloudinary (may have been already deleted)`
      );
    } else {
      console.warn(`Unexpected result from Cloudinary deletion:`, result);
    }

    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}

/**
 * Extract public_id from a Cloudinary URL
 */
export function extractPublicIdFromUrl(cloudinaryUrl: string): string {
  try {
    // Extract the path part after the upload version
    // Format: https://res.cloudinary.com/cloudname/image/upload/v1234567890/folder/file.jpg
    const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/;
    const match = cloudinaryUrl.match(regex);

    if (match && match[1]) {
      // Remove the file extension if it exists
      return match[1].replace(/\.[^/.]+$/, "");
    }

    throw new Error(`Invalid Cloudinary URL format: ${cloudinaryUrl}`);
  } catch (error) {
    console.error(
      "Failed to extract public_id from URL:",
      cloudinaryUrl,
      error
    );
    throw error;
  }
}

/**
 * Delete a file from Cloudinary using either public_id or full URL
 */
export async function deleteFromCloudinaryByUrl(
  urlOrPublicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ result: string }> {
  try {
    let publicId: string;

    // Check if it's a full URL or already a public_id
    if (urlOrPublicId.startsWith("http")) {
      publicId = extractPublicIdFromUrl(urlOrPublicId);

      // Try to determine resource type from URL if not specified
      if (resourceType === "image" && urlOrPublicId.includes("/raw/upload/")) {
        resourceType = "raw";
      } else if (
        resourceType === "image" &&
        urlOrPublicId.includes("/video/upload/")
      ) {
        resourceType = "video";
      }
    } else {
      publicId = urlOrPublicId;
    }

    return await deleteFromCloudinary(publicId, resourceType);
  } catch (error) {
    console.error("Error deleting from Cloudinary by URL:", error);
    throw error;
  }
}

/**
 * Delete an entire folder from Cloudinary
 */
export async function deleteFolderFromCloudinary(
  folderPath: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ deleted: string[] }> {
  try {
    console.log(
      `Attempting to delete folder from Cloudinary: ${folderPath} (type: ${resourceType})`
    );

    // First, delete all resources in the folder
    const result = await cloudinary.api.delete_resources_by_prefix(folderPath, {
      resource_type: resourceType,
    });

    console.log(`Cloudinary folder deletion result:`, result);

    let deletedFiles: string[] = [];
    if (result.deleted && Object.keys(result.deleted).length > 0) {
      deletedFiles = Object.keys(result.deleted);
      console.log(
        `Successfully deleted ${deletedFiles.length} files from folder ${folderPath}`
      );
    } else {
      console.warn(
        `No files found in folder ${folderPath} or folder already empty`
      );
    }

    // Then, delete the empty folder structure
    try {
      console.log(`Attempting to delete empty folder: ${folderPath}`);
      const folderResult = await cloudinary.api.delete_folder(folderPath);
      console.log(`Folder deletion result:`, folderResult);
      console.log(`Successfully deleted folder: ${folderPath}`);
    } catch (folderError: unknown) {
      // Folder deletion might fail if there are subfolders or if it doesn't exist
      const errorMessage =
        folderError instanceof Error
          ? folderError.message
          : String(folderError);
      console.warn(`Failed to delete folder ${folderPath}:`, errorMessage);
    }

    return { deleted: deletedFiles };
  } catch (error) {
    console.error("Error deleting folder from Cloudinary:", error);
    throw error;
  }
}

/**
 * Get optimized Cloudinary URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    quality: options.quality || "auto:best",
    format: options.format || "auto",
    crop: "fill",
    fetch_format: "auto",
  });
}

export { cloudinary };

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
  width?: number;
  height?: number;
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
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
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

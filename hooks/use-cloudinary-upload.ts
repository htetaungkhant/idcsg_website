import { SignApiOptions } from "cloudinary";
import { useState } from "react";
import { CloudinaryUploadResult } from "@/lib/cloudinary";

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (
    file: File,
    uploadOptions: SignApiOptions = {}
  ) => {
    if (!file) throw new Error("No file provided");

    setUploading(true);
    setProgress(0);

    try {
      // Request signed upload parameters from the backend
      const signedParamsResponse = await fetch("/api/upload-signed-params", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: uploadOptions.folder || "admin-uploads",
          resourceType: uploadOptions.resourceType || "auto",
          transformation: uploadOptions.transformation,
          maxBytes: uploadOptions.maxBytes,
          allowedFormats: uploadOptions.allowedFormats,
        }),
      });

      if (!signedParamsResponse.ok) {
        throw new Error("Failed to get signed upload parameters");
      }

      const signedParams = await signedParamsResponse.json();
      const {
        signature,
        timestamp,
        cloudName,
        apiKey,
        resourceType,
        uploadParams,
      } = signedParams;

      // Prepare form data for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("resource_type", resourceType || "auto");

      // Append any additional upload parameters
      if (uploadParams.folder) {
        formData.append("folder", uploadParams.folder);
      }
      if (uploadParams.transformation) {
        formData.append("transformation", uploadParams.transformation);
      }
      if (uploadParams.maxBytes) {
        formData.append("bytes_limit", uploadParams.maxBytes.toString());
      }
      if (uploadParams.allowedFormats) {
        formData.append(
          "allowed_formats",
          uploadParams.allowedFormats.join(",")
        );
      }

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${
          resourceType || "auto"
        }/upload`,
        {
          method: "POST",
          body: formData,
          // Optional: Track upload progress
          // Note: Fetch API does not support progress natively; this is a workaround using XMLHttpRequest
          // If you need progress tracking, consider using XMLHttpRequest or a library like axios
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const cloudinaryResult: CloudinaryUploadResult =
        await uploadResponse.json();
      setProgress(100);
      return cloudinaryResult;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadImage, uploading, progress };
};

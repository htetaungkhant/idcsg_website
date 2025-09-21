"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  backgroundSettingsSchema,
  type BackgroundSettingsSchema,
} from "@/lib/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HomepageSettings {
  id: string;
  backgroundMediaUrl: string | null;
  backgroundMediaType: "image" | "video" | null;
  backgroundColor: string | null;
  backgroundOpacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function BackgroundSettingsForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [currentSettings, setCurrentSettings] =
    useState<HomepageSettings | null>(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<BackgroundSettingsSchema>({
    resolver: zodResolver(backgroundSettingsSchema),
    defaultValues: {
      backgroundColor: "",
      backgroundOpacity: 100,
    },
  });

  // Watch form values for real-time updates
  const watchedBackgroundColor = watch("backgroundColor");
  const watchedBackgroundOpacity = watch("backgroundOpacity");

  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/homepage-settings");
        const result = await response.json();

        if (result.success && result.data) {
          const settings = result.data as HomepageSettings;
          setCurrentSettings(settings);

          // Set form values
          if (settings.backgroundColor) {
            setBackgroundColor(settings.backgroundColor);
            setValue("backgroundColor", settings.backgroundColor);
          }

          setBackgroundOpacity(settings.backgroundOpacity);
          setValue("backgroundOpacity", settings.backgroundOpacity);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("backgroundMedia", file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue("backgroundMedia", undefined);

    // Clear the file input
    const fileInput = document.getElementById(
      "background-media"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
    setValue("backgroundColor", color);
  };

  const handleOpacityChange = (opacity: number) => {
    setBackgroundOpacity(opacity);
    setValue("backgroundOpacity", opacity);
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    setBackgroundColor("");
    setBackgroundOpacity(100);

    // Clear file input
    const fileInput = document.getElementById(
      "background-media"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleRemoveCurrentMedia = async () => {
    if (!currentSettings?.backgroundMediaUrl) {
      return;
    }

    setIsRemoving(true);
    try {
      // Call the media-specific deletion endpoint
      const response = await fetch("/api/homepage-settings/media", {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Background media removed successfully!");
        // Update current settings to reflect the change
        setCurrentSettings(result.data);
        setShowRemoveDialog(false);
      } else {
        throw new Error(result.error || "Failed to remove media");
      }
    } catch (error) {
      console.error("Error removing media:", error);
      toast.error(
        `Error: ${
          error instanceof Error ? error.message : "Failed to remove media"
        }`
      );
    } finally {
      setIsRemoving(false);
    }
  };

  const onSubmit = async (data: BackgroundSettingsSchema) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add background media if present
      if (data.backgroundMedia) {
        formData.append("backgroundMedia", data.backgroundMedia);
      }

      // Add background color if present
      if (data.backgroundColor) {
        formData.append("backgroundColor", data.backgroundColor);
      }

      // Add background opacity
      formData.append("backgroundOpacity", data.backgroundOpacity.toString());

      // Submit to API
      const response = await fetch("/api/homepage-settings", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Homepage settings saved successfully!");
        // Optionally refresh the page or update UI state
        window.location.reload();

        // reset all
        // handleReset();
      } else {
        throw new Error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        `Error: ${
          error instanceof Error
            ? error.message
            : "Failed to save settings. Please try again."
        }`
      );
    }
  };

  // Calculate preview background with opacity
  const previewBackgroundStyle = {
    backgroundColor: watchedBackgroundColor || backgroundColor,
    opacity: (watchedBackgroundOpacity || backgroundOpacity) / 100,
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Background Settings
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Configure the homepage background media and colors
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Form Error Display */}
          {errors.backgroundMedia && (
            <p className="text-sm text-red-600 mt-1">
              {errors.backgroundMedia.message}
            </p>
          )}
          {/* Background Media Upload Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium text-gray-900">
                Background Media
              </h3>
              <span className="text-xs text-gray-500">
                Supports: JPG, PNG, GIF, MP4, WebM
              </span>
            </div>

            {/* Current/Existing Media from Server */}
            {currentSettings?.backgroundMediaUrl && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-semibold text-blue-900">
                    Current Background Media
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowRemoveDialog(true)}
                    disabled={isSubmitting || isRemoving}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove current background media"
                  >
                    {isRemoving ? "Removing..." : "Remove"}
                  </button>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {currentSettings.backgroundMediaType === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentSettings.backgroundMediaUrl}
                        alt="Current background"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={currentSettings.backgroundMediaUrl}
                        className="w-full h-full object-cover rounded-lg"
                        muted
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900">
                      {currentSettings.backgroundMediaType === "image"
                        ? "Current Image"
                        : "Current Video"}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Type: {currentSettings.backgroundMediaType?.toUpperCase()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Stored on Cloudinary
                    </p>
                    <a
                      href={currentSettings.backgroundMediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
                    >
                      View full size
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Upload New Media
              </h4>
              <label
                htmlFor="background-media"
                className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum file size: 10MB
                    </p>
                  </div>
                </div>
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                id="background-media"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>

            {/* New File Preview */}
            {selectedFile && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-sm font-semibold text-green-900 mb-3">
                  New Upload Preview
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {selectedFile.type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrl || ""}
                          alt="Upload preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        {selectedFile.type} •{" "}
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Ready to upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Background Color Section */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900">
              Background Color
            </h3>
            <p className="text-sm text-gray-600">
              Choose a fallback color or overlay color for your background
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Picker */}
              <div className="space-y-3">
                <label
                  htmlFor="background-color"
                  className="block text-sm font-medium text-gray-700"
                >
                  Color Picker
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="background-color"
                    value={watchedBackgroundColor || backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-10 rounded-md border border-gray-300 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    placeholder="#000000"
                    value={watchedBackgroundColor || backgroundColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.backgroundColor && (
                  <p className="text-sm text-red-600">
                    {errors.backgroundColor.message}
                  </p>
                )}
              </div>

              {/* Opacity Slider */}
              <div className="space-y-3">
                <label
                  htmlFor="background-opacity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Opacity ({watchedBackgroundOpacity || backgroundOpacity}%)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    id="background-opacity"
                    min="0"
                    max="100"
                    value={watchedBackgroundOpacity || backgroundOpacity}
                    onChange={(e) =>
                      handleOpacityChange(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="w-full h-16 rounded-md border border-gray-300 relative overflow-hidden">
                <div
                  className="w-full h-full rounded-md flex items-center justify-center bg-black"
                  style={previewBackgroundStyle}
                >
                  <span className="text-white text-sm font-medium mix-blend-difference">
                    Background Preview
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Changes will be applied immediately after saving</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Remove Media Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Background Media</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the current background media from
              your website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveCurrentMedia}
              disabled={isRemoving}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {isRemoving ? "Removing..." : "Remove Media"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

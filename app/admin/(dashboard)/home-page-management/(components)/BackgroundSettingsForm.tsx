"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  backgroundSettingsSchema,
  type BackgroundSettingsSchema,
} from "@/lib/schema";

export function BackgroundSettingsForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<BackgroundSettingsSchema>({
    resolver: zodResolver(backgroundSettingsSchema),
    defaultValues: {
      backgroundColor: "#000000",
      backgroundOpacity: 100,
    },
  });

  // Watch form values for real-time updates
  const watchedBackgroundColor = watch("backgroundColor");
  const watchedBackgroundOpacity = watch("backgroundOpacity");

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

  const onSubmit = async (data: BackgroundSettingsSchema) => {
    try {
      console.log("Form data:", data);
      // TODO: Implement actual submission logic
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    setBackgroundColor("#000000");
    setBackgroundOpacity(100);

    // Clear file input
    const fileInput = document.getElementById(
      "background-media"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Form Error Display */}
        {errors.backgroundMedia && (
          <p className="text-sm text-red-600 mt-1">
            {errors.backgroundMedia.message}
          </p>
        )}
        {/* Background Media Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-900">
              Background Media
            </h3>
            <span className="text-xs text-gray-500">
              Supports: JPG, PNG, GIF, MP4, WebM
            </span>
          </div>

          {/* Upload Area */}
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
                <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
              </div>
            </div>
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            className="sr-only"
            id="background-media"
            onChange={handleFileChange}
          />

          {/* Current Media Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  {previewUrl ? (
                    selectedFile?.type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <svg
                        className="w-6 h-6 text-gray-600"
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
                    )
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile ? selectedFile.name : "No media selected"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedFile
                      ? `${selectedFile.type} • ${(
                          selectedFile.size /
                          (1024 * 1024)
                        ).toFixed(2)} MB`
                      : "Upload an image or video to see preview"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                disabled={!selectedFile}
              >
                Remove
              </button>
            </div>
          </div>
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
                />
                <input
                  type="text"
                  placeholder="#000000"
                  value={watchedBackgroundColor || backgroundColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="w-full h-full rounded-md flex items-center justify-center"
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
    </div>
  );
}

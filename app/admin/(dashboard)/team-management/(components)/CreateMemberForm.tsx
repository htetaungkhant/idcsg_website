"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, User, X, Camera } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { memberFormSchema, type MemberFormSchema } from "@/lib/schema";

export function MemberForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<MemberFormSchema>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      memberImage: undefined,
      memberName: "",
      memberDesignation: "",
      team: undefined,
      description: "",
    },
  });

  // Watch the team field value
  const teamValue = watch("team");

  const handleImageChange = (file: File | null) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setValue("memberImage", file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleImageChange(files[0]);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);

    // Clear the file input
    const fileInput = document.getElementById(
      "new-member-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
      // Trigger form validation by dispatching a change event
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const onSubmit = async (data: MemberFormSchema) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add required fields
      formData.append("memberName", data.memberName);
      formData.append("team", data.team);
      formData.append("description", data.description);

      // Add optional fields only if they have values
      if (data.memberImage) {
        formData.append("memberImage", data.memberImage);
      }

      if (data.memberDesignation && data.memberDesignation.trim() !== "") {
        formData.append("memberDesignation", data.memberDesignation);
      }

      // Make API call to create member
      const response = await fetch("/api/team-members", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create team member");
      }

      toast.success("Team member added successfully!");

      // Reset form after successful submission
      reset();
      setPreviewUrl(null);

      // Clear the file input
      const fileInput = document.getElementById(
        "new-member-image"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error adding member:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add member. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <User className="h-6 w-6 text-blue-600" />
            Add New Team Member
          </h1>
          <p className="text-gray-600 mt-1">
            Fill in the details below to add a new member to your team.
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Member Image Upload */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Member Photo</Label>

              {/* Hidden file input */}
              <input
                id="new-member-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Image Preview */}
              {previewUrl ? (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={previewUrl}
                    alt="Member preview"
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                    ${
                      isDragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("new-member-image")?.click()
                  }
                >
                  <div className="space-y-3">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {errors.memberImage && (
                <p className="text-sm text-red-600">
                  {errors.memberImage.message}
                </p>
              )}
            </div>

            {/* Form Fields in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Member Name */}
              <div className="space-y-2">
                <Label htmlFor="memberName" className="text-base font-semibold">
                  Member Name *
                </Label>
                <Input
                  id="memberName"
                  {...register("memberName")}
                  placeholder="Enter full name"
                  className="h-12"
                />
                {errors.memberName && (
                  <p className="text-sm text-red-600">
                    {errors.memberName.message}
                  </p>
                )}
              </div>

              {/* Member Designation */}
              <div className="space-y-2">
                <Label
                  htmlFor="memberDesignation"
                  className="text-base font-semibold"
                >
                  Designation
                </Label>
                <Input
                  id="memberDesignation"
                  {...register("memberDesignation")}
                  placeholder="e.g., Senior Dentist, Specialist"
                  className="h-12"
                />
                {errors.memberDesignation && (
                  <p className="text-sm text-red-600">
                    {errors.memberDesignation.message}
                  </p>
                )}
              </div>
            </div>

            {/* Team Selection */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Team *</Label>
              <Select
                value={teamValue || ""}
                onValueChange={(value) =>
                  setValue(
                    "team",
                    value as
                      | "DOCTORS"
                      | "CONSULTANT_SPECIALISTS"
                      | "ALLIED_HEALTH_SUPPORT_STAFF"
                  )
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCTORS">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Doctors
                    </div>
                  </SelectItem>
                  <SelectItem value="CONSULTANT_SPECIALISTS">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Consultant Specialists
                    </div>
                  </SelectItem>
                  <SelectItem value="ALLIED_HEALTH_SUPPORT_STAFF">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      Allied Health & Support Staff
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.team && (
                <p className="text-sm text-red-600">{errors.team.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Description *
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Write a brief description about the member, their expertise, experience, etc."
                className="min-h-[120px] resize-none"
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Minimum 10 characters required
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setPreviewUrl(null);
                  // Clear the file input
                  const fileInput = document.getElementById(
                    "new-member-image"
                  ) as HTMLInputElement;
                  if (fileInput) {
                    fileInput.value = "";
                  }
                }}
                className="px-8"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding Member...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Add Member
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MemberForm;

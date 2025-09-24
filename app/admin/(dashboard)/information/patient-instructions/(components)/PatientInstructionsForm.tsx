"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Trash2,
  Plus,
  FileText,
  Image as ImageIcon,
  Download,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  patientInstructionsFormSchema,
  type PatientInstructionsFormSchema,
} from "@/lib/schema";
import type { PatientInstructionsWithCards } from "@/lib/services/patient-instructions-service";

interface PatientInstructionsFormProps {
  initialData?: PatientInstructionsWithCards | null;
}

export function PatientInstructionsForm({
  initialData,
}: PatientInstructionsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const form = useForm<PatientInstructionsFormSchema>({
    resolver: zodResolver(patientInstructionsFormSchema),
    defaultValues: {
      bannerImage: initialData?.bannerImage || undefined,
      cards: initialData?.cards?.length
        ? initialData.cards.map((card) => ({
            id: card.id,
            backgroundImage: card.backgroundImage,
            contentTitle: card.contentTitle,
            contentImage: card.contentImage || undefined,
            contentDescription: card.contentDescription,
            downloadableFile: card.downloadableFile || undefined,
          }))
        : [
            {
              contentTitle: "",
              contentDescription: "",
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  // Initialize previews with existing images and files
  useEffect(() => {
    if (initialData) {
      const initialPreviews: { [key: string]: string } = {};

      // Banner image preview
      if (initialData.bannerImage) {
        initialPreviews["banner"] = initialData.bannerImage;
      }

      // Card previews
      initialData.cards?.forEach((card, index) => {
        const cardId = card.id || `temp-${index}`;
        if (card.backgroundImage) {
          initialPreviews[`${cardId}_background`] = card.backgroundImage;
        }
        if (card.contentImage) {
          initialPreviews[`${cardId}_content`] = card.contentImage;
        }
        if (card.downloadableFile) {
          initialPreviews[`${cardId}_file`] = card.downloadableFile;
          // Extract filename from URL for existing files
          const url = card.downloadableFile;
          const parts = url.split("/");
          const fileName = parts[parts.length - 1];
          initialPreviews[`${cardId}_fileName`] = fileName
            .split("?")[0]
            .split("#")[0];
        }
      });

      setPreviews(initialPreviews);
    }
  }, [initialData]);

  // Handle banner image change
  const handleBannerImageChange = (file: File | null) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, banner: objectUrl }));
      form.setValue("bannerImageFile", file);
    } else {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews.banner;
        return newPreviews;
      });
      form.setValue("bannerImageFile", undefined);
    }
  };

  // Handle background image change for cards
  const handleBackgroundImageChange = (index: number, file: File | null) => {
    const card = fields[index];
    const cardId = card.id || `temp-${index}`;

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [`${cardId}_background`]: objectUrl }));
      form.setValue(`cards.${index}.backgroundImageFile`, file);
    } else {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[`${cardId}_background`];
        return newPreviews;
      });
      form.setValue(`cards.${index}.backgroundImageFile`, undefined);
    }
  };

  // Handle content image change for cards
  const handleContentImageChange = (index: number, file: File | null) => {
    const card = fields[index];
    const cardId = card.id || `temp-${index}`;

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [`${cardId}_content`]: objectUrl }));
      form.setValue(`cards.${index}.contentImageFile`, file);
    } else {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[`${cardId}_content`];
        return newPreviews;
      });
      form.setValue(`cards.${index}.contentImageFile`, undefined);
    }
  };

  // Handle downloadable file change for cards
  const handleDownloadableFileChange = (index: number, file: File | null) => {
    const card = fields[index];
    const cardId = card.id || `temp-${index}`;

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({
        ...prev,
        [`${cardId}_file`]: objectUrl,
        [`${cardId}_fileName`]: file.name,
      }));
      form.setValue(`cards.${index}.downloadableFileFile`, file);
    } else {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[`${cardId}_file`];
        delete newPreviews[`${cardId}_fileName`];
        return newPreviews;
      });
      form.setValue(`cards.${index}.downloadableFileFile`, undefined);
    }
  };

  // Get preview URL for banner image
  const getBannerPreviewUrl = () => {
    return previews["banner"] || form.watch("bannerImage") || null;
  };

  // Get preview URL for background image
  const getBackgroundPreviewUrl = (index: number) => {
    const card = fields[index];
    const cardId = card.id || `temp-${index}`;
    return previews[`${cardId}_background`] || card.backgroundImage || null;
  };

  // Get preview URL for content image
  const getContentPreviewUrl = (index: number) => {
    const card = fields[index];
    const cardId = card.id || `temp-${index}`;
    return previews[`${cardId}_content`] || card.contentImage || null;
  };

  // Get preview URL for downloadable file
  const getDownloadableFileUrl = (index: number) => {
    const card = fields[index];
    const cardId = card.id || `temp-${index}`;
    return previews[`${cardId}_file`] || card.downloadableFile || null;
  };

  // Get file name for downloadable file
  const getDownloadableFileName = (index: number) => {
    const card = fields[index];
    const cardId = card.id || `temp-${index}`;

    // If there's a stored file name from recent upload
    if (previews[`${cardId}_fileName`]) {
      return previews[`${cardId}_fileName`];
    }

    // If there's an existing file URL, extract filename from URL
    if (card.downloadableFile) {
      const url = card.downloadableFile;
      const parts = url.split("/");
      const fileName = parts[parts.length - 1];
      // Remove any query parameters or hash
      return fileName.split("?")[0].split("#")[0];
    }

    return null;
  };

  // Add a new card
  const addCard = () => {
    append({
      contentTitle: "",
      contentDescription: "",
    });
  };

  // Remove card with preview cleanup
  const removeCard = (index: number) => {
    const card = fields[index];
    const cardId = card.id || `temp-${index}`;

    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[`${cardId}_background`];
      delete newPreviews[`${cardId}_content`];
      delete newPreviews[`${cardId}_file`];
      return newPreviews;
    });

    remove(index);
  };

  const handleSubmit = async (data: PatientInstructionsFormSchema) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Banner image data
      if (data.bannerImage) {
        formData.append("bannerImage", data.bannerImage);
      }
      if (data.bannerImageFile) {
        formData.append("bannerImageFile", data.bannerImageFile);
      }

      // Cards data
      formData.append("cardsCount", data.cards.length.toString());
      data.cards.forEach((card, index) => {
        // Basic card data
        formData.append(`cards[${index}][contentTitle]`, card.contentTitle);
        formData.append(
          `cards[${index}][contentDescription]`,
          card.contentDescription
        );

        if (card.id) {
          formData.append(`cards[${index}][id]`, card.id);
        }

        // Background image (required)
        if (card.backgroundImage) {
          formData.append(
            `cards[${index}][backgroundImage]`,
            card.backgroundImage
          );
        }
        if (card.backgroundImageFile) {
          formData.append(
            `cards[${index}][backgroundImageFile]`,
            card.backgroundImageFile
          );
        }

        // Content image (optional)
        if (card.contentImage) {
          formData.append(`cards[${index}][contentImage]`, card.contentImage);
        }
        if (card.contentImageFile) {
          formData.append(
            `cards[${index}][contentImageFile]`,
            card.contentImageFile
          );
        }

        // Downloadable file (optional)
        if (card.downloadableFile) {
          formData.append(
            `cards[${index}][downloadableFile]`,
            card.downloadableFile
          );
        }
        if (card.downloadableFileFile) {
          formData.append(
            `cards[${index}][downloadableFileFile]`,
            card.downloadableFileFile
          );
        }
      });

      const response = await fetch("/api/patient-instructions", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save patient instructions");
      }

      if (result.success) {
        toast.success(
          result.message || "Patient Instructions saved successfully!"
        );
        // Form will be reset with new data if needed
      } else {
        throw new Error(result.error || "Failed to save patient instructions");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save patient instructions"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Patient Instructions Management
        </h1>
        <p className="text-gray-600">
          Manage patient instruction content with banner image and instruction
          cards.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Banner Image Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Banner Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bannerImageFile"
                render={({ field: { value: _, onChange: __, ...field } }) => (
                  <FormItem>
                    <FormLabel>Banner Image</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleBannerImageChange(e.target.files?.[0] || null)
                        }
                        className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {getBannerPreviewUrl() && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Preview:
                  </label>
                  <div className="relative w-full max-w-md">
                    <Image
                      src={getBannerPreviewUrl()!}
                      alt="Banner preview"
                      width={400}
                      height={200}
                      className="rounded-lg object-cover border"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cards Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Instruction Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="border-2 border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg">Card {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCard(index)}
                      disabled={fields.length === 1 || isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Background Image (Required) */}
                    <FormField
                      control={form.control}
                      name={`cards.${index}.backgroundImageFile`}
                      render={({
                        field: { value: _, onChange: __, ...field },
                      }) => (
                        <FormItem>
                          <FormLabel>Background Image *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleBackgroundImageChange(
                                  index,
                                  e.target.files?.[0] || null
                                )
                              }
                              className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {getBackgroundPreviewUrl(index) && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Preview:
                        </label>
                        <Image
                          src={getBackgroundPreviewUrl(index)!}
                          alt="Background preview"
                          width={200}
                          height={120}
                          className="rounded object-cover border"
                        />
                      </div>
                    )}
                    {/* Content Title (Required) */}
                    <FormField
                      control={form.control}
                      name={`cards.${index}.contentTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Title *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter card title"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Content Image (Optional) */}
                    <FormField
                      control={form.control}
                      name={`cards.${index}.contentImageFile`}
                      render={({
                        field: { value: _, onChange: __, ...field },
                      }) => (
                        <FormItem>
                          <FormLabel>Content Image</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleContentImageChange(
                                  index,
                                  e.target.files?.[0] || null
                                )
                              }
                              className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {getContentPreviewUrl(index) && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content Image Preview:
                        </label>
                        <Image
                          src={getContentPreviewUrl(index)!}
                          alt="Content preview"
                          width={200}
                          height={120}
                          className="rounded object-cover border"
                        />
                      </div>
                    )}
                    {/* Content Description (Required) */}
                    <FormField
                      control={form.control}
                      name={`cards.${index}.contentDescription`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter detailed content description"
                              rows={4}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Downloadable File (Optional) */}
                    <FormField
                      control={form.control}
                      name={`cards.${index}.downloadableFileFile`}
                      render={({
                        field: { value: _, onChange: __, ...field },
                      }) => (
                        <FormItem>
                          <FormLabel>Downloadable File</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="file"
                              onChange={(e) =>
                                handleDownloadableFileChange(
                                  index,
                                  e.target.files?.[0] || null
                                )
                              }
                              className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                    {getDownloadableFileUrl(index) && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Downloadable File:
                        </label>
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded border">
                          <Download className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-purple-700">
                            File uploaded:{" "}
                            {getDownloadableFileName(index) || "Unknown file"}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addCard}
                className="w-full"
                disabled={fields.length >= 20 || isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="min-w-32">
              {isSubmitting ? "Saving..." : "Save Patient Instructions"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PatientInstructionsForm;

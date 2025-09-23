"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Plus, Video, Info } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { firstVisitFormSchema, type FirstVisitFormSchema } from "@/lib/schema";
import type { FirstVisitWithSections } from "@/lib/services/first-visit-service";

interface FirstVisitFormProps {
  initialData?: FirstVisitWithSections | null;
}

export function FirstVisitForm({ initialData }: FirstVisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [hasVideoSection, setHasVideoSection] = useState(
    !!initialData?.videoSection
  );
  const [hasInformationSection, setHasInformationSection] = useState(
    !!initialData?.informationSection
  );

  const form = useForm<FirstVisitFormSchema>({
    resolver: zodResolver(firstVisitFormSchema),
    defaultValues: {
      sections: initialData?.sections?.length
        ? initialData.sections.map((section) => ({
            id: section.id,
            title: section.title || "",
            descriptionTitle: section.descriptionTitle || "",
            description: section.description,
            sortOrder: section.sortOrder,
            imageUrl: section.imageUrl || undefined,
          }))
        : [
            {
              title: "",
              descriptionTitle: "",
              description: "",
              sortOrder: 0,
            },
          ],
      videoSection: initialData?.videoSection
        ? {
            id: initialData.videoSection.id,
            videoUrl: initialData.videoSection.videoUrl,
          }
        : undefined,
      informationSection: initialData?.informationSection
        ? {
            id: initialData.informationSection.id,
            descriptionTitle:
              initialData.informationSection.descriptionTitle || "",
            description: initialData.informationSection.description,
            imageUrl: initialData.informationSection.imageUrl || undefined,
          }
        : undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  // Initialize previews with existing images
  useEffect(() => {
    if (initialData) {
      const initialPreviews: { [key: string]: string } = {};

      // General sections previews
      initialData.sections?.forEach((section, index) => {
        if (section.imageUrl) {
          const sectionId = section.id || `temp-${index}`;
          initialPreviews[sectionId] = section.imageUrl;
        }
      });

      // Information section preview
      if (initialData.informationSection?.imageUrl) {
        initialPreviews["information_section"] =
          initialData.informationSection.imageUrl;
      }

      setPreviews(initialPreviews);
    }
  }, [initialData]);

  // Handle image change with preview for general sections
  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const section = fields[index];
      const sectionId = section.id || `temp-${index}`;
      const objectUrl = URL.createObjectURL(file);

      setPreviews((prev) => ({ ...prev, [sectionId]: objectUrl }));
      form.setValue(`sections.${index}.imageFile`, file);
    } else {
      const section = fields[index];
      const sectionId = section.id || `temp-${index}`;

      setPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[sectionId];
        return newPreviews;
      });
      form.setValue(`sections.${index}.imageFile`, undefined);
    }
  };

  // Handle image change for information section
  const handleInformationImageChange = (file: File | null) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, information_section: objectUrl }));
      form.setValue(`informationSection.imageFile`, file);
    } else {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews.information_section;
        return newPreviews;
      });
      form.setValue(`informationSection.imageFile`, undefined);
    }
  };

  // Get preview URL for a general section
  const getPreviewUrl = (index: number) => {
    const section = fields[index];
    const sectionId = section.id || `temp-${index}`;
    return previews[sectionId] || section.imageUrl || null;
  };

  // Get preview URL for information section
  const getInformationPreviewUrl = () => {
    return (
      previews["information_section"] ||
      form.watch("informationSection.imageUrl") ||
      null
    );
  };

  // Add a new general section
  const addSection = () => {
    append({
      title: "",
      descriptionTitle: "",
      description: "",
      sortOrder: fields.length,
    });
  };

  // Remove general section with preview cleanup
  const removeSection = (index: number) => {
    const section = fields[index];
    const sectionId = section.id || `temp-${index}`;

    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[sectionId];
      return newPreviews;
    });

    remove(index);
  };

  // Toggle video section
  const toggleVideoSection = (enabled: boolean) => {
    setHasVideoSection(enabled);
    if (enabled && !form.getValues("videoSection")) {
      form.setValue("videoSection", {
        videoUrl: "",
      });
    } else if (!enabled) {
      form.setValue("videoSection", undefined);
    }
  };

  // Toggle information section
  const toggleInformationSection = (enabled: boolean) => {
    setHasInformationSection(enabled);
    if (enabled && !form.getValues("informationSection")) {
      form.setValue("informationSection", {
        descriptionTitle: "",
        description: "",
      });
    } else if (!enabled) {
      form.setValue("informationSection", undefined);
      // Clean up preview
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews.information_section;
        return newPreviews;
      });
    }
  };

  const handleSubmit = async (data: FirstVisitFormSchema) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // General sections data
      formData.append("sectionsCount", data.sections.length.toString());
      data.sections.forEach((section, index) => {
        formData.append(`sections[${index}][title]`, section.title || "");
        formData.append(
          `sections[${index}][descriptionTitle]`,
          section.descriptionTitle || ""
        );
        formData.append(`sections[${index}][description]`, section.description);
        formData.append(
          `sections[${index}][sortOrder]`,
          section.sortOrder.toString()
        );

        if (section.id) {
          formData.append(`sections[${index}][id]`, section.id);
        }
        if (section.imageUrl) {
          formData.append(`sections[${index}][imageUrl]`, section.imageUrl);
        }
        if (section.imageFile) {
          formData.append(`sections[${index}][imageFile]`, section.imageFile);
        }
      });

      // Video section data
      if (data.videoSection && hasVideoSection) {
        if (data.videoSection.id) {
          formData.append("videoSection[id]", data.videoSection.id);
        }
        formData.append("videoSection[videoUrl]", data.videoSection.videoUrl);
      }

      // Information section data
      if (data.informationSection && hasInformationSection) {
        if (data.informationSection.id) {
          formData.append("informationSection[id]", data.informationSection.id);
        }
        formData.append(
          "informationSection[descriptionTitle]",
          data.informationSection.descriptionTitle || ""
        );
        formData.append(
          "informationSection[description]",
          data.informationSection.description
        );
        if (data.informationSection.imageUrl) {
          formData.append(
            "informationSection[imageUrl]",
            data.informationSection.imageUrl
          );
        }
        if (data.informationSection.imageFile) {
          formData.append(
            "informationSection[imageFile]",
            data.informationSection.imageFile
          );
        }
      }

      const response = await fetch("/api/first-visit", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("First Visit information updated successfully!");
        // Reload the page to show updated data
        window.location.reload();
      } else {
        throw new Error(
          result.error || "Failed to update First Visit information"
        );
      }
    } catch (error) {
      console.error("Error submitting First Visit form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update First Visit information"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            First Visit Management
          </h1>
          <p className="text-muted-foreground">
            Manage First Visit page content including sections, video, and
            information.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* General Sections */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">General Sections</h3>
              <Button
                type="button"
                onClick={addSection}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <CardHeader className="px-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      Section {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={() => removeSection(index)}
                      variant="destructive"
                      size="sm"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 px-0">
                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name={`sections.${index}.imageFile`}
                    render={({ field: { name, onBlur, ref } }) => (
                      <FormItem>
                        <FormLabel>Section Image (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            name={name}
                            ref={ref}
                            onBlur={onBlur}
                            onChange={(e) =>
                              handleImageChange(
                                index,
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </FormControl>
                        {getPreviewUrl(index) && (
                          <div className="mt-2">
                            <Image
                              src={getPreviewUrl(index)!}
                              alt="Section preview"
                              width={200}
                              height={150}
                              className="object-cover rounded-md border"
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Title */}
                  <FormField
                    control={form.control}
                    name={`sections.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section Title (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter section title..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Title */}
                  <FormField
                    control={form.control}
                    name={`sections.${index}.descriptionTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description Title (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter description title..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name={`sections.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Required)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter section description..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Video Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Video Section</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={hasVideoSection}
                  onCheckedChange={toggleVideoSection}
                />
                <span className="text-sm text-muted-foreground">
                  {hasVideoSection ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {hasVideoSection && (
              <Card className="p-4">
                <CardContent className="space-y-4 px-0">
                  <FormField
                    control={form.control}
                    name="videoSection.videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (Required)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Information Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Information Section</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={hasInformationSection}
                  onCheckedChange={toggleInformationSection}
                />
                <span className="text-sm text-muted-foreground">
                  {hasInformationSection ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {hasInformationSection && (
              <Card className="p-4">
                <CardContent className="space-y-4 px-0">
                  {/* Information Image Upload */}
                  <FormField
                    control={form.control}
                    name="informationSection.imageFile"
                    render={({ field: { name, onBlur, ref } }) => (
                      <FormItem>
                        <FormLabel>Information Image (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            name={name}
                            ref={ref}
                            onBlur={onBlur}
                            onChange={(e) =>
                              handleInformationImageChange(
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        </FormControl>
                        {getInformationPreviewUrl() && (
                          <div className="mt-2">
                            <Image
                              src={getInformationPreviewUrl()!}
                              alt="Information section preview"
                              width={200}
                              height={150}
                              className="object-cover rounded-md border"
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Information Description Title */}
                  <FormField
                    control={form.control}
                    name="informationSection.descriptionTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description Title (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter information description title..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Information Description */}
                  <FormField
                    control={form.control}
                    name="informationSection.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Required)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter information section description..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save First Visit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default FirstVisitForm;

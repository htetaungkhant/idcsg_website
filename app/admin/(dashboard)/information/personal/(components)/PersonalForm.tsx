"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { personalFormSchema, type PersonalFormSchema } from "@/lib/schema";
import type { PersonalWithSections } from "@/lib/services/personal-service";

interface PersonalFormProps {
  initialData?: PersonalWithSections | null;
}

const cardStyleLabels = {
  CARDSTYLE1: "Card Style 1",
  CARDSTYLE2: "Card Style 2",
  CARDSTYLE3: "Card Style 3",
};

export function PersonalForm({ initialData }: PersonalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const form = useForm<PersonalFormSchema>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: {
      sections: initialData?.sections?.length
        ? initialData.sections.map((section) => ({
            id: section.id,
            title: section.title || "",
            descriptionTitle: section.descriptionTitle || "",
            description: section.description || "",
            cardStyle: section.cardStyle,
            sortOrder: section.sortOrder,
            imageUrl: section.imageUrl || undefined,
          }))
        : [
            {
              title: "",
              descriptionTitle: "",
              description: "",
              cardStyle: "CARDSTYLE1" as const,
              sortOrder: 0,
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  // Initialize previews with existing images
  useEffect(() => {
    if (initialData?.sections) {
      const initialPreviews: { [key: string]: string } = {};
      initialData.sections.forEach((section, index) => {
        if (section.imageUrl) {
          const sectionId = section.id || `temp-${index}`;
          initialPreviews[sectionId] = section.imageUrl;
        }
      });
      setPreviews(initialPreviews);
    }
  }, [initialData]);

  // Handle image change with preview
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

  // Get preview URL for a section
  const getPreviewUrl = (index: number) => {
    const section = fields[index];
    const sectionId = section.id || `temp-${index}`;
    return previews[sectionId] || section.imageUrl || null;
  };

  // Add a new section
  const addSection = () => {
    append({
      title: "",
      descriptionTitle: "",
      description: "",
      cardStyle: "CARDSTYLE1",
      sortOrder: fields.length,
    });
  };

  // Remove section with preview cleanup
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

  const handleSubmit = async (data: PersonalFormSchema) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Section data
      formData.append("sectionsCount", data.sections.length.toString()); // Section data
      data.sections.forEach((section, index) => {
        formData.append(`sections[${index}][title]`, section.title || "");
        formData.append(
          `sections[${index}][descriptionTitle]`,
          section.descriptionTitle || ""
        );
        formData.append(
          `sections[${index}][description]`,
          section.description || ""
        );
        formData.append(`sections[${index}][cardStyle]`, section.cardStyle);
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

      const response = await fetch("/api/personal", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Personal information updated successfully!");
      } else {
        throw new Error(
          result.error || "Failed to update Personal information"
        );
      }
    } catch (error) {
      console.error("Error submitting Personal form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update Personal information"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-6">
          {/* Dynamic Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sections</h3>
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
                      <Badge variant="outline">
                        {
                          cardStyleLabels[
                            form.watch(`sections.${index}.cardStyle`)
                          ]
                        }
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2">
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
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 px-0">
                  {/* Section-level validation error */}
                  {form.formState.errors.sections?.[index] && (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
                      <strong>Section {index + 1} Error:</strong> At least one
                      field (image, title, description title, or description)
                      must be filled.
                    </div>
                  )}

                  {/* Card Style Selection */}
                  <FormField
                    control={form.control}
                    name={`sections.${index}.cardStyle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Style</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select card style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CARDSTYLE1">
                              Card Style 1
                            </SelectItem>
                            <SelectItem value="CARDSTYLE2">
                              Card Style 2
                            </SelectItem>
                            <SelectItem value="CARDSTYLE3">
                              Card Style 3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name={`sections.${index}.imageFile`}
                    render={({ field: { name, onBlur, ref } }) => (
                      <FormItem>
                        <FormLabel>Section Image</FormLabel>
                        <FormControl>
                          <Input
                            name={name}
                            onBlur={onBlur}
                            ref={ref}
                            type="file"
                            accept="image/*"
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
                              alt="Preview"
                              width={128}
                              height={128}
                              className="w-32 h-32 object-cover rounded border"
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
                        <FormLabel>Section Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter section title" />
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
                        <FormLabel>Description Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter description title"
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter section description"
                            className="min-h-[80px]"
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
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PersonalForm;

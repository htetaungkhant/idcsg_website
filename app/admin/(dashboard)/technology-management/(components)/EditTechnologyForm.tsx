"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, Plus, Minus } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

import {
  editDentalTechnologyFormSchema,
  type EditDentalTechnologyFormSchema,
} from "@/lib/schema";
import type { TechnologyWithSections } from "@/lib/services/technology-service";

interface EditTechnologyFormProps {
  technologyId: string;
}

interface TechnologyCard {
  id: string;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

export function EditTechnologyForm({ technologyId }: EditTechnologyFormProps) {
  const router = useRouter();
  const { uploadImage } = useCloudinaryUpload();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTechnology, setLoadingTechnology] = useState(true);
  const [technology, setTechnology] = useState<TechnologyWithSections | null>(
    null
  );

  // Form setup with default values
  const form = useForm<EditDentalTechnologyFormSchema>({
    resolver: zodResolver(editDentalTechnologyFormSchema),
    defaultValues: {
      title: "",
      overview: "",
      description: "",
      section1Title: "",
      section1Description: "",
      cards: [],
    },
  });

  // Field arrays for dynamic cards
  const {
    fields: cardFields,
    append: appendCard,
    remove: removeCard,
    replace: replaceCards,
  } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  // Load technology data
  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        const response = await fetch(`/api/technologies/${technologyId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const technologyData = result.data;
          setTechnology(technologyData);

          // Set form values
          form.reset({
            title: technologyData.title || "",
            overview: technologyData.overview || "",
            description: technologyData.description || "",
            section1Title: technologyData.section1?.title || "",
            section1Description: technologyData.section1?.description || "",
            cards:
              technologyData.cards?.map((card: TechnologyCard) => ({
                id: card.id, // Include existing card ID
                title: card.title || "",
                description: card.description || "",
                // Note: We don't include the existing image file here as it's already uploaded
              })) || [],
          });

          // Update field arrays with existing data
          if (technologyData.cards) {
            replaceCards(
              technologyData.cards.map((card: TechnologyCard) => ({
                id: card.id, // Include existing card ID for proper matching
                title: card.title || "",
                description: card.description || "",
              }))
            );
          }
        } else {
          toast.error("Failed to load technology data");
          router.push("/admin/technology-management");
        }
      } catch (error) {
        console.error("Error fetching technology:", error);
        toast.error("Failed to load technology");
      } finally {
        setLoadingTechnology(false);
      }
    };

    fetchTechnology();
  }, [technologyId, form, replaceCards, router]);

  const onSubmit = async (data: EditDentalTechnologyFormSchema) => {
    try {
      setIsLoading(true);

      const body: Record<string, unknown> = {
        title: data.title,
        overview: data.overview,
        imageUrl: technology?.imageUrl || null, // Default to existing image URL
      };

      // Add optional main description
      if (data.description) body.description = data.description;

      // Upload main image if provided
      if (data.mainImage) {
        const mainImage = await uploadImage(data.mainImage, {
          folder: "technologies/main-images",
        });
        body.imageUrl = mainImage.secure_url;
      }

      // For Section 1
      if (data.section1Title) body.section1Title = data.section1Title;
      if (data.section1Description)
        body.section1Description = data.section1Description;
      if (data.section1Image) {
        const section1Image = await uploadImage(data.section1Image, {
          folder: `technologies/${technologyId}/section1`,
        });
        body.section1ImageUrl = section1Image.secure_url;
      }

      // Handle dynamic cards
      if (data.cards && data.cards.length > 0) {
        const cards = await Promise.all(
          data.cards.map(async (card, index) => {
            // if (card.id) body[`cards[${index}].id`] = card.id;
            // if (card.title) body[`cards[${index}].title`] = card.title;
            // if (card.description) body[`cards[${index}].description`] = card.description;
            if (card.image) {
              const cardImage = await uploadImage(card.image, {
                folder: `technologies/${technologyId}/cards${index}`,
              });
              return {
                ...card,
                imageUrl: cardImage.secure_url,
              };
            }
            return card;
          })
        );
        body.cards = cards;
      }

      const response = await fetch(`/api/technologies/${technologyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update technology");
      }

      // Success
      toast.success("Technology updated successfully!");
      router.push("/admin/technology-management");
    } catch (error) {
      console.error("Error updating technology:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update technology"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingTechnology) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg font-medium">Loading technology data...</p>
        </div>
      </div>
    );
  }

  if (!technology) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">
            Technology not found
          </p>
          <Button
            onClick={() => router.push("/admin/technology-management")}
            className="mt-4"
          >
            Back to Technologies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Technology</h1>
        <p className="text-gray-600 mt-2">
          Update technology information and content sections
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary">
              Basic Information
            </h3>

            {/* Main Image - Optional in edit mode */}
            <FormField
              control={form.control}
              name="mainImage"
              render={({ field: { onChange, name, ref } }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Main Technology Image
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Current Main Image */}
                      {technology.imageUrl && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Current Image:
                          </p>
                          <Image
                            src={technology.imageUrl}
                            alt="Current main image"
                            width={128}
                            height={128}
                            className="w-32 h-32 rounded-lg object-cover border"
                            priority
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload a new image and save changes to replace
                            current one
                          </p>
                        </div>
                      )}
                      <Input
                        name={name}
                        ref={ref}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                        }}
                        className="cursor-pointer"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title - Required */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Technology Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter technology title..."
                      className="text-base"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Overview - Required */}
            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Technology Overview *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter technology overview..."
                      className="min-h-[100px] text-base resize-vertical"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Optional Fields Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary-foreground">
              Additional Information (Optional)
            </h3>

            {/* Main Description - Optional */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Detailed Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter detailed description of the technology..."
                      className="min-h-[120px] text-base resize-vertical"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Section 1 */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary-foreground">
              Section 1 (Optional)
            </h3>

            {/* Section 1 Image */}
            <FormField
              control={form.control}
              name="section1Image"
              render={({ field: { onChange, name, ref } }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Section 1 Image
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Current Section 1 Image */}
                      {technology.section1?.imageUrl && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Current Image:
                          </p>
                          <Image
                            src={technology.section1.imageUrl}
                            alt="Current section 1 image"
                            width={128}
                            height={128}
                            className="w-32 h-32 rounded-lg object-cover border"
                            priority
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload a new image and save changes to replace
                            current one
                          </p>
                        </div>
                      )}
                      <Input
                        name={name}
                        ref={ref}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                        }}
                        className="cursor-pointer"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Section 1 Title */}
            <FormField
              control={form.control}
              name="section1Title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Section 1 Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter section 1 title..."
                      className="text-base"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Section 1 Description */}
            <FormField
              control={form.control}
              name="section1Description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Section 1 Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter section 1 description..."
                      className="min-h-[100px] text-base resize-vertical"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Dynamic Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-foreground">
                Technology Cards (Optional)
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendCard({ title: "", description: "" })}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
            </div>

            <div className="space-y-4">
              {cardFields.map((field, index) => {
                // Get the card ID from the form data to properly match existing cards
                const cardId = form.getValues(`cards.${index}.id`);
                const existingCard = cardId
                  ? technology.cards?.find((card) => card.id === cardId)
                  : null;

                return (
                  <Card key={field.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Card {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCard(index)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Card Image */}
                      <FormField
                        control={form.control}
                        name={`cards.${index}.image`}
                        render={({ field: { onChange, name, ref } }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Card Image
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                {/* Current Card Image */}
                                {existingCard?.imageUrl && (
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                      Current Image:
                                    </p>
                                    <Image
                                      src={existingCard.imageUrl}
                                      alt={`Current card ${index + 1} image`}
                                      width={96}
                                      height={96}
                                      className="w-32 h-32 rounded-lg object-cover border"
                                      priority
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                      Upload a new image and save changes to
                                      replace current one
                                    </p>
                                  </div>
                                )}
                                <Input
                                  name={name}
                                  ref={ref}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                  }}
                                  className="cursor-pointer"
                                  disabled={isLoading}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Card Title */}
                      <FormField
                        control={form.control}
                        name={`cards.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Card Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter card title..."
                                className="text-base"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Card Description */}
                      <FormField
                        control={form.control}
                        name={`cards.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              Card Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter card description..."
                                className="min-h-[100px] text-base resize-vertical"
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                );
              })}

              {cardFields.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                  <p>
                    No cards added yet. Click &quot;Add Card&quot; to get
                    started.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/technology-management")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isLoading ? "Updating..." : "Update Technology"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditTechnologyForm;

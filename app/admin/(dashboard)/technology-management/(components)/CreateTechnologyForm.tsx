"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  dentalTechnologyFormSchema,
  type DentalTechnologyFormSchema,
} from "@/lib/schema";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

export function CreateTechnologyForm() {
  const router = useRouter();

  const { uploadImage } = useCloudinaryUpload();

  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  // Form setup with default values
  const form = useForm<DentalTechnologyFormSchema>({
    resolver: zodResolver(dentalTechnologyFormSchema),
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
  } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  // Image preview management
  const handleImagePreview = (file: File | undefined, previewKey: string) => {
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [previewKey]: objectUrl }));
    } else {
      setPreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[previewKey];
        return newPreviews;
      });
    }
  };

  const onSubmit = async (data: DentalTechnologyFormSchema) => {
    try {
      setIsLoading(true);
      const body: Record<string, unknown> = {
        imageUrl: "", // Placeholder, will be updated after upload
        title: data.title,
        overview: data.overview,
      };

      if (data.description) {
        body.description = data.description;
      }

      const initialDbResponse = await fetch("/api/technologies", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const initialDbResult = await initialDbResponse.json();

      if (!initialDbResult.success) {
        throw new Error(initialDbResult.error || "Failed to create technology");
      }

      const technologyId = initialDbResult.data.id;
      body.id = technologyId;

      // Upload main image
      if (data.mainImage) {
        const mainImage = await uploadImage(data.mainImage, {
          folder: `technologies/${technologyId}/main`,
        });
        body.imageUrl = mainImage.secure_url;
      }

      if (data.section1Title) {
        body.section1Title = data.section1Title;
      }
      if (data.section1Description) {
        body.section1Description = data.section1Description;
      }
      if (data.section1Image) {
        const section1ImageUrl = await uploadImage(data.section1Image, {
          folder: `technologies/${technologyId}/section1`,
        });
        body.section1ImageUrl = section1ImageUrl.secure_url;
      }

      if (data.cards && data.cards.length > 0) {
        const cardsData = await Promise.all(
          data.cards.map(async (card, index) => {
            // if (card.title) {
            //   body[`cards[${index}].title`] = card.title;
            // }
            // if (card.description) {
            //   body[`cards[${index}].description`] = card.description;
            // }
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
        body.cards = cardsData;
      }

      const finalDbResponse = await fetch("/api/technologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const finalDbResult = await finalDbResponse.json();
      if (!finalDbResult.success) {
        throw new Error(finalDbResult.error || "Failed to create technology");
      }

      // Success
      toast.success("Technology created successfully!");
      router.push("/admin/technology-management");
    } catch (error) {
      console.error("Error creating technology:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create technology"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URLs on unmount
  useState(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  });

  return (
    <Card className="max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          Create New Technology
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Required Fields Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">
                Basic Information
              </h3>

              {/* Main Image - Required */}
              <FormField
                control={form.control}
                name="mainImage"
                render={({ field: { onChange, name, ref } }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Main Technology Image *
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          name={name}
                          ref={ref}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                            handleImagePreview(file, "mainImage");
                          }}
                          className="cursor-pointer"
                          disabled={isLoading}
                        />
                        {previews.mainImage && (
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previews.mainImage}
                              alt="Main technology preview"
                              className="w-48 h-32 object-cover rounded-lg border"
                            />
                          </div>
                        )}
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
                Additional Information
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
                Section 1
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
                        <Input
                          name={name}
                          ref={ref}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                            handleImagePreview(file, "section1Image");
                          }}
                          className="cursor-pointer"
                          disabled={isLoading}
                        />
                        {previews.section1Image && (
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previews.section1Image}
                              alt="Section 1 preview"
                              className="w-48 h-32 object-cover rounded-lg border"
                            />
                          </div>
                        )}
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
                  Technology Cards
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
                {cardFields.map((field, index) => (
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
                                <Input
                                  name={name}
                                  ref={ref}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                    handleImagePreview(file, `card-${index}`);
                                  }}
                                  className="cursor-pointer"
                                  disabled={isLoading}
                                />
                                {previews[`card-${index}`] && (
                                  <div className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={previews[`card-${index}`]}
                                      alt={`Card ${index + 1} preview`}
                                      className="w-48 h-32 object-cover rounded-lg border"
                                    />
                                  </div>
                                )}
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
                ))}

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
                {isLoading ? "Creating..." : "Create Technology"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CreateTechnologyForm;

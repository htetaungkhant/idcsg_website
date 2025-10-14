"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Minus, Upload, Video, DollarSign } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { serviceFormSchema, type ServiceFormSchema } from "@/lib/schema";
import type { Category } from "@/app/generated/prisma";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

export function CreateServiceForm() {
  const router = useRouter();

  const { uploadWithCompression: uploadImage } = useCloudinaryUpload();

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form setup with default values
  const form = useForm<ServiceFormSchema>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      categoryId: "",
      image: undefined,
      name: "",
      overview: "",
      overviewBgStartingColor: "#CA4E48",
      overviewBgEndingColor: "#642724",
      detailsBgStartingColor: "#FFFFFF",
      detailsBgEndingColor: "#D2F7FF",
      detailsLinkBgColor: "#68211E",
      detailsTextColor: "#233259",
      section1Title: "",
      section1Description: "",
      section2VideoUrl: "",
      section3Title: "",
      section3Description: "",
      section4Title: "",
      section4Cards: [],
      section5Title: "",
      section5PriceRanges: [],
    },
  });

  // Field arrays for dynamic sections
  const {
    fields: cardFields,
    append: appendCard,
    remove: removeCard,
  } = useFieldArray({
    control: form.control,
    name: "section4Cards",
  });

  const {
    fields: priceRangeFields,
    append: appendPriceRange,
    remove: removePriceRange,
  } = useFieldArray({
    control: form.control,
    name: "section5PriceRanges",
  });

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();

        if (result.success) {
          setCategories(result.data);
        } else {
          toast.error("Failed to load categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: ServiceFormSchema) => {
    try {
      setIsLoading(true);
      const mainImage = await uploadImage(data.image!, {
        folder: "services/main-images",
      });

      const body: Record<string, unknown> = {
        categoryId: data.categoryId,
        name: data.name,
        overview: data.overview,
        imageUrl: mainImage.secure_url,
        overviewBgStartingColor: data.overviewBgStartingColor || "#CA4E48",
        overviewBgEndingColor: data.overviewBgEndingColor || "#642724",
        detailsBgStartingColor: data.detailsBgStartingColor || "#FFFFFF",
        detailsBgEndingColor: data.detailsBgEndingColor || "#D2F7FF",
        detailsLinkBgColor: data.detailsLinkBgColor || "#68211E",
        detailsTextColor: data.detailsTextColor || "#233259",
      };

      // Initially create service database record with essential info to get the service ID
      const initialDbResponse = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const initialDbResult = await initialDbResponse.json();
      if (!initialDbResult.success || !initialDbResult.data?.id) {
        throw new Error(
          initialDbResult.error || "Failed to create initial service"
        );
      }

      body["id"] = initialDbResult.data.id;
      if (data.section1Title) {
        body["section1Title"] = data.section1Title;
      }
      if (data.section1Description) {
        body["section1Description"] = data.section1Description;
      }
      if (data.section1Image) {
        const section1Image = await uploadImage(data.section1Image, {
          folder: `services/${initialDbResult.data.id}/section1`,
        });
        body["section1ImageUrl"] = section1Image.secure_url;
      }
      if (data.section2VideoUrl) {
        body["section2VideoUrl"] = data.section2VideoUrl;
      }
      if (data.section3Title) {
        body["section3Title"] = data.section3Title;
      }
      if (data.section3Description) {
        body["section3Description"] = data.section3Description;
      }
      if (data.section3Image) {
        const section3Image = await uploadImage(data.section3Image, {
          folder: `services/${initialDbResult.data.id}/section3`,
        });
        body["section3ImageUrl"] = section3Image.secure_url;
      }
      if (data.section4Title) {
        body["section4Title"] = data.section4Title;
      }
      if (data.section4Cards && data.section4Cards.length > 0) {
        const section4Cards = await Promise.all(
          data.section4Cards.map(async (card, index) => {
            // if (card.title) {
            //   body[`section4Cards[${index}].title`] = card.title;
            // }
            // body[`section4Cards[${index}].description`] = card.description;
            if (card.image) {
              const cardImage = await uploadImage(card.image, {
                folder: `services/${initialDbResult.data.id}/section4/card${index}`,
              });
              return {
                ...card,
                imageUrl: cardImage.secure_url,
              };
            }
            return card;
          })
        );
        body["section4Cards"] = section4Cards;
      }
      if (data.section5Title) {
        body["section5Title"] = data.section5Title;
      }
      if (data.section5Image) {
        const section5Image = await uploadImage(data.section5Image, {
          folder: `services/${initialDbResult.data.id}/section5`,
        });
        body["section5ImageUrl"] = section5Image.secure_url;
      }
      if (data.section5PriceRanges && data.section5PriceRanges.length > 0) {
        body["section5PriceRanges"] = data.section5PriceRanges;
      }

      const finalDbResponse = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const finalDbResult = await finalDbResponse.json();
      if (!finalDbResult.success) {
        throw new Error(finalDbResult.error || "Failed to create service");
      }

      // Success
      toast.success("Service created successfully!");
      router.push("/admin/service-management");
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create service"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Service</h1>
        <p className="text-gray-600 mt-2">
          Add a new service with detailed sections and content
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingCategories || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter service name..."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, name, onBlur, ref } }) => (
                    <FormItem>
                      <FormLabel>Service Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          name={name}
                          onBlur={onBlur}
                          ref={ref}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Overview</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed service overview..."
                        rows={4}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Background Colors</h3>
                <p className="text-sm text-gray-600">
                  Set gradient background colors for service overview and
                  details sections
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="overviewBgStartingColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overview Gradient Start Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              disabled={isLoading}
                              className="w-20 h-10 cursor-pointer"
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={isLoading}
                              placeholder="#CA4E48"
                              className="flex-1"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overviewBgEndingColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overview Gradient End Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              disabled={isLoading}
                              className="w-20 h-10 cursor-pointer"
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={isLoading}
                              placeholder="#642724"
                              className="flex-1"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="detailsBgStartingColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details Gradient Start Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              disabled={isLoading}
                              className="w-20 h-10 cursor-pointer"
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={isLoading}
                              placeholder="#FFFFFF"
                              className="flex-1"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="detailsBgEndingColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details Gradient End Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              disabled={isLoading}
                              className="w-20 h-10 cursor-pointer"
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={isLoading}
                              placeholder="#D2F7FF"
                              className="flex-1"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="detailsLinkBgColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details Link Background Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              disabled={isLoading}
                              className="w-20 h-10 cursor-pointer"
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={isLoading}
                              placeholder="#68211E"
                              className="flex-1"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="detailsTextColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Details Text Color</FormLabel>
                        <div className="flex gap-2 items-center">
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              disabled={isLoading}
                              className="w-20 h-10 cursor-pointer"
                            />
                          </FormControl>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              disabled={isLoading}
                              placeholder="#233259"
                              className="flex-1"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Sections */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Service Sections</h2>
              <p className="text-gray-600">
                Fill in the sections you want to include in this service
              </p>
            </div>

            {/* Section 1: Image, Title, Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Section 1: Image, Title & Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="section1Image"
                  render={({ field: { onChange, name, onBlur, ref } }) => (
                    <FormItem>
                      <FormLabel>Section 1 Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          name={name}
                          onBlur={onBlur}
                          ref={ref}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section1Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 1 Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter section title..."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section1Description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 1 Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter section description..."
                          rows={3}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 2: Video URL */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Section 2: Video Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="section2VideoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 3: Image, Title, Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Section 3: Image, Title & Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="section3Image"
                  render={({ field: { onChange, name, onBlur, ref } }) => (
                    <FormItem>
                      <FormLabel>Section 3 Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          name={name}
                          onBlur={onBlur}
                          ref={ref}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section3Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 3 Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter section title..."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="section3Description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 3 Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter section description..."
                          rows={3}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 4: Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Section 4: Information Cards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="section4Title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section 4 Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter section title..."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Cards</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendCard({ title: "", description: "" })}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  </div>

                  {cardFields.map((field, index) => (
                    <Card key={field.id} className="bg-gray-50">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <h5 className="text-sm font-medium">
                          Card {index + 1}
                        </h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCard(index)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <FormField
                          control={form.control}
                          name={`section4Cards.${index}.image`}
                          render={({
                            field: { onChange, name, onBlur, ref },
                          }) => (
                            <FormItem>
                              <FormLabel>Card Image</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    onChange(file);
                                  }}
                                  name={name}
                                  onBlur={onBlur}
                                  ref={ref}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`section4Cards.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter card title..."
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`section4Cards.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter card description..."
                                  rows={3}
                                  {...field}
                                  disabled={isLoading}
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
              </CardContent>
            </Card>

            {/* Section 5: Price Ranges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Section 5: Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="section5Image"
                    render={({ field: { onChange, name, onBlur, ref } }) => (
                      <FormItem>
                        <FormLabel>Section 5 Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            name={name}
                            onBlur={onBlur}
                            ref={ref}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="section5Title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section 5 Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter section title..."
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Price Ranges</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendPriceRange({
                          title: "",
                          startPrice: undefined,
                          endPrice: undefined,
                        })
                      }
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Price Range
                    </Button>
                  </div>

                  {priceRangeFields.map((field, index) => (
                    <Card key={field.id} className="bg-gray-50">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <h5 className="text-sm font-medium">
                          Price Range {index + 1}
                        </h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePriceRange(index)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <FormField
                          control={form.control}
                          name={`section5PriceRanges.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Range Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Basic Package"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-3 items-start">
                          <FormField
                            control={form.control}
                            name={`section5PriceRanges.${index}.startPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Price ($)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || undefined
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`section5PriceRanges.${index}.endPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Price ($)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || undefined
                                      )
                                    }
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/service-management")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateServiceForm;

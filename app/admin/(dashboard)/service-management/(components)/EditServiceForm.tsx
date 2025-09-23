"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

interface Service {
  id: string;
  categoryId: string;
  name: string;
  overview: string;
  section1?: {
    title?: string | null;
    description?: string | null;
    imageUrl?: string | null;
  };
  section2?: {
    videoUrl?: string | null;
  };
  section3?: {
    title?: string | null;
    description?: string | null;
    imageUrl?: string | null;
  };
  section4?: {
    title?: string | null;
    cards?: Array<{
      id: string;
      title?: string | null;
      description: string;
      imageUrl?: string | null;
    }>;
  };
  section5?: {
    title?: string | null;
    imageUrl?: string | null;
    priceRanges?: Array<{
      id: string;
      title: string;
      startPrice?: number;
      endPrice?: number;
    }>;
  };
}

interface ServiceCard {
  id: string;
  title?: string | null;
  description: string;
  imageUrl?: string | null;
}

interface ServicePriceRange {
  id: string;
  title: string;
  startPrice?: number;
  endPrice?: number;
}

interface EditServiceFormProps {
  serviceId: string;
}

export function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingService, setLoadingService] = useState(true);
  const [service, setService] = useState<Service | null>(null);
  const router = useRouter();

  // Form setup with default values
  const form = useForm<ServiceFormSchema>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      overview: "",
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
    replace: replaceCards,
  } = useFieldArray({
    control: form.control,
    name: "section4Cards",
  });

  const {
    fields: priceRangeFields,
    append: appendPriceRange,
    remove: removePriceRange,
    replace: replacePriceRanges,
  } = useFieldArray({
    control: form.control,
    name: "section5PriceRanges",
  });

  // Load categories and service data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and service in parallel
        const [categoriesResponse, serviceResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/services/${serviceId}`),
        ]);

        // Handle categories
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        } else {
          toast.error("Failed to load categories");
        }

        // Handle service
        const serviceResult = await serviceResponse.json();
        if (serviceResult.success && serviceResult.data) {
          const serviceData = serviceResult.data;
          setService(serviceData);

          // Set form values
          form.reset({
            categoryId: serviceData.categoryId || "",
            name: serviceData.name || "",
            overview: serviceData.overview || "",
            section1Title: serviceData.section1?.title || "",
            section1Description: serviceData.section1?.description || "",
            section2VideoUrl: serviceData.section2?.videoUrl || "",
            section3Title: serviceData.section3?.title || "",
            section3Description: serviceData.section3?.description || "",
            section4Title: serviceData.section4?.title || "",
            section4Cards:
              serviceData.section4?.cards?.map((card: ServiceCard) => ({
                id: card.id, // Include existing card ID
                title: card.title || "",
                description: card.description || "",
                // Note: We don't include the existing image file here as it's already uploaded
              })) || [],
            section5Title: serviceData.section5?.title || "",
            section5PriceRanges:
              serviceData.section5?.priceRanges?.map(
                (range: ServicePriceRange) => ({
                  title: range.title || "",
                  startPrice: range.startPrice,
                  endPrice: range.endPrice,
                })
              ) || [],
          });

          // Update field arrays with existing data
          if (serviceData.section4?.cards) {
            replaceCards(
              serviceData.section4.cards.map((card: ServiceCard) => ({
                id: card.id, // Include existing card ID
                title: card.title || "",
                description: card.description || "",
              }))
            );
          }

          if (serviceData.section5?.priceRanges) {
            replacePriceRanges(
              serviceData.section5.priceRanges.map(
                (range: ServicePriceRange) => ({
                  title: range.title || "",
                  startPrice: range.startPrice,
                  endPrice: range.endPrice,
                })
              )
            );
          }
        } else {
          toast.error("Failed to load service data");
          router.push("/admin/service-management");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoadingCategories(false);
        setLoadingService(false);
      }
    };

    fetchData();
  }, [serviceId, form, replaceCards, replacePriceRanges, router]);

  const onSubmit = async (data: ServiceFormSchema) => {
    try {
      setIsLoading(true);

      // Create FormData for file uploads
      const formData = new FormData();

      // Basic service data
      formData.append("categoryId", data.categoryId);
      formData.append("name", data.name);
      formData.append("overview", data.overview);

      // Section 1 data
      if (data.section1Title)
        formData.append("section1Title", data.section1Title);
      if (data.section1Description)
        formData.append("section1Description", data.section1Description);
      if (data.section1Image)
        formData.append("section1Image", data.section1Image);

      // Section 2 data
      if (data.section2VideoUrl)
        formData.append("section2VideoUrl", data.section2VideoUrl);

      // Section 3 data
      if (data.section3Title)
        formData.append("section3Title", data.section3Title);
      if (data.section3Description)
        formData.append("section3Description", data.section3Description);
      if (data.section3Image)
        formData.append("section3Image", data.section3Image);

      // Section 4 data
      if (data.section4Title)
        formData.append("section4Title", data.section4Title);

      if (data.section4Cards && data.section4Cards.length > 0) {
        formData.append(
          "section4CardsCount",
          data.section4Cards.length.toString()
        );

        data.section4Cards.forEach((card, index) => {
          // Send existing card ID if it exists
          if (card.id) {
            formData.append(`section4Cards[${index}].id`, card.id);
          }
          if (card.title)
            formData.append(`section4Cards[${index}].title`, card.title);
          formData.append(
            `section4Cards[${index}].description`,
            card.description
          );
          if (card.image)
            formData.append(`section4Cards[${index}].image`, card.image);
        });
      }

      // Section 5 data
      if (data.section5Title)
        formData.append("section5Title", data.section5Title);
      if (data.section5Image)
        formData.append("section5Image", data.section5Image);

      if (data.section5PriceRanges && data.section5PriceRanges.length > 0) {
        formData.append(
          "section5PriceRangesCount",
          data.section5PriceRanges.length.toString()
        );

        data.section5PriceRanges.forEach((range, index) => {
          formData.append(`section5PriceRanges[${index}].title`, range.title);
          if (range.startPrice !== undefined) {
            formData.append(
              `section5PriceRanges[${index}].startPrice`,
              range.startPrice.toString()
            );
          }
          if (range.endPrice !== undefined) {
            formData.append(
              `section5PriceRanges[${index}].endPrice`,
              range.endPrice.toString()
            );
          }
        });
      }

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update service");
      }

      // Success
      toast.success("Service updated successfully!");
      router.push("/admin/service-management");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update service"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingService || loadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg font-medium">Loading service data...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">Service not found</p>
          <Button
            onClick={() => router.push("/admin/service-management")}
            className="mt-4"
          >
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-gray-600 mt-2">
          Update service information and content sections
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
                        disabled={isLoading}
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
            </CardContent>
          </Card>

          {/* Service Sections */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Service Sections</h2>
              <p className="text-gray-600">
                Update the sections for this service
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
                {service.section1?.imageUrl && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Current Image:</p>
                    <Image
                      src={service.section1.imageUrl}
                      alt="Section 1 Current"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded border"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a new image and save changes to replace
                    </p>
                  </div>
                )}

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
                {service.section3?.imageUrl && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Current Image:</p>
                    <Image
                      src={service.section3.imageUrl}
                      alt="Section 3 Current"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded border"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a new image and save changes to replace
                    </p>
                  </div>
                )}

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
                      onClick={() => appendCard({ title: "", description: "" })} // New cards don't have IDs
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  </div>

                  {cardFields.map((field, index) => {
                    // Find the existing card by ID rather than index to handle removals correctly
                    const currentCardData = form.getValues(
                      `section4Cards.${index}`
                    );
                    const existingCard = currentCardData?.id
                      ? service.section4?.cards?.find(
                          (card) => card.id === currentCardData.id
                        )
                      : null;

                    return (
                      <Card key={field.id} className="bg-gray-50 gap-0">
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
                          {existingCard?.imageUrl && (
                            <div className="mb-3">
                              <p className="text-xs font-medium mb-1">
                                Current Image:
                              </p>
                              <Image
                                src={existingCard.imageUrl}
                                alt={`Card ${index + 1} Current`}
                                width={96}
                                height={96}
                                className="w-24 h-24 object-cover rounded border"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Upload a new image and save changes to replace
                              </p>
                            </div>
                          )}

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
                    );
                  })}
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
                  <div className="space-y-4">
                    {service.section5?.imageUrl && (
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Current Image:
                        </p>
                        <Image
                          src={service.section5.imageUrl}
                          alt="Section 5 Current"
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded border"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Upload a new image and save changes to replace
                        </p>
                      </div>
                    )}

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
                  </div>

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
                    <Card key={field.id} className="bg-gray-50 gap-0">
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

                        <div className="grid grid-cols-2 gap-3">
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
              {isLoading ? "Updating..." : "Update Service"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditServiceForm;

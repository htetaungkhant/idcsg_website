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

export function CreateServiceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
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

      const response = await fetch("/api/services", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create service");
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {isLoading ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateServiceForm;

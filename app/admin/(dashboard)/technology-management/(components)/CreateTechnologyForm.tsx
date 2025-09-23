"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon } from "lucide-react";
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

export function CreateTechnologyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Form setup with default values
  const form = useForm<DentalTechnologyFormSchema>({
    resolver: zodResolver(dentalTechnologyFormSchema),
    defaultValues: {
      title: "",
      overview: "",
      description: "",
      section1Title: "",
      section1Description: "",
      card1Title: "",
      card1Description: "",
      card2Title: "",
      card2Description: "",
    },
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

      // Create FormData for file uploads
      const formData = new FormData();

      // Required fields
      formData.append("title", data.title);
      formData.append("overview", data.overview);
      if (data.mainImage) {
        formData.append("mainImage", data.mainImage);
      }

      // Optional main description
      if (data.description) {
        formData.append("description", data.description);
      }

      // Section 1 data
      if (data.section1Title) {
        formData.append("section1Title", data.section1Title);
      }
      if (data.section1Description) {
        formData.append("section1Description", data.section1Description);
      }
      if (data.section1Image) {
        formData.append("section1Image", data.section1Image);
      }

      // Card 1 data
      if (data.card1Title) {
        formData.append("card1Title", data.card1Title);
      }
      if (data.card1Description) {
        formData.append("card1Description", data.card1Description);
      }
      if (data.card1Image) {
        formData.append("card1Image", data.card1Image);
      }

      // Card 2 data
      if (data.card2Title) {
        formData.append("card2Title", data.card2Title);
      }
      if (data.card2Description) {
        formData.append("card2Description", data.card2Description);
      }
      if (data.card2Image) {
        formData.append("card2Image", data.card2Image);
      }

      const response = await fetch("/api/technologies", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create technology");
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
                Basic Information (Required)
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Card 1 */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-foreground">
                Card 1 (Optional)
              </h3>

              {/* Card 1 Image */}
              <FormField
                control={form.control}
                name="card1Image"
                render={({ field: { onChange, name, ref } }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Card 1 Image
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
                            handleImagePreview(file, "card1Image");
                          }}
                          className="cursor-pointer"
                        />
                        {previews.card1Image && (
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previews.card1Image}
                              alt="Card 1 preview"
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

              {/* Card 1 Title */}
              <FormField
                control={form.control}
                name="card1Title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Card 1 Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter card 1 title..."
                        className="text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Card 1 Description */}
              <FormField
                control={form.control}
                name="card1Description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Card 1 Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter card 1 description..."
                        className="min-h-[100px] text-base resize-vertical"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Card 2 */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-foreground">
                Card 2 (Optional)
              </h3>

              {/* Card 2 Image */}
              <FormField
                control={form.control}
                name="card2Image"
                render={({ field: { onChange, name, ref } }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Card 2 Image
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
                            handleImagePreview(file, "card2Image");
                          }}
                          className="cursor-pointer"
                        />
                        {previews.card2Image && (
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previews.card2Image}
                              alt="Card 2 preview"
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

              {/* Card 2 Title */}
              <FormField
                control={form.control}
                name="card2Title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Card 2 Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter card 2 title..."
                        className="text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Card 2 Description */}
              <FormField
                control={form.control}
                name="card2Description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Card 2 Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter card 2 description..."
                        className="min-h-[100px] text-base resize-vertical"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

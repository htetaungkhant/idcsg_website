"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, FileText, Save, Loader2 } from "lucide-react";
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
  officePolicyFormSchema,
  type OfficePolicyFormSchema,
} from "@/lib/schema";
import type { OfficePolicy } from "@/app/generated/prisma";

interface OfficePolicyFormProps {
  initialData?: OfficePolicy | null;
}

export function OfficePolicyForm({ initialData }: OfficePolicyFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Form setup with default values
  const form = useForm<OfficePolicyFormSchema>({
    resolver: zodResolver(officePolicyFormSchema),
    defaultValues: {
      hostingDate: initialData?.hostingDate || "",
      description: initialData?.description || "",
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        hostingDate: initialData.hostingDate,
        description: initialData.description,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: OfficePolicyFormSchema) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/office-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save office policy");
      }

      if (result.success) {
        toast.success(result.message || "Office policy saved successfully!");

        // Reset form with new data to prevent "unsaved changes" state
        form.reset({
          hostingDate: result.data.hostingDate,
          description: result.data.description,
        });
      } else {
        throw new Error(result.error || "Failed to save office policy");
      }
    } catch (error) {
      console.error("Error saving office policy:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while saving"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = form.formState.isDirty;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Office Policy</h1>
          <p className="text-muted-foreground">
            Manage your website&apos;s office policy content
          </p>
        </div>
      </div>

      <Separator />

      {/* Main Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Office Policy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hosting Date Field */}
              <FormField
                control={form.control}
                name="hostingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Hosting Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., January 2024, Last updated: March 15, 2024"
                        {...field}
                        className="max-w-md"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Enter the date when this office policy was last updated or
                      hosted. This can be any text format you prefer.
                    </p>
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Office Policy Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your office policy content here..."
                        {...field}
                        className="min-h-[300px] resize-vertical"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Enter the complete office policy content that will be
                      displayed to your website visitors.
                    </p>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <div>
              {hasChanges && (
                <p className="text-sm text-muted-foreground">
                  You have unsaved changes
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="min-w-32">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Office Policy
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default OfficePolicyForm;

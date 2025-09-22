"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const addCategorySchema = z.object({
  title: z
    .string()
    .min(1, "Category title is required")
    .min(2, "Category title must be at least 2 characters")
    .max(100, "Category title must be less than 100 characters")
    .trim(),
});

type AddCategoryFormData = z.infer<typeof addCategorySchema>;

interface AddCategoryDialogProps {
  onCategoryAdded?: () => void;
}

export default function AddCategoryDialog({
  onCategoryAdded,
}: AddCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: AddCategoryFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create category");
      }

      // Success
      toast.success("Category created successfully!");
      form.reset();
      setIsOpen(false);

      // Notify parent component to refresh the list
      if (onCategoryAdded) {
        onCategoryAdded();
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category title..."
                      {...field}
                      disabled={isLoading}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

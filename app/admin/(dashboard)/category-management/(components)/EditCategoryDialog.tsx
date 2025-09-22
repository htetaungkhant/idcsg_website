"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit } from "lucide-react";
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

const editCategorySchema = z.object({
  title: z
    .string()
    .min(1, "Category title is required")
    .min(2, "Category title must be at least 2 characters")
    .max(100, "Category title must be less than 100 characters")
    .trim(),
});

type EditCategoryFormData = z.infer<typeof editCategorySchema>;

interface EditCategoryDialogProps {
  categoryId: string;
  currentTitle: string;
  onCategoryUpdated?: () => void;
}

export default function EditCategoryDialog({
  categoryId,
  currentTitle,
  onCategoryUpdated,
}: EditCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      title: currentTitle,
    },
  });

  const onSubmit = async (data: EditCategoryFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update category");
      }

      // Success
      toast.success("Category updated successfully!");
      setIsOpen(false);

      // Notify parent component to refresh the list
      if (onCategoryUpdated) {
        onCategoryUpdated();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update category"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form to current values when closing
      form.reset({ title: currentTitle });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
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
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? "Updating..." : "Update Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

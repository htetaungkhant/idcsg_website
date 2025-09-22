"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryTitle: string;
  serviceCount: number;
  onCategoryDeleted?: () => void;
}

export default function DeleteCategoryDialog({
  categoryId,
  categoryTitle,
  serviceCount,
  onCategoryDeleted,
}: DeleteCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete category");
      }

      // Success
      toast.success("Category deleted successfully!");

      // Notify parent component to refresh the list
      if (onCategoryDeleted) {
        onCategoryDeleted();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category &quot;
            <strong>{categoryTitle}</strong>&quot;?
            {serviceCount > 0 && (
              <span className="block mt-2 text-destructive font-medium">
                Warning: This category has {serviceCount} service
                {serviceCount > 1 ? "s" : ""} associated with it. Deleting this
                category will also delete all its services permanently.
              </span>
            )}
            <span className="block mt-2">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
          >
            {isLoading ? "Deleting..." : "Delete Category"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

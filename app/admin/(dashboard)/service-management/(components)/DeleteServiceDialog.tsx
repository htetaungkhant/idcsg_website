"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ServiceWithSections } from "@/lib/services/service-service";

interface DeleteServiceDialogProps {
  service: ServiceWithSections;
  onServiceDeleted?: () => void;
}

export default function DeleteServiceDialog({
  service,
  onServiceDeleted,
}: DeleteServiceDialogProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/services/${service.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete service");
      }

      // Success
      toast.success("Service deleted successfully!");
      setShowDeleteAlert(false);

      // Notify parent component to refresh the list
      if (onServiceDeleted) {
        onServiceDeleted();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getSectionCount = () => {
    let count = 0;
    if (service.section1) count++;
    if (service.section2) count++;
    if (service.section3) count++;
    if (service.section4) count++;
    if (service.section5) count++;
    return count;
  };

  const getSectionDetails = () => {
    const sections = [];
    if (service.section1) sections.push("Section 1");
    if (service.section2) sections.push("Video content");
    if (service.section3) sections.push("Section 3");
    if (service.section4)
      sections.push(`${service.section4.cards.length} cards`);
    if (service.section5)
      sections.push(`${service.section5.priceRanges.length} price ranges`);
    return sections;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDeleteAlert(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Are you sure you want to delete this service? This action
                  cannot be undone.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {service.name}
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Category: {service.category.title}</p>
                    <p>Sections: {getSectionCount()}</p>
                    {getSectionDetails().length > 0 && (
                      <p>Content: {getSectionDetails().join(", ")}</p>
                    )}
                    <p>
                      Created:{" "}
                      {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-800 font-medium mb-1">
                    ⚠️ This will permanently delete:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    <li>Service information and overview</li>
                    <li>All sections and their content</li>
                    <li>All uploaded images</li>
                    <li>All cards and price ranges</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Service"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

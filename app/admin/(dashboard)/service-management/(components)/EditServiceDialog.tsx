"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ServiceWithSections } from "@/lib/services/service-service";

interface EditServiceDialogProps {
  service: ServiceWithSections;
}

export default function EditServiceDialog({ service }: EditServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/service-management/${service.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            This will take you to the service edit page where you can modify all
            sections and content.
          </p>
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-sm text-gray-900 mb-1">
              {service.name}
            </h4>
            <p className="text-xs text-gray-600">
              Category: {service.category.title}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Sections:{" "}
              {[
                service.section1 ? "Section 1" : null,
                service.section2 ? "Video" : null,
                service.section3 ? "Section 3" : null,
                service.section4
                  ? `Cards (${service.section4.cards.length})`
                  : null,
                service.section5
                  ? `Pricing (${service.section5.priceRanges.length})`
                  : null,
              ]
                .filter(Boolean)
                .join(", ") || "None"}
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Edit Service</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

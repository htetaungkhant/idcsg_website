"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryWithServicesCount } from "@/lib/services/category-service";
import AddCategoryDialog from "./AddCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

interface CategoryManagementProps {
  initialCategories: CategoryWithServicesCount[];
}

export default function CategoryManagement({
  initialCategories,
}: CategoryManagementProps) {
  const [categories, setCategories] =
    useState<CategoryWithServicesCount[]>(initialCategories);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch categories");
      }

      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    }
  };

  const handleCategoryAdded = () => {
    fetchCategories();
  };

  const handleCategoryUpdated = () => {
    fetchCategories();
  };

  const handleCategoryDeleted = () => {
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage categories for your services
          </p>
        </div>
        <AddCategoryDialog onCategoryAdded={handleCategoryAdded} />
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-48 text-muted-foreground">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-lg font-semibold mb-2">
                No Categories Found
              </h3>
              <p className="text-sm mb-4">
                Get started by creating your first category. Categories help
                organize your services.
              </p>
              <div className="flex justify-center">
                <AddCategoryDialog onCategoryAdded={handleCategoryAdded} />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                      {category._count.services}{" "}
                      {category._count.services === 1 ? "Service" : "Services"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <EditCategoryDialog
                        categoryId={category.id}
                        currentTitle={category.title}
                        onCategoryUpdated={handleCategoryUpdated}
                      />
                      <DeleteCategoryDialog
                        categoryId={category.id}
                        categoryTitle={category.title}
                        serviceCount={category._count.services}
                        onCategoryDeleted={handleCategoryDeleted}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

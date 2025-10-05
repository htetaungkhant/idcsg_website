import db from "@/lib/db/db";
import type { Category } from "@/app/generated/prisma";

export interface CreateCategoryData {
  title: string;
}

export interface CategoryWithServicesCount extends Category {
  _count: {
    services: number;
  };
}

export interface GetCategoriesOptions {
  orderBy?: "name" | "sortOrder" | "createdAt";
  orderDirection?: "asc" | "desc";
  limit?: number;
}

/**
 * Fetch all categories with service count
 */
export async function getCategories(
  options: GetCategoriesOptions = {}
): Promise<CategoryWithServicesCount[]> {
  try {
    const { orderBy = "createdAt", orderDirection = "asc", limit } = options;

    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            services: true,
          },
        },
      },
      orderBy: { [orderBy]: orderDirection },
      take: limit,
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

/**
 * Create a new category
 */
export async function createCategory(
  data: CreateCategoryData
): Promise<Category> {
  try {
    // Check if category with same title already exists
    const existingCategory = await db.category.findFirst({
      where: {
        title: {
          equals: data.title,
          mode: "insensitive",
        },
      },
    });

    if (existingCategory) {
      throw new Error("Category with this title already exists");
    }

    const category = await db.category.create({
      data: {
        title: data.title.trim(),
      },
    });

    return category;
  } catch (error) {
    console.error("Error creating category:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create category");
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const category = await db.category.findUnique({
      where: { id },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw new Error("Failed to fetch category");
  }
}

/**
 * Delete category by ID (will cascade delete all associated services)
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    await db.category.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}

/**
 * Update category title
 */
export async function updateCategory(
  id: string,
  data: CreateCategoryData
): Promise<Category> {
  try {
    // Check if another category with same title already exists
    const existingCategory = await db.category.findFirst({
      where: {
        title: {
          equals: data.title,
          mode: "insensitive",
        },
        NOT: {
          id: id,
        },
      },
    });

    if (existingCategory) {
      throw new Error("Category with this title already exists");
    }

    const category = await db.category.update({
      where: { id },
      data: {
        title: data.title.trim(),
      },
    });

    return category;
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update category");
  }
}

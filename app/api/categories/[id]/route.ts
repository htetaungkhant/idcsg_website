import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
  type CreateCategoryData,
} from "@/lib/services/category-service";

// Validation schema for updating a category
const updateCategorySchema = z.object({
  title: z
    .string()
    .min(1, "Category title is required")
    .min(2, "Category title must be at least 2 characters")
    .max(100, "Category title must be less than 100 characters")
    .trim(),
});

/**
 * GET /api/categories/[id] - Get a specific category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID is required",
        },
        { status: 400 }
      );
    }

    const category = await getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error in GET /api/categories/[id]:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch category",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/categories/[id] - Update a specific category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const categoryData: CreateCategoryData = validationResult.data;
    const category = await updateCategory(id, categoryData);

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error in PUT /api/categories/[id]:", error);

    const statusCode =
      error instanceof Error && error.message.includes("already exists")
        ? 409
        : 500;

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update category",
      },
      { status: statusCode }
    );
  }
}

/**
 * DELETE /api/categories/[id] - Delete a specific category
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID is required",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
        },
        { status: 404 }
      );
    }

    await deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/categories/[id]:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete category",
      },
      { status: 500 }
    );
  }
}

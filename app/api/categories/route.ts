import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getCategories,
  createCategory,
  type CreateCategoryData,
} from "@/lib/services/category-service";

// Validation schema for creating a category
const createCategorySchema = z.object({
  title: z
    .string()
    .min(1, "Category title is required")
    .min(2, "Category title must be at least 2 characters")
    .max(100, "Category title must be less than 100 characters")
    .trim(),
});

/**
 * GET /api/categories - Fetch all categories
 */
export async function GET() {
  try {
    const categories = await getCategories();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error in GET /api/categories:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories - Create a new category
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createCategorySchema.safeParse(body);

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
    const category = await createCategory(categoryData);

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: "Category created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/categories:", error);

    const statusCode =
      error instanceof Error && error.message.includes("already exists")
        ? 409
        : 500;

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create category",
      },
      { status: statusCode }
    );
  }
}

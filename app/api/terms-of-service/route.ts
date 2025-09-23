import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { termsOfServiceService } from "@/lib/services/terms-of-service-service";
import { z } from "zod";

// Validation schema for terms of service data
const termsOfServiceSchema = z.object({
  hostingDate: z.string().min(1, "Hosting date is required"),
  description: z.string().min(1, "Description is required"),
});

// GET - Fetch current terms of service
export async function GET() {
  try {
    const termsOfService = await termsOfServiceService.getTermsOfService();

    return NextResponse.json({
      success: true,
      data: termsOfService,
    });
  } catch (error) {
    console.error("Error fetching terms of service:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch terms of service",
      },
      { status: 500 }
    );
  }
}

// POST - Create or update terms of service
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    const validationResult = termsOfServiceSchema.safeParse(body);
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

    const { hostingDate, description } = validationResult.data;

    // Create or update terms of service (singleton pattern)
    const result = await termsOfServiceService.createOrUpdateTermsOfService({
      hostingDate,
      description,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Terms of service saved successfully",
    });
  } catch (error) {
    console.error("Error saving terms of service:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save terms of service",
      },
      { status: 500 }
    );
  }
}

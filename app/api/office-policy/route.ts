import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { officePolicyService } from "@/lib/services/office-policy-service";
import { z } from "zod";

// Validation schema for office policy data
const officePolicySchema = z.object({
  hostingDate: z.string().min(1, "Hosting date is required"),
  description: z.string().min(1, "Description is required"),
});

// GET - Fetch current office policy
export async function GET() {
  try {
    const officePolicy = await officePolicyService.getOfficePolicy();

    return NextResponse.json({
      success: true,
      data: officePolicy,
    });
  } catch (error) {
    console.error("Error fetching office policy:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch office policy",
      },
      { status: 500 }
    );
  }
}

// POST - Create or update office policy
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

    const validationResult = officePolicySchema.safeParse(body);
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

    // Create or update office policy (singleton pattern)
    const result = await officePolicyService.createOrUpdateOfficePolicy({
      hostingDate,
      description,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Office policy saved successfully",
    });
  } catch (error) {
    console.error("Error saving office policy:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save office policy",
      },
      { status: 500 }
    );
  }
}

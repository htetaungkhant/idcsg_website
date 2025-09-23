import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { privacyPolicyService } from "@/lib/services/privacy-policy-service";
import { z } from "zod";

// Validation schema for privacy policy data
const privacyPolicySchema = z.object({
  hostingDate: z.string().min(1, "Hosting date is required"),
  description: z.string().min(1, "Description is required"),
});

// GET - Fetch current privacy policy
export async function GET() {
  try {
    const privacyPolicy = await privacyPolicyService.getPrivacyPolicy();

    return NextResponse.json({
      success: true,
      data: privacyPolicy,
    });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch privacy policy",
      },
      { status: 500 }
    );
  }
}

// POST - Create or update privacy policy
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

    const validationResult = privacyPolicySchema.safeParse(body);
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

    // Create or update privacy policy (singleton pattern)
    const result = await privacyPolicyService.createOrUpdatePrivacyPolicy({
      hostingDate,
      description,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Privacy policy saved successfully",
    });
  } catch (error) {
    console.error("Error saving privacy policy:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save privacy policy",
      },
      { status: 500 }
    );
  }
}

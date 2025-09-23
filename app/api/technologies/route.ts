import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TechnologyService } from "@/lib/services/technology-service";
import { dentalTechnologyFormSchema } from "@/lib/schema";
import type { CreateTechnologyFormData } from "@/lib/services/technology-service";

export async function GET() {
  try {
    const technologies = await TechnologyService.getTechnologies();

    return NextResponse.json({
      success: true,
      data: technologies,
    });
  } catch (error) {
    console.error("GET /api/technologies error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch technologies",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();

    // Extract and validate form data
    const technologyData: CreateTechnologyFormData = {
      // Required fields
      mainImage: formData.get("mainImage") as File,
      title: formData.get("title") as string,
      overview: formData.get("overview") as string,

      // Optional fields
      description: (formData.get("description") as string) || undefined,

      // Section 1 fields
      section1Image: (formData.get("section1Image") as File) || undefined,
      section1Title: (formData.get("section1Title") as string) || undefined,
      section1Description:
        (formData.get("section1Description") as string) || undefined,

      // Card 1 fields
      card1Image: (formData.get("card1Image") as File) || undefined,
      card1Title: (formData.get("card1Title") as string) || undefined,
      card1Description:
        (formData.get("card1Description") as string) || undefined,

      // Card 2 fields
      card2Image: (formData.get("card2Image") as File) || undefined,
      card2Title: (formData.get("card2Title") as string) || undefined,
      card2Description:
        (formData.get("card2Description") as string) || undefined,
    };

    // Clean up empty string values to undefined for optional fields
    if (technologyData.description === "")
      technologyData.description = undefined;
    if (technologyData.section1Title === "")
      technologyData.section1Title = undefined;
    if (technologyData.section1Description === "")
      technologyData.section1Description = undefined;
    if (technologyData.card1Title === "") technologyData.card1Title = undefined;
    if (technologyData.card1Description === "")
      technologyData.card1Description = undefined;
    if (technologyData.card2Title === "") technologyData.card2Title = undefined;
    if (technologyData.card2Description === "")
      technologyData.card2Description = undefined;

    // Validate the data using Zod schema
    const validatedData = dentalTechnologyFormSchema.parse(technologyData);

    // Create the technology using the service
    const newTechnology = await TechnologyService.createTechnology(
      validatedData
    );

    return NextResponse.json(
      {
        success: true,
        data: newTechnology,
        message: "Technology created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/technologies error:", error);

    // Handle Zod validation errors
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create technology",
      },
      { status: 500 }
    );
  }
}

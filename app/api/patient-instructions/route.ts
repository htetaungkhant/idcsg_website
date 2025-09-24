import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PatientInstructionsService } from "@/lib/services/patient-instructions-service";

/**
 * GET /api/patient-instructions
 * Retrieve the single PatientInstructions record with all its cards
 */
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const patientInstructions =
      await PatientInstructionsService.getPatientInstructions();

    return NextResponse.json({
      success: true,
      data: patientInstructions,
    });
  } catch (error) {
    console.error("GET /api/patient-instructions error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/patient-instructions
 * Create or update the PatientInstructions record
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Parse banner image data
    const existingBannerImage = formData.get("bannerImage") as string;
    const bannerImageFile = formData.get("bannerImageFile") as File;

    // Parse cards data
    const cardsCountStr = formData.get("cardsCount") as string;
    const cardsCount = parseInt(cardsCountStr) || 0;
    const cards = [];

    for (let i = 0; i < cardsCount; i++) {
      const id = formData.get(`cards[${i}][id]`) as string;
      const contentTitle = formData.get(`cards[${i}][contentTitle]`) as string;
      const contentDescription = formData.get(
        `cards[${i}][contentDescription]`
      ) as string;

      // Background image (required)
      const existingBackgroundImage = formData.get(
        `cards[${i}][backgroundImage]`
      ) as string;
      const backgroundImageFile = formData.get(
        `cards[${i}][backgroundImageFile]`
      ) as File;

      // Content image (optional)
      const existingContentImage = formData.get(
        `cards[${i}][contentImage]`
      ) as string;
      const contentImageFile = formData.get(
        `cards[${i}][contentImageFile]`
      ) as File;

      // Downloadable file (optional)
      const existingDownloadableFile = formData.get(
        `cards[${i}][downloadableFile]`
      ) as string;
      const downloadableFileFile = formData.get(
        `cards[${i}][downloadableFileFile]`
      ) as File;

      // Validate required fields
      if (!contentTitle) {
        return NextResponse.json(
          {
            success: false,
            error: `Content title is required for card ${i + 1}`,
          },
          { status: 400 }
        );
      }

      if (!contentDescription) {
        return NextResponse.json(
          {
            success: false,
            error: `Content description is required for card ${i + 1}`,
          },
          { status: 400 }
        );
      }

      // Validate that background image is provided (either existing or new)
      if (
        !existingBackgroundImage &&
        (!backgroundImageFile || backgroundImageFile.size === 0)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Background image is required for card ${i + 1}`,
          },
          { status: 400 }
        );
      }

      cards.push({
        id: id || undefined,
        contentTitle,
        contentDescription,
        backgroundImage: existingBackgroundImage || undefined,
        backgroundImageFile:
          backgroundImageFile && backgroundImageFile.size > 0
            ? backgroundImageFile
            : undefined,
        contentImage: existingContentImage || undefined,
        contentImageFile:
          contentImageFile && contentImageFile.size > 0
            ? contentImageFile
            : undefined,
        downloadableFile: existingDownloadableFile || undefined,
        downloadableFileFile:
          downloadableFileFile && downloadableFileFile.size > 0
            ? downloadableFileFile
            : undefined,
      });
    }

    // Validate that at least one card is provided
    if (cards.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one card is required",
        },
        { status: 400 }
      );
    }

    const patientInstructionsData = {
      bannerImage: existingBannerImage || undefined,
      bannerImageFile:
        bannerImageFile && bannerImageFile.size > 0
          ? bannerImageFile
          : undefined,
      cards,
    };

    const result =
      await PatientInstructionsService.createOrUpdatePatientInstructions(
        patientInstructionsData
      );

    return NextResponse.json({
      success: true,
      data: result,
      message: "Patient Instructions updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/patient-instructions error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/patient-instructions
 * Delete the PatientInstructions record and all its cards
 */
export async function DELETE() {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await PatientInstructionsService.deletePatientInstructions();

    if (result) {
      return NextResponse.json({
        success: true,
        message: "Patient Instructions deleted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to delete Patient Instructions" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("DELETE /api/patient-instructions error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

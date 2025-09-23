import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PreciseService } from "@/lib/services/precise-service";

/**
 * GET /api/precise
 * Retrieve the single Precise record with its sections
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

    const precise = await PreciseService.getPrecise();

    return NextResponse.json({
      success: true,
      data: precise,
    });
  } catch (error) {
    console.error("GET /api/precise error:", error);
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
 * PUT /api/precise
 * Create or update the Precise record
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

    // Parse sections data
    const sectionsCountStr = formData.get("sectionsCount") as string;
    const sectionsCount = parseInt(sectionsCountStr) || 0;
    const sections = [];

    // Parse sections data
    for (let i = 0; i < sectionsCount; i++) {
      const id = formData.get(`sections[${i}][id]`) as string;
      const title = formData.get(`sections[${i}][title]`) as string;
      const descriptionTitle = formData.get(
        `sections[${i}][descriptionTitle]`
      ) as string;
      const description = formData.get(`sections[${i}][description]`) as string;
      const cardStyle = formData.get(`sections[${i}][cardStyle]`) as string;
      const sortOrder =
        parseInt(formData.get(`sections[${i}][sortOrder]`) as string) || i;
      const existingImageUrl = formData.get(
        `sections[${i}][imageUrl]`
      ) as string;
      const imageFile = formData.get(`sections[${i}][imageFile]`) as File;

      // Validate card style
      if (
        !cardStyle ||
        !["CARDSTYLE1", "CARDSTYLE2", "CARDSTYLE3"].includes(cardStyle)
      ) {
        return NextResponse.json(
          { success: false, error: `Invalid card style for section ${i + 1}` },
          { status: 400 }
        );
      }

      sections.push({
        id: id || undefined,
        title: title || undefined,
        descriptionTitle: descriptionTitle || undefined,
        description: description || undefined,
        cardStyle: cardStyle as "CARDSTYLE1" | "CARDSTYLE2" | "CARDSTYLE3",
        sortOrder,
        imageUrl: existingImageUrl || undefined,
        imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
      });
    }

    const preciseData = {
      sections,
    };

    const result = await PreciseService.createOrUpdatePrecise(preciseData);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Precise updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/precise error:", error);
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
 * DELETE /api/precise
 * Delete the Precise record and all its sections
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

    const result = await PreciseService.deletePrecise();

    if (result) {
      return NextResponse.json({
        success: true,
        message: "Precise deleted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to delete Precise" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("DELETE /api/precise error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

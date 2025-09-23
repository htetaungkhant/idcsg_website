import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { FirstVisitService } from "@/lib/services/first-visit-service";

/**
 * GET /api/first-visit
 * Retrieve the single FirstVisit record with all its sections
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

    const firstVisit = await FirstVisitService.getFirstVisit();

    return NextResponse.json({
      success: true,
      data: firstVisit,
    });
  } catch (error) {
    console.error("GET /api/first-visit error:", error);
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
 * PUT /api/first-visit
 * Create or update the FirstVisit record
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

    // Parse general sections data
    const sectionsCountStr = formData.get("sectionsCount") as string;
    const sectionsCount = parseInt(sectionsCountStr) || 0;
    const sections = [];

    for (let i = 0; i < sectionsCount; i++) {
      const id = formData.get(`sections[${i}][id]`) as string;
      const title = formData.get(`sections[${i}][title]`) as string;
      const descriptionTitle = formData.get(
        `sections[${i}][descriptionTitle]`
      ) as string;
      const description = formData.get(`sections[${i}][description]`) as string;
      const sortOrder =
        parseInt(formData.get(`sections[${i}][sortOrder]`) as string) || i;
      const existingImageUrl = formData.get(
        `sections[${i}][imageUrl]`
      ) as string;
      const imageFile = formData.get(`sections[${i}][imageFile]`) as File;

      // Validate required description
      if (!description) {
        return NextResponse.json(
          {
            success: false,
            error: `Description is required for section ${i + 1}`,
          },
          { status: 400 }
        );
      }

      sections.push({
        id: id || undefined,
        title: title || undefined,
        descriptionTitle: descriptionTitle || undefined,
        description,
        sortOrder,
        imageUrl: existingImageUrl || undefined,
        imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
      });
    }

    // Parse video section data
    let videoSection = undefined;
    const videoSectionId = formData.get("videoSection[id]") as string;
    const videoUrl = formData.get("videoSection[videoUrl]") as string;

    if (videoUrl) {
      videoSection = {
        id: videoSectionId || undefined,
        videoUrl,
      };
    }

    // Parse information section data
    let informationSection = undefined;
    const informationSectionId = formData.get(
      "informationSection[id]"
    ) as string;
    const informationDescriptionTitle = formData.get(
      "informationSection[descriptionTitle]"
    ) as string;
    const informationDescription = formData.get(
      "informationSection[description]"
    ) as string;
    const informationExistingImageUrl = formData.get(
      "informationSection[imageUrl]"
    ) as string;
    const informationImageFile = formData.get(
      "informationSection[imageFile]"
    ) as File;

    if (informationDescription) {
      informationSection = {
        id: informationSectionId || undefined,
        descriptionTitle: informationDescriptionTitle || undefined,
        description: informationDescription,
        imageUrl: informationExistingImageUrl || undefined,
        imageFile:
          informationImageFile && informationImageFile.size > 0
            ? informationImageFile
            : undefined,
      };
    }

    const firstVisitData = {
      sections,
      videoSection,
      informationSection,
    };

    const result = await FirstVisitService.createOrUpdateFirstVisit(
      firstVisitData
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: "First Visit updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/first-visit error:", error);
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
 * DELETE /api/first-visit
 * Delete the FirstVisit record and all its sections
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

    const result = await FirstVisitService.deleteFirstVisit();

    if (result) {
      return NextResponse.json({
        success: true,
        message: "First Visit deleted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to delete First Visit" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("DELETE /api/first-visit error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

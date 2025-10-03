import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TechnologyService } from "@/lib/services/technology-service";

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

    // Parse JSON body
    const technologyData = await request.json();

    // Basic validation for required fields
    if (
      !technologyData?.cardStyle ||
      !["CARDSTYLE1", "CARDSTYLE2"].includes(technologyData.cardStyle)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select a valid card style.",
        },
        { status: 400 }
      );
    } else if (
      !technologyData?.title ||
      !technologyData?.overview ||
      technologyData?.imageUrl === undefined ||
      technologyData?.imageUrl === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, overview, and main image are required",
        },
        { status: 400 }
      );
    }

    // Create the technology using the service
    const newTechnology = await TechnologyService.createTechnology(
      technologyData
    );

    return NextResponse.json({
      success: true,
      data: newTechnology,
    });
  } catch (error) {
    console.error("POST /api/technologies error:", error);

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

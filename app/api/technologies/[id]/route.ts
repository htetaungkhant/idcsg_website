import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  TechnologyService,
  type TechnologyFormData,
} from "@/lib/services/technology-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const technology = await TechnologyService.getTechnologyById(id);

    if (!technology) {
      return NextResponse.json(
        { success: false, error: "Technology not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: technology,
    });
  } catch (error) {
    console.error("GET /api/technologies/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch technology",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Technology ID is required",
        },
        { status: 400 }
      );
    }

    // Parse JSON data
    const technologyData = await request.json();

    // Validate required fields
    if (
      !technologyData?.title ||
      !technologyData?.overview ||
      !technologyData?.imageUrl
    ) {
      return NextResponse.json(
        { success: false, error: "Title, overview, and image are required" },
        { status: 400 }
      );
    }

    // Update the technology
    const updatedTechnology = await TechnologyService.updateTechnology(
      id,
      technologyData as TechnologyFormData
    );

    return NextResponse.json({
      success: true,
      data: updatedTechnology,
    });
  } catch (error) {
    console.error("PUT /api/technologies/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update technology",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if technology exists
    const existingTechnology = await TechnologyService.getTechnologyById(id);
    if (!existingTechnology) {
      return NextResponse.json(
        { success: false, error: "Technology not found" },
        { status: 404 }
      );
    }

    // Delete the technology
    await TechnologyService.deleteTechnology(id);

    return NextResponse.json({
      success: true,
      message: "Technology deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/technologies/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete technology",
      },
      { status: 500 }
    );
  }
}

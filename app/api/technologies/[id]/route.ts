import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TechnologyService, type CreateTechnologyFormData } from "@/lib/services/technology-service";

// Type for updates - making mainImage optional by omitting it and adding it back as optional
type UpdateTechnologyFormData = Omit<CreateTechnologyFormData, 'mainImage'> & {
  mainImage?: File;
};

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

    // Parse form data and build update data dynamically
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const overview = formData.get("overview") as string;

    // Validate required fields
    if (!title || !overview) {
      return NextResponse.json(
        { success: false, error: "Title and overview are required" },
        { status: 400 }
      );
    }

    // Start with required fields
    const updateData: UpdateTechnologyFormData = {
      title,
      overview,
    };

    // Add optional fields only if they exist
    const description = formData.get("description") as string | null;
    if (description) updateData.description = description;

    const mainImage = formData.get("mainImage") as File | null;
    if (mainImage && mainImage.size > 0) updateData.mainImage = mainImage;

    const section1Title = formData.get("section1Title") as string | null;
    if (section1Title) updateData.section1Title = section1Title;

    const section1Description = formData.get("section1Description") as
      | string
      | null;
    if (section1Description)
      updateData.section1Description = section1Description;

    const section1Image = formData.get("section1Image") as File | null;
    if (section1Image && section1Image.size > 0)
      updateData.section1Image = section1Image;

    const card1Title = formData.get("card1Title") as string | null;
    if (card1Title) updateData.card1Title = card1Title;

    const card1Description = formData.get("card1Description") as string | null;
    if (card1Description) updateData.card1Description = card1Description;

    const card1Image = formData.get("card1Image") as File | null;
    if (card1Image && card1Image.size > 0) updateData.card1Image = card1Image;

    const card2Title = formData.get("card2Title") as string | null;
    if (card2Title) updateData.card2Title = card2Title;

    const card2Description = formData.get("card2Description") as string | null;
    if (card2Description) updateData.card2Description = card2Description;

    const card2Image = formData.get("card2Image") as File | null;
    if (card2Image && card2Image.size > 0) updateData.card2Image = card2Image;

    // Update the technology
    // We've validated required fields and mainImage is optional for updates
    const updatedTechnology = await TechnologyService.updateTechnology(
      id,
      updateData as CreateTechnologyFormData
    );

    return NextResponse.json({
      success: true,
      data: updatedTechnology,
      message: "Technology updated successfully",
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

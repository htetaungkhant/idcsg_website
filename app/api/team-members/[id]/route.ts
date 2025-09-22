import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { memberService } from "@/lib/services/member-service";
import { TeamType } from "@/app/generated/prisma";

// GET /api/team-members/[id] - Get member by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const member = await memberService.getMemberById(id);

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ data: member });
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

// PUT /api/team-members - Update member
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse FormData
    const formData = await request.formData();

    const id = formData.get("id") as string;
    const memberImage = formData.get("memberImage") as File | null;
    const removeImage = formData.get("removeImage") === "true";
    const memberName = formData.get("memberName") as string | null;
    const memberDesignation = formData.get("memberDesignation") as
      | string
      | null;
    const team = formData.get("team") as TeamType | null;
    const description = formData.get("description") as string | null;
    const isActive = formData.get("isActive") === "true";

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    // Validate file type if provided
    if (memberImage && !memberImage.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size if provided (5MB limit)
    if (memberImage && memberImage.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size should be less than 5MB" },
        { status: 400 }
      );
    }

    // Validate team enum if provided
    if (team && !Object.values(TeamType).includes(team)) {
      return NextResponse.json(
        { error: "Invalid team selected" },
        { status: 400 }
      );
    }

    // Update member
    const member = await memberService.updateMember({
      id,
      imageFile: memberImage || undefined,
      removeImage,
      name: memberName || undefined,
      designation: memberDesignation || undefined,
      team: team || undefined,
      description: description || undefined,
      isActive,
    });

    return NextResponse.json({
      data: member,
      message: "Team member updated successfully",
    });
  } catch (error) {
    console.error("Error updating member:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update team member";
    return NextResponse.json(
      { error: errorMessage },
      {
        status:
          error instanceof Error && error.message === "Member not found"
            ? 404
            : 500,
      }
    );
  }
}

// DELETE /api/team-members/[id] - Delete member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    // Get query parameter for hard delete (optional)
    const url = new URL(request.url);
    const hardDelete = url.searchParams.get("hard") === "true";

    await memberService.deleteMember(id, hardDelete);

    return NextResponse.json({
      message: hardDelete
        ? "Member permanently deleted successfully"
        : "Member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete team member";

    return NextResponse.json(
      { error: errorMessage },
      {
        status:
          error instanceof Error && error.message === "Member not found"
            ? 404
            : 500,
      }
    );
  }
}

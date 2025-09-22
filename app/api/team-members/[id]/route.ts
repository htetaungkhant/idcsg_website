import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { memberService } from "@/lib/services/member-service";

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

// PUT /api/team-members/[id]/order - Update member sort order
export async function PUT(
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
    const { sortOrder } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    if (typeof sortOrder !== "number") {
      return NextResponse.json(
        { error: "Sort order must be a number" },
        { status: 400 }
      );
    }

    const member = await memberService.updateMemberOrder(id, sortOrder);

    return NextResponse.json({
      data: member,
      message: "Member order updated successfully",
    });
  } catch (error) {
    console.error("Error updating member order:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update member order";
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

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { memberService } from "@/lib/services/member-service";
import { TeamType } from "@/app/generated/prisma";

// GET /api/team-members - Get all members or filter by team
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const team = searchParams.get("team") as TeamType | null;
    const isActive = searchParams.get("isActive") === "false" ? false : true;
    const orderBy = searchParams.get("orderBy") as
      | "name"
      | "sortOrder"
      | "createdAt"
      | null;
    const orderDirection = searchParams.get("orderDirection") as
      | "asc"
      | "desc"
      | null;
    const grouped = searchParams.get("grouped") === "true";

    if (grouped) {
      const membersByTeam = await memberService.getMembersByTeam();
      return NextResponse.json({ data: membersByTeam });
    }

    const members = await memberService.getMembers({
      team: team || undefined,
      isActive,
      orderBy: orderBy || "sortOrder",
      orderDirection: orderDirection || "asc",
    });

    return NextResponse.json({ data: members });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST /api/team-members - Create new member
export async function POST(request: NextRequest) {
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

    const memberImage = formData.get("memberImage") as File | null;
    const memberName = formData.get("memberName") as string;
    const memberDesignation = formData.get("memberDesignation") as
      | string
      | null;
    const team = formData.get("team") as TeamType;
    const description = formData.get("description") as string;

    // Validation - only required fields
    if (!memberName || !team || !description) {
      return NextResponse.json(
        { error: "Member name, team, and description are required" },
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

    // Validate team enum
    if (!Object.values(TeamType).includes(team)) {
      return NextResponse.json(
        { error: "Invalid team selected" },
        { status: 400 }
      );
    }

    // Create member
    const member = await memberService.createMember({
      imageFile: memberImage || undefined,
      name: memberName,
      designation: memberDesignation || undefined,
      team,
      description,
    });

    return NextResponse.json(
      {
        data: member,
        message: "Team member created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
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

// DELETE /api/team-members?id=xxx - Delete member
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const hardDelete = searchParams.get("hardDelete") === "true";

    if (!id) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    await memberService.deleteMember(id, hardDelete);

    return NextResponse.json({
      message: hardDelete
        ? "Team member permanently deleted"
        : "Team member deactivated",
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

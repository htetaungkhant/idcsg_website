import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { HomepageSettingsService } from "@/lib/services/homepage-settings-service";

// DELETE - Remove current background media only
export async function DELETE() {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Admin access required",
        },
        { status: 401 }
      );
    }

    // Get current settings
    const currentSettings = await HomepageSettingsService.getActiveSettings();

    if (!currentSettings?.backgroundMediaUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "No background media to remove",
        },
        { status: 400 }
      );
    }

    // Remove only the media, keep other settings intact
    const updatedSettings = await HomepageSettingsService.removeMediaOnly(
      currentSettings.id
    );

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: "Background media removed successfully",
    });
  } catch (error) {
    console.error("Error removing background media:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove background media",
      },
      { status: 500 }
    );
  }
}

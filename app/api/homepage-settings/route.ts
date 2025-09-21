import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { HomepageSettingsService } from "@/lib/services/homepage-settings-service";

// GET - Fetch current homepage settings
export async function GET() {
  try {
    const settings = await HomepageSettingsService.getActiveSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch homepage settings",
      },
      { status: 500 }
    );
  }
}

// POST - Create/Update homepage settings
export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData();

    const backgroundMedia = formData.get("backgroundMedia") as File | null;
    const backgroundColor = formData.get("backgroundColor") as string | null;
    const backgroundOpacity = formData.get("backgroundOpacity") as string;

    // Validate that at least one background option is provided
    if (!backgroundMedia && !backgroundColor) {
      return NextResponse.json(
        {
          success: false,
          error: "Either background media or background color must be provided",
        },
        { status: 400 }
      );
    }

    // Validate opacity
    const opacity = parseInt(backgroundOpacity || "100");
    if (isNaN(opacity) || opacity < 0 || opacity > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Background opacity must be a number between 0 and 100",
        },
        { status: 400 }
      );
    }

    // Prepare media file if provided
    let mediaBuffer: Buffer | undefined;
    let mediaFileName: string | undefined;

    if (backgroundMedia && backgroundMedia.size > 0) {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (backgroundMedia.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: "File size must be less than 10MB",
          },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime", // .mov
      ];

      if (!allowedTypes.includes(backgroundMedia.type)) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid file type. Supported formats: JPEG, PNG, GIF, WebP, MP4, WebM, MOV",
          },
          { status: 400 }
        );
      }

      mediaBuffer = Buffer.from(await backgroundMedia.arrayBuffer());
      mediaFileName = backgroundMedia.name;
    }

    // Create or update settings
    // If only media is provided (no background color), explicitly set backgroundColor to null
    // to remove any existing background color from the database
    const settingsData = {
      backgroundColor: backgroundColor || null,
      backgroundOpacity: opacity,
    };

    const result = await HomepageSettingsService.createOrUpdateSettings(
      settingsData,
      mediaBuffer,
      mediaFileName
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: "Homepage settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving homepage settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save homepage settings",
      },
      { status: 500 }
    );
  }
}

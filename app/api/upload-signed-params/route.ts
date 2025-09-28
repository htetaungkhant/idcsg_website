import { NextRequest, NextResponse } from "next/server";
import { SignApiOptions } from "cloudinary";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

/**
 * POST /api/upload-signed-params - Get signed parameters for direct upload to Cloudinary
 */
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

    // Parse request body
    const body = await request.json();
    const {
      folder = "admin-uploads",
      resourceType = "auto",
      transformation,
      maxBytes,
      allowedFormats,
    } = body;

    const timestamp = Math.round(new Date().getTime() / 1000);

    // Optional: Build upload parameters dynamically
    const uploadParams: SignApiOptions = {
      timestamp: timestamp,
      folder: folder,
    };

    // Add optional parameters if provided
    if (transformation) {
      uploadParams.transformation = transformation;
    }

    if (maxBytes) {
      uploadParams.bytes_limit = maxBytes;
    }

    if (allowedFormats) {
      uploadParams.allowed_formats = allowedFormats;
    }

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      resourceType,
      uploadParams,
    });
  } catch (error) {
    console.error("Error generating signed upload params:", error);
    return NextResponse.json(
      { error: "Failed to generate upload parameters" },
      { status: 500 }
    );
  }
}

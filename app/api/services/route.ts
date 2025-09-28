import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { ServiceService } from "@/lib/services/service-service";

// Validation schema for GET requests
const getServicesSchema = z.object({
  categoryId: z.string().optional(),
});

/**
 * GET /api/services - Fetch all services or filtered by category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;

    const validation = getServicesSchema.safeParse({ categoryId });
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const services = await ServiceService.getServices(categoryId);

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error in GET /api/services:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/services - Create a new service with sections
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (
      !session ||
      (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Parse JSON body
    const serviceData = await request.json();

    // Basic validation
    if (
      !serviceData.categoryId ||
      !serviceData.name ||
      !serviceData.overview ||
      !serviceData.imageUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID, name, overview, and image are required",
        },
        { status: 400 }
      );
    }

    // Create the service
    const service = await ServiceService.createService(serviceData);

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error in POST /api/services:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create service",
      },
      { status: 500 }
    );
  }
}

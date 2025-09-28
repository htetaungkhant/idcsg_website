import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  ServiceService,
  ServiceFormData,
} from "@/lib/services/service-service";

/**
 * GET /api/services/[id] - Get a specific service
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Service ID is required",
        },
        { status: 400 }
      );
    }

    const service = await ServiceService.getServiceById(id);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: "Service not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error in GET /api/services/[id]:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch service",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/services/[id] - Update a specific service
 */
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
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Service ID is required",
        },
        { status: 400 }
      );
    }

    // Parse JSON body
    const serviceData = await request.json();

    // Basic validation
    if (
      !serviceData?.categoryId ||
      !serviceData?.name ||
      !serviceData?.overview
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID, name, and overview are required",
        },
        { status: 400 }
      );
    }

    // Update the service
    const service = await ServiceService.updateService(
      id,
      serviceData as ServiceFormData
    );

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error in PUT /api/services/[id]:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update service",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/services/[id] - Delete a specific service
 */
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
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Service ID is required",
        },
        { status: 400 }
      );
    }

    // Check if service exists
    const existingService = await ServiceService.getServiceById(id);
    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          error: "Service not found",
        },
        { status: 404 }
      );
    }

    // Delete the service
    await ServiceService.deleteService(id);

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/services/[id]:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete service",
      },
      { status: 500 }
    );
  }
}

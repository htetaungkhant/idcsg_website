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

    // Parse FormData
    const formData = await request.formData();

    // Extract basic service data
    const categoryId = formData.get("categoryId") as string;
    const name = formData.get("name") as string;
    const overview = formData.get("overview") as string;
    const image = formData.get("image") as File;

    // Basic validation
    if (!categoryId || !name || !overview || !image) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID, name, overview, and image are required",
        },
        { status: 400 }
      );
    }

    // Extract section data with proper typing
    interface ServiceFormData {
      categoryId: string;
      image: File; // Main service image (mandatory)
      name: string;
      overview: string;
      section1Title?: string;
      section1Description?: string;
      section1Image?: File;
      section2VideoUrl?: string;
      section3Title?: string;
      section3Description?: string;
      section3Image?: File;
      section4Title?: string;
      section4Cards?: Array<{
        title?: string;
        description: string;
        image?: File;
      }>;
      section5Title?: string;
      section5Image?: File;
      section5PriceRanges?: Array<{
        title: string;
        startPrice: number;
        endPrice: number;
      }>;
    }

    const serviceData: ServiceFormData = {
      categoryId,
      image,
      name,
      overview,
    };

    // Section 1 data
    serviceData.section1Title = formData.get("section1Title") as string;
    serviceData.section1Description = formData.get(
      "section1Description"
    ) as string;
    serviceData.section1Image = formData.get("section1Image") as File;

    // Section 2 data
    serviceData.section2VideoUrl = formData.get("section2VideoUrl") as string;

    // Section 3 data
    serviceData.section3Title = formData.get("section3Title") as string;
    serviceData.section3Description = formData.get(
      "section3Description"
    ) as string;
    serviceData.section3Image = formData.get("section3Image") as File;

    // Section 4 data (cards)
    serviceData.section4Title = formData.get("section4Title") as string;

    // Parse cards count
    const section4CardsCount = parseInt(
      (formData.get("section4CardsCount") as string) || "0"
    );
    const section4Cards: Array<{
      title?: string;
      description: string;
      image?: File;
    }> = [];

    for (let i = 0; i < section4CardsCount; i++) {
      const cardTitle = formData.get(`section4Cards[${i}].title`) as string;
      const cardDescription = formData.get(
        `section4Cards[${i}].description`
      ) as string;
      const cardImage = formData.get(`section4Cards[${i}].image`) as File;

      if (cardDescription) {
        section4Cards.push({
          title: cardTitle || undefined,
          description: cardDescription,
          image: cardImage || undefined,
        });
      }
    }

    serviceData.section4Cards = section4Cards;

    // Section 5 data (price ranges)
    serviceData.section5Title = formData.get("section5Title") as string;
    serviceData.section5Image = formData.get("section5Image") as File;

    // Parse price ranges count
    const section5PriceRangesCount = parseInt(
      (formData.get("section5PriceRangesCount") as string) || "0"
    );
    const section5PriceRanges: Array<{
      title: string;
      startPrice: number;
      endPrice: number;
    }> = [];

    for (let i = 0; i < section5PriceRangesCount; i++) {
      const rangeTitle = formData.get(
        `section5PriceRanges[${i}].title`
      ) as string;
      const startPrice = parseFloat(
        (formData.get(`section5PriceRanges[${i}].startPrice`) as string) || "0"
      );
      const endPrice = parseFloat(
        (formData.get(`section5PriceRanges[${i}].endPrice`) as string) || "0"
      );

      if (rangeTitle && startPrice >= 0 && endPrice >= 0) {
        section5PriceRanges.push({
          title: rangeTitle,
          startPrice,
          endPrice,
        });
      }
    }

    serviceData.section5PriceRanges = section5PriceRanges;

    // Collect image files
    const imageFiles: { [key: string]: File } = {};

    // Main service image
    if (serviceData.image instanceof File) {
      imageFiles.image = serviceData.image;
    }

    // Section images
    if (serviceData.section1Image instanceof File) {
      imageFiles.section1Image = serviceData.section1Image;
    }
    if (serviceData.section3Image instanceof File) {
      imageFiles.section3Image = serviceData.section3Image;
    }
    if (serviceData.section5Image instanceof File) {
      imageFiles.section5Image = serviceData.section5Image;
    }

    // Section 4 card images
    if (serviceData.section4Cards) {
      serviceData.section4Cards.forEach((card, index: number) => {
        if (card.image instanceof File) {
          imageFiles[`section4Card${index}`] = card.image;
        }
      });
    }

    // Create the service
    const service = await ServiceService.createService(serviceData, imageFiles);

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

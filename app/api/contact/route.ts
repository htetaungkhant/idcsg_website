import { NextRequest, NextResponse } from "next/server";
import { ContactService } from "@/lib/services/contact-service";
import { contactFormSchema } from "@/lib/schema";

// POST - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body using Zod schema
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, emailId, mobileNumber, message } = validationResult.data;

    // Create the contact message
    const contactMessage = await ContactService.createContactMessage({
      name,
      emailId,
      mobileNumber,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        data: contactMessage,
        message: "Your message has been sent successfully. We'll get back to you soon!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve all contact messages (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const orderBy = (searchParams.get("orderBy") || "createdAt") as
      | "createdAt"
      | "name";
    const orderDirection = (searchParams.get("orderDirection") || "desc") as
      | "asc"
      | "desc";

    // Get contact messages
    const contactMessages = await ContactService.getAllContactMessages({
      limit,
      offset,
      orderBy,
      orderDirection,
    });

    // Get total count
    const totalCount = await ContactService.getContactMessagesCount();

    return NextResponse.json({
      success: true,
      data: contactMessages,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contact messages",
      },
      { status: 500 }
    );
  }
}

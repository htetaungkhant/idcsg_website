import db from "@/lib/db/db";

export interface CreateContactMessageData {
  name: string;
  emailId: string;
  mobileNumber: string;
  message: string;
}

export interface GetContactMessagesOptions {
  limit?: number;
  offset?: number;
  orderBy?: "createdAt" | "name";
  orderDirection?: "asc" | "desc";
}

export class ContactService {
  /**
   * Create a new contact message
   */
  static async createContactMessage(data: CreateContactMessageData) {
    try {
      const contactMessage = await db.contactMessage.create({
        data: {
          name: data.name,
          emailId: data.emailId,
          mobileNumber: data.mobileNumber,
          message: data.message,
        },
      });

      return contactMessage;
    } catch (error) {
      console.error("Error creating contact message:", error);
      throw new Error("Failed to create contact message");
    }
  }

  /**
   * Get all contact messages with pagination and sorting
   */
  static async getAllContactMessages(options?: GetContactMessagesOptions) {
    try {
      const {
        limit = 50,
        offset = 0,
        orderBy = "createdAt",
        orderDirection = "desc",
      } = options || {};

      const contactMessages = await db.contactMessage.findMany({
        orderBy: {
          [orderBy]: orderDirection,
        },
        skip: offset,
        take: limit,
      });

      return contactMessages;
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      throw new Error("Failed to fetch contact messages");
    }
  }

  /**
   * Get a single contact message by ID
   */
  static async getContactMessageById(id: string) {
    try {
      const contactMessage = await db.contactMessage.findUnique({
        where: { id },
      });

      if (!contactMessage) {
        throw new Error("Contact message not found");
      }

      return contactMessage;
    } catch (error) {
      console.error("Error fetching contact message:", error);
      throw new Error("Failed to fetch contact message");
    }
  }

  /**
   * Delete a contact message
   */
  static async deleteContactMessage(id: string) {
    try {
      const contactMessage = await db.contactMessage.delete({
        where: { id },
      });

      return contactMessage;
    } catch (error) {
      console.error("Error deleting contact message:", error);
      throw new Error("Failed to delete contact message");
    }
  }

  /**
   * Get total count of contact messages
   */
  static async getContactMessagesCount() {
    try {
      const count = await db.contactMessage.count();
      return count;
    } catch (error) {
      console.error("Error counting contact messages:", error);
      throw new Error("Failed to count contact messages");
    }
  }

  /**
   * Search contact messages by name or email
   */
  static async searchContactMessages(searchTerm: string) {
    try {
      const contactMessages = await db.contactMessage.findMany({
        where: {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              emailId: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return contactMessages;
    } catch (error) {
      console.error("Error searching contact messages:", error);
      throw new Error("Failed to search contact messages");
    }
  }
}

import { TermsOfService } from "@/app/generated/prisma";
import db from "@/lib/db/db";

export interface CreateTermsOfServiceData {
  hostingDate: string;
  description: string;
}

export interface UpdateTermsOfServiceData {
  id: string;
  hostingDate?: string;
  description?: string;
}

export interface GetTermsOfServiceOptions {
  orderBy?: "hostingDate" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
}

export class TermsOfServiceService {
  /**
   * Create or update terms of service (ensures only one record exists)
   */
  async createOrUpdateTermsOfService(
    data: CreateTermsOfServiceData
  ): Promise<TermsOfService> {
    try {
      // Check if any records exist
      const existingRecords = await db.termsOfService.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (existingRecords.length === 0) {
        // No records exist, create new one
        const termsOfService = await db.termsOfService.create({
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });
        return termsOfService;
      } else if (existingRecords.length === 1) {
        // One record exists, update it
        const updatedTermsOfService = await db.termsOfService.update({
          where: { id: existingRecords[0].id },
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });
        return updatedTermsOfService;
      } else {
        // Multiple records exist, update the first one and delete others
        const firstRecord = existingRecords[0];
        const otherRecords = existingRecords.slice(1);

        // Update the first record
        const updatedTermsOfService = await db.termsOfService.update({
          where: { id: firstRecord.id },
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });

        // Delete all other records
        if (otherRecords.length > 0) {
          await db.termsOfService.deleteMany({
            where: {
              id: {
                in: otherRecords.map((record) => record.id),
              },
            },
          });
        }

        return updatedTermsOfService;
      }
    } catch (error) {
      console.error("Error creating/updating terms of service:", error);
      throw new Error("Failed to create or update terms of service");
    }
  }

  /**
   * Get the terms of service record (should always be only one)
   */
  async getTermsOfService(): Promise<TermsOfService | null> {
    try {
      // Clean up any duplicate records first
      await this.ensureSingleRecord();

      const termsOfService = await db.termsOfService.findFirst({
        orderBy: { createdAt: "asc" },
      });

      return termsOfService;
    } catch (error) {
      console.error("Error fetching terms of service:", error);
      throw new Error("Failed to fetch terms of service");
    }
  }

  /**
   * Get all terms of service with optional sorting (deprecated - use getTermsOfService instead)
   * @deprecated Use getTermsOfService() instead as there should only be one record
   */
  async getAllTermsOfService(
    options: GetTermsOfServiceOptions = {}
  ): Promise<TermsOfService[]> {
    try {
      const { orderBy = "createdAt", orderDirection = "desc" } = options;

      const termsOfService = await db.termsOfService.findMany({
        orderBy: { [orderBy]: orderDirection },
      });

      return termsOfService;
    } catch (error) {
      console.error("Error fetching terms of service:", error);
      throw new Error("Failed to fetch terms of service");
    }
  }

  /**
   * Get terms of service by ID
   */
  async getTermsOfServiceById(id: string): Promise<TermsOfService | null> {
    try {
      const termsOfService = await db.termsOfService.findUnique({
        where: { id },
      });

      return termsOfService;
    } catch (error) {
      console.error("Error fetching terms of service:", error);
      throw new Error("Failed to fetch terms of service");
    }
  }

  /**
   * Get the latest terms of service (most recent by hosting date)
   * @deprecated Use getTermsOfService() instead as there should only be one record
   */
  async getLatestTermsOfService(): Promise<TermsOfService | null> {
    try {
      return await this.getTermsOfService();
    } catch (error) {
      console.error("Error fetching latest terms of service:", error);
      throw new Error("Failed to fetch latest terms of service");
    }
  }

  /**
   * Update terms of service (deprecated - use createOrUpdateTermsOfService instead)
   * @deprecated Use createOrUpdateTermsOfService() instead to ensure single record
   */
  async updateTermsOfService(
    data: UpdateTermsOfServiceData
  ): Promise<TermsOfService> {
    try {
      const existingTermsOfService = await this.getTermsOfServiceById(data.id);
      if (!existingTermsOfService) {
        throw new Error("Terms of service not found");
      }

      const updatedTermsOfService = await db.termsOfService.update({
        where: { id: data.id },
        data: {
          ...(data.hostingDate && { hostingDate: data.hostingDate }),
          ...(data.description && { description: data.description }),
        },
      });

      return updatedTermsOfService;
    } catch (error) {
      console.error("Error updating terms of service:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update terms of service");
    }
  }

  /**
   * Ensure only one terms of service record exists
   * If multiple records exist, keep the first one and delete others
   */
  private async ensureSingleRecord(): Promise<void> {
    try {
      const allRecords = await db.termsOfService.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (allRecords.length > 1) {
        const otherRecords = allRecords.slice(1);

        // Delete all records except the first one
        await db.termsOfService.deleteMany({
          where: {
            id: {
              in: otherRecords.map((record) => record.id),
            },
          },
        });

        console.log(
          `Cleaned up ${otherRecords.length} duplicate terms of service records`
        );
      }
    } catch (error) {
      console.error("Error ensuring single record:", error);
      // Don't throw error here as this is a cleanup operation
    }
  }

  /**
   * Delete terms of service (deprecated - not allowed for singleton record)
   * @deprecated Terms of service should not be deleted as it's a singleton record
   */
  async deleteTermsOfService(): Promise<void> {
    throw new Error(
      "Deleting terms of service is not allowed. Use createOrUpdateTermsOfService to update the record instead."
    );
  }

  /**
   * Get terms of service count (should always return 0 or 1)
   */
  async getTermsOfServiceCount(): Promise<number> {
    try {
      // Clean up any duplicate records first
      await this.ensureSingleRecord();

      const count = await db.termsOfService.count();
      return count;
    } catch (error) {
      console.error("Error counting terms of service:", error);
      throw new Error("Failed to count terms of service");
    }
  }

  /**
   * Check if terms of service exists
   */
  async hasTermsOfService(): Promise<boolean> {
    try {
      const count = await this.getTermsOfServiceCount();
      return count > 0;
    } catch (error) {
      console.error("Error checking terms of service existence:", error);
      return false;
    }
  }
}

// Export singleton instance
export const termsOfServiceService = new TermsOfServiceService();

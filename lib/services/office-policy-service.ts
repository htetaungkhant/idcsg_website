import { OfficePolicy } from "@/app/generated/prisma";
import db from "@/lib/db/db";

export interface CreateOfficePolicyData {
  hostingDate: string;
  description: string;
}

export interface UpdateOfficePolicyData {
  id: string;
  hostingDate?: string;
  description?: string;
}

export interface GetOfficePolicyOptions {
  orderBy?: "hostingDate" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
}

export class OfficePolicyService {
  /**
   * Create or update office policy (ensures only one record exists)
   */
  async createOrUpdateOfficePolicy(
    data: CreateOfficePolicyData
  ): Promise<OfficePolicy> {
    try {
      // Check if any records exist
      const existingRecords = await db.officePolicy.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (existingRecords.length === 0) {
        // No records exist, create new one
        const officePolicy = await db.officePolicy.create({
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });
        return officePolicy;
      } else if (existingRecords.length === 1) {
        // One record exists, update it
        const updatedOfficePolicy = await db.officePolicy.update({
          where: { id: existingRecords[0].id },
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });
        return updatedOfficePolicy;
      } else {
        // Multiple records exist, update the first one and delete others
        const firstRecord = existingRecords[0];
        const otherRecords = existingRecords.slice(1);

        // Update the first record
        const updatedOfficePolicy = await db.officePolicy.update({
          where: { id: firstRecord.id },
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });

        // Delete all other records
        if (otherRecords.length > 0) {
          await db.officePolicy.deleteMany({
            where: {
              id: {
                in: otherRecords.map((record) => record.id),
              },
            },
          });
        }

        return updatedOfficePolicy;
      }
    } catch (error) {
      console.error("Error creating/updating office policy:", error);
      throw new Error("Failed to create or update office policy");
    }
  }

  /**
   * Get the office policy record (should always be only one)
   */
  async getOfficePolicy(): Promise<OfficePolicy | null> {
    try {
      // Clean up any duplicate records first
      await this.ensureSingleRecord();

      const officePolicy = await db.officePolicy.findFirst({
        orderBy: { createdAt: "asc" },
      });

      return officePolicy;
    } catch (error) {
      console.error("Error fetching office policy:", error);
      throw new Error("Failed to fetch office policy");
    }
  }

  /**
   * Get all office policy with optional sorting (deprecated - use getOfficePolicy instead)
   * @deprecated Use getOfficePolicy() instead as there should only be one record
   */
  async getAllOfficePolicy(
    options: GetOfficePolicyOptions = {}
  ): Promise<OfficePolicy[]> {
    try {
      const { orderBy = "createdAt", orderDirection = "desc" } = options;

      const officePolicy = await db.officePolicy.findMany({
        orderBy: { [orderBy]: orderDirection },
      });

      return officePolicy;
    } catch (error) {
      console.error("Error fetching office policy:", error);
      throw new Error("Failed to fetch office policy");
    }
  }

  /**
   * Get office policy by ID
   */
  async getOfficePolicyById(id: string): Promise<OfficePolicy | null> {
    try {
      const officePolicy = await db.officePolicy.findUnique({
        where: { id },
      });

      return officePolicy;
    } catch (error) {
      console.error("Error fetching office policy:", error);
      throw new Error("Failed to fetch office policy");
    }
  }

  /**
   * Get the latest office policy (most recent by hosting date)
   * @deprecated Use getOfficePolicy() instead as there should only be one record
   */
  async getLatestOfficePolicy(): Promise<OfficePolicy | null> {
    try {
      return await this.getOfficePolicy();
    } catch (error) {
      console.error("Error fetching latest office policy:", error);
      throw new Error("Failed to fetch latest office policy");
    }
  }

  /**
   * Update office policy (deprecated - use createOrUpdateOfficePolicy instead)
   * @deprecated Use createOrUpdateOfficePolicy() instead to ensure single record
   */
  async updateOfficePolicy(
    data: UpdateOfficePolicyData
  ): Promise<OfficePolicy> {
    try {
      const existingOfficePolicy = await this.getOfficePolicyById(data.id);
      if (!existingOfficePolicy) {
        throw new Error("Office policy not found");
      }

      const updatedOfficePolicy = await db.officePolicy.update({
        where: { id: data.id },
        data: {
          ...(data.hostingDate && { hostingDate: data.hostingDate }),
          ...(data.description && { description: data.description }),
        },
      });

      return updatedOfficePolicy;
    } catch (error) {
      console.error("Error updating office policy:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update office policy");
    }
  }

  /**
   * Ensure only one office policy record exists
   * If multiple records exist, keep the first one and delete others
   */
  private async ensureSingleRecord(): Promise<void> {
    try {
      const allRecords = await db.officePolicy.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (allRecords.length > 1) {
        const otherRecords = allRecords.slice(1);

        // Delete all records except the first one
        await db.officePolicy.deleteMany({
          where: {
            id: {
              in: otherRecords.map((record) => record.id),
            },
          },
        });

        console.log(
          `Cleaned up ${otherRecords.length} duplicate office policy records`
        );
      }
    } catch (error) {
      console.error("Error ensuring single record:", error);
      // Don't throw error here as this is a cleanup operation
    }
  }

  /**
   * Delete office policy (deprecated - not allowed for singleton record)
   * @deprecated Office policy should not be deleted as it's a singleton record
   */
  async deleteOfficePolicy(): Promise<void> {
    throw new Error(
      "Deleting office policy is not allowed. Use createOrUpdateOfficePolicy to update the record instead."
    );
  }

  /**
   * Get office policy count (should always return 0 or 1)
   */
  async getOfficePolicyCount(): Promise<number> {
    try {
      // Clean up any duplicate records first
      await this.ensureSingleRecord();

      const count = await db.officePolicy.count();
      return count;
    } catch (error) {
      console.error("Error counting office policy:", error);
      throw new Error("Failed to count office policy");
    }
  }

  /**
   * Check if office policy exists
   */
  async hasOfficePolicy(): Promise<boolean> {
    try {
      const count = await this.getOfficePolicyCount();
      return count > 0;
    } catch (error) {
      console.error("Error checking office policy existence:", error);
      return false;
    }
  }
}

// Export singleton instance
export const officePolicyService = new OfficePolicyService();

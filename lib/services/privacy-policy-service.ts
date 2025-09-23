import { PrivacyPolicy } from "@/app/generated/prisma";
import db from "@/lib/db/db";

export interface CreatePrivacyPolicyData {
  hostingDate: string;
  description: string;
}

export interface UpdatePrivacyPolicyData {
  id: string;
  hostingDate?: string;
  description?: string;
}

export interface GetPrivacyPolicyOptions {
  orderBy?: "hostingDate" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
}

export class PrivacyPolicyService {
  /**
   * Create or update privacy policy (ensures only one record exists)
   */
  async createOrUpdatePrivacyPolicy(
    data: CreatePrivacyPolicyData
  ): Promise<PrivacyPolicy> {
    try {
      // Check if any records exist
      const existingRecords = await db.privacyPolicy.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (existingRecords.length === 0) {
        // No records exist, create new one
        const privacyPolicy = await db.privacyPolicy.create({
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });
        return privacyPolicy;
      } else if (existingRecords.length === 1) {
        // One record exists, update it
        const updatedPrivacyPolicy = await db.privacyPolicy.update({
          where: { id: existingRecords[0].id },
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });
        return updatedPrivacyPolicy;
      } else {
        // Multiple records exist, update the first one and delete others
        const firstRecord = existingRecords[0];
        const otherRecords = existingRecords.slice(1);

        // Update the first record
        const updatedPrivacyPolicy = await db.privacyPolicy.update({
          where: { id: firstRecord.id },
          data: {
            hostingDate: data.hostingDate,
            description: data.description,
          },
        });

        // Delete all other records
        if (otherRecords.length > 0) {
          await db.privacyPolicy.deleteMany({
            where: {
              id: {
                in: otherRecords.map((record) => record.id),
              },
            },
          });
        }

        return updatedPrivacyPolicy;
      }
    } catch (error) {
      console.error("Error creating/updating privacy policy:", error);
      throw new Error("Failed to create or update privacy policy");
    }
  }

  /**
   * Get the privacy policy record (should always be only one)
   */
  async getPrivacyPolicy(): Promise<PrivacyPolicy | null> {
    try {
      // Clean up any duplicate records first
      await this.ensureSingleRecord();

      const privacyPolicy = await db.privacyPolicy.findFirst({
        orderBy: { createdAt: "asc" },
      });

      return privacyPolicy;
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      throw new Error("Failed to fetch privacy policy");
    }
  }

  /**
   * Get all privacy policy with optional sorting (deprecated - use getPrivacyPolicy instead)
   * @deprecated Use getPrivacyPolicy() instead as there should only be one record
   */
  async getAllPrivacyPolicy(
    options: GetPrivacyPolicyOptions = {}
  ): Promise<PrivacyPolicy[]> {
    try {
      const { orderBy = "createdAt", orderDirection = "desc" } = options;

      const privacyPolicy = await db.privacyPolicy.findMany({
        orderBy: { [orderBy]: orderDirection },
      });

      return privacyPolicy;
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      throw new Error("Failed to fetch privacy policy");
    }
  }

  /**
   * Get privacy policy by ID
   */
  async getPrivacyPolicyById(id: string): Promise<PrivacyPolicy | null> {
    try {
      const privacyPolicy = await db.privacyPolicy.findUnique({
        where: { id },
      });

      return privacyPolicy;
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      throw new Error("Failed to fetch privacy policy");
    }
  }

  /**
   * Get the latest privacy policy (most recent by hosting date)
   * @deprecated Use getPrivacyPolicy() instead as there should only be one record
   */
  async getLatestPrivacyPolicy(): Promise<PrivacyPolicy | null> {
    try {
      return await this.getPrivacyPolicy();
    } catch (error) {
      console.error("Error fetching latest privacy policy:", error);
      throw new Error("Failed to fetch latest privacy policy");
    }
  }

  /**
   * Update privacy policy (deprecated - use createOrUpdatePrivacyPolicy instead)
   * @deprecated Use createOrUpdatePrivacyPolicy() instead to ensure single record
   */
  async updatePrivacyPolicy(
    data: UpdatePrivacyPolicyData
  ): Promise<PrivacyPolicy> {
    try {
      const existingPrivacyPolicy = await this.getPrivacyPolicyById(data.id);
      if (!existingPrivacyPolicy) {
        throw new Error("Privacy policy not found");
      }

      const updatedPrivacyPolicy = await db.privacyPolicy.update({
        where: { id: data.id },
        data: {
          ...(data.hostingDate && { hostingDate: data.hostingDate }),
          ...(data.description && { description: data.description }),
        },
      });

      return updatedPrivacyPolicy;
    } catch (error) {
      console.error("Error updating privacy policy:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update privacy policy");
    }
  }

  /**
   * Ensure only one privacy policy record exists
   * If multiple records exist, keep the first one and delete others
   */
  private async ensureSingleRecord(): Promise<void> {
    try {
      const allRecords = await db.privacyPolicy.findMany({
        orderBy: { createdAt: "asc" },
      });

      if (allRecords.length > 1) {
        const otherRecords = allRecords.slice(1);

        // Delete all records except the first one
        await db.privacyPolicy.deleteMany({
          where: {
            id: {
              in: otherRecords.map((record) => record.id),
            },
          },
        });

        console.log(
          `Cleaned up ${otherRecords.length} duplicate privacy policy records`
        );
      }
    } catch (error) {
      console.error("Error ensuring single record:", error);
      // Don't throw error here as this is a cleanup operation
    }
  }

  /**
   * Delete privacy policy (deprecated - not allowed for singleton record)
   * @deprecated Privacy policy should not be deleted as it's a singleton record
   */
  async deletePrivacyPolicy(): Promise<void> {
    throw new Error(
      "Deleting privacy policy is not allowed. Use createOrUpdatePrivacyPolicy to update the record instead."
    );
  }

  /**
   * Get privacy policy count (should always return 0 or 1)
   */
  async getPrivacyPolicyCount(): Promise<number> {
    try {
      // Clean up any duplicate records first
      await this.ensureSingleRecord();

      const count = await db.privacyPolicy.count();
      return count;
    } catch (error) {
      console.error("Error counting privacy policy:", error);
      throw new Error("Failed to count privacy policy");
    }
  }

  /**
   * Check if privacy policy exists
   */
  async hasPrivacyPolicy(): Promise<boolean> {
    try {
      const count = await this.getPrivacyPolicyCount();
      return count > 0;
    } catch (error) {
      console.error("Error checking privacy policy existence:", error);
      return false;
    }
  }
}

// Export singleton instance
export const privacyPolicyService = new PrivacyPolicyService();

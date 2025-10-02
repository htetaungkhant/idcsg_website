import { Member, TeamType } from "@/app/generated/prisma";
import db from "@/lib/db/db";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export interface CreateMemberData {
  imageFile?: File;
  name: string;
  designation?: string;
  team: TeamType;
  description: string;
}

export interface UpdateMemberData {
  id: string;
  imageFile?: File;
  removeImage?: boolean;
  name?: string;
  designation?: string;
  team?: TeamType;
  description?: string;
  isActive?: boolean;
}

export interface GetMembersOptions {
  team?: TeamType;
  isActive?: boolean;
  orderBy?: "name" | "sortOrder" | "createdAt";
  orderDirection?: "asc" | "desc";
  limit?: number;
}

export class MemberService {
  /**
   * Create a new team member
   */
  async createMember(data: CreateMemberData): Promise<Member> {
    try {
      let imageUrl: string | null = null;

      // Upload image to Cloudinary if provided
      if (data.imageFile) {
        const arrayBuffer = await data.imageFile.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const cloudinaryResult = await uploadToCloudinary(fileBuffer, {
          folder: "team-members",
          resource_type: "image",
        });

        imageUrl = cloudinaryResult.secure_url;
      }

      // Get the next sort order
      const lastMember = await db.member.findFirst({
        where: { team: data.team },
        orderBy: { sortOrder: "desc" },
      });
      const nextSortOrder = (lastMember?.sortOrder || 0) + 1;

      // Create member in database
      const member = await db.member.create({
        data: {
          imageUrl,
          name: data.name,
          designation: data.designation || null,
          team: data.team,
          description: data.description,
          sortOrder: nextSortOrder,
        },
      });

      return member;
    } catch (error) {
      console.error("Error creating member:", error);
      throw new Error("Failed to create team member");
    }
  }

  /**
   * Get all members with optional filtering
   */
  async getMembers(options: GetMembersOptions = {}): Promise<Member[]> {
    try {
      const {
        team,
        isActive = true,
        orderBy = "sortOrder",
        orderDirection = "asc",
        limit,
      } = options;

      const where: { isActive: boolean; team?: TeamType } = { isActive };
      if (team) {
        where.team = team;
      }

      const members = await db.member.findMany({
        where,
        orderBy: { [orderBy]: orderDirection },
        take: limit,
      });

      return members;
    } catch (error) {
      console.error("Error fetching members:", error);
      throw new Error("Failed to fetch team members");
    }
  }

  /**
   * Get member by ID
   */
  async getMemberById(id: string): Promise<Member | null> {
    try {
      const member = await db.member.findUnique({
        where: { id },
      });

      return member;
    } catch (error) {
      console.error("Error fetching member:", error);
      throw new Error("Failed to fetch team member");
    }
  }

  /**
   * Update member
   */
  async updateMember(data: UpdateMemberData): Promise<Member> {
    try {
      const existingMember = await this.getMemberById(data.id);
      if (!existingMember) {
        throw new Error("Member not found");
      }

      let imageUrl = existingMember.imageUrl;

      // Handle image removal
      if (data.removeImage) {
        imageUrl = null;

        // Delete old image from Cloudinary
        if (existingMember.imageUrl) {
          try {
            const publicId = this.extractPublicIdFromUrl(
              existingMember.imageUrl
            );
            if (publicId) {
              await deleteFromCloudinary(publicId, "image");
            }
          } catch (deleteError) {
            console.warn("Failed to delete old image:", deleteError);
            // Don't throw error - we can continue with the update
          }
        }
      }
      // If new image is provided, upload it and delete the old one
      else if (data.imageFile) {
        const arrayBuffer = await data.imageFile.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Upload new image
        const cloudinaryResult = await uploadToCloudinary(fileBuffer, {
          folder: "team-members",
          resource_type: "image",
        });

        imageUrl = cloudinaryResult.secure_url;

        // Delete old image from Cloudinary
        if (existingMember.imageUrl) {
          try {
            const publicId = this.extractPublicIdFromUrl(
              existingMember.imageUrl
            );
            if (publicId) {
              await deleteFromCloudinary(publicId, "image");
            }
          } catch (deleteError) {
            console.warn("Failed to delete old image:", deleteError);
            // Don't throw error - we can continue with the update
          }
        }
      }

      // Update member in database
      const updatedMember = await db.member.update({
        where: { id: data.id },
        data: {
          ...(imageUrl !== existingMember.imageUrl && { imageUrl }),
          ...(data.name && { name: data.name }),
          ...(data.designation && { designation: data.designation }),
          ...(data.team && { team: data.team }),
          ...(data.description && { description: data.description }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      return updatedMember;
    } catch (error) {
      console.error("Error updating member:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to update team member");
    }
  }

  /**
   * Delete member (soft delete by setting isActive to false)
   */
  async deleteMember(id: string, hardDelete: boolean = false): Promise<void> {
    try {
      const existingMember = await this.getMemberById(id);
      if (!existingMember) {
        throw new Error("Member not found");
      }

      if (hardDelete) {
        // Hard delete: remove from database and Cloudinary
        if (existingMember.imageUrl) {
          try {
            const publicId = this.extractPublicIdFromUrl(
              existingMember.imageUrl
            );
            if (publicId) {
              await deleteFromCloudinary(publicId, "image");
            }
          } catch (deleteError) {
            console.warn(
              "Failed to delete image from Cloudinary:",
              deleteError
            );
          }
        }

        await db.member.delete({
          where: { id },
        });
      } else {
        // Soft delete: just set isActive to false
        await db.member.update({
          where: { id },
          data: { isActive: false },
        });
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to delete team member");
    }
  }

  /**
   * Update member sort order
   */
  async updateMemberOrder(
    memberId: string,
    newSortOrder: number
  ): Promise<Member> {
    try {
      const updatedMember = await db.member.update({
        where: { id: memberId },
        data: { sortOrder: newSortOrder },
      });

      return updatedMember;
    } catch (error) {
      console.error("Error updating member order:", error);
      throw new Error("Failed to update member order");
    }
  }

  /**
   * Get members grouped by team
   */
  async getMembersByTeam(): Promise<Record<TeamType, Member[]>> {
    try {
      const members = await this.getMembers();

      const groupedMembers: Record<TeamType, Member[]> = {
        DOCTORS: [],
        CONSULTANT_SPECIALISTS: [],
        ALLIED_HEALTH_SUPPORT_STAFF: [],
      };

      members.forEach((member) => {
        groupedMembers[member.team].push(member);
      });

      return groupedMembers;
    } catch (error) {
      console.error("Error fetching members by team:", error);
      throw new Error("Failed to fetch members by team");
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const matches = url.match(/\/team-members\/([^/.]+)/);
      return matches ? `team-members/${matches[1]}` : null;
    } catch {
      console.warn("Failed to extract public ID from URL:", url);
      return null;
    }
  }
}

// Export singleton instance
export const memberService = new MemberService();

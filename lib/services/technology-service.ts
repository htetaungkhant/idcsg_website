import db from "@/lib/db/db";
import {
  deleteFromCloudinaryByUrl,
  deleteFolderFromCloudinary,
} from "@/lib/cloudinary";
import type {
  DentalTechnology,
  DentalTechnologySection1,
  DentalTechnologyCard,
} from "@/app/generated/prisma";

// Technology with all nested sections and relationships
export interface TechnologyWithSections extends DentalTechnology {
  section1?: DentalTechnologySection1 | null;
  cards?: DentalTechnologyCard[] | null;
}

export interface TechnologyFormData {
  id?: string; // For updates
  // Required fields
  imageUrl: string;
  title: string;
  overview: string;

  // Optional main description
  description?: string;

  // Section 1 fields
  section1ImageUrl?: string;
  section1Title?: string;
  section1Description?: string;

  // Cards fields
  cards?: {
    id?: string; // For existing cards during updates
    imageUrl?: string;
    title?: string;
    description?: string;
  }[];
}

export class TechnologyService {
  /**
   * Get all technologies with their sections
   */
  static async getTechnologies(): Promise<TechnologyWithSections[]> {
    const technologies = await db.dentalTechnology.findMany({
      include: {
        section1: true,
        cards: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return technologies;
  }

  /**
   * Get a single technology by ID with all sections
   */
  static async getTechnologyById(
    id: string
  ): Promise<TechnologyWithSections | null> {
    const technology = await db.dentalTechnology.findUnique({
      where: { id },
      include: {
        section1: true,
        cards: true,
      },
    });

    return technology;
  }

  /**
   * Create a new technology with all sections
   */
  static async createTechnology(
    data: TechnologyFormData
  ): Promise<TechnologyWithSections> {
    const technologyId =
      data.id ||
      (
        await db.dentalTechnology.create({
          data: {
            imageUrl: data.imageUrl,
            title: data.title,
            overview: data.overview,
            description: data.description || null,
          },
        })
      ).id;

    try {
      // Update the technology with the main image URL
      await db.dentalTechnology.update({
        where: { id: technologyId },
        data: { imageUrl: data.imageUrl },
      });
      // Create Section 1 if data is provided
      if (
        data.section1Title ||
        data.section1Description ||
        data.section1ImageUrl
      ) {
        await db.dentalTechnologySection1.create({
          data: {
            dentalTechnologyId: technologyId,
            imageUrl: data.section1ImageUrl || null,
            title: data.section1Title || null,
            description: data.section1Description || null,
          },
        });
      }

      // Create Cards if data is provided
      if (data.cards && data.cards.length > 0) {
        for (let i = 0; i < data.cards.length; i++) {
          const card = data.cards[i];

          await db.dentalTechnologyCard.createMany({
            data: {
              dentalTechnologyId: technologyId,
              imageUrl: card.imageUrl || null,
              title: card.title || null,
              description: card.description || null,
              sortOrder: i,
            },
          });
        }
      }

      // Return the full technology with all sections
      const createdTechnology = await this.getTechnologyById(technologyId);
      return createdTechnology as TechnologyWithSections;
    } catch (error) {
      // If there's an error, clean up the technology and any uploaded images
      try {
        // Delete the technology from database
        await db.dentalTechnology.delete({ where: { id: technologyId } });
        // Delete the entire folder from Cloudinary
        await deleteFolderFromCloudinary(`technologies/${technologyId}`);
      } catch (cleanupError) {
        console.error("Failed to cleanup technology and images:", cleanupError);
      }
      throw error;
    }
  }

  /**
   * Update an existing technology
   */
  static async updateTechnology(
    id: string,
    data: TechnologyFormData
  ): Promise<TechnologyWithSections> {
    try {
      // Get existing technology to handle image cleanup
      const existingTechnology = await this.getTechnologyById(id);
      if (!existingTechnology) {
        throw new Error("Technology not found");
      }

      // Delete old main image if it exists
      if (
        existingTechnology?.imageUrl &&
        existingTechnology.imageUrl !== data.imageUrl
      ) {
        await deleteFromCloudinaryByUrl(existingTechnology.imageUrl);
      }

      // Update the main technology
      const updateData: {
        title: string;
        overview: string;
        description?: string | null;
        imageUrl: string;
      } = {
        title: data.title,
        overview: data.overview,
        description: data.description || null,
        imageUrl: data.imageUrl,
      };

      await db.dentalTechnology.update({
        where: { id },
        data: updateData,
      });

      // Handle Section 1
      if (
        data.section1Title ||
        data.section1Description ||
        data.section1ImageUrl
      ) {
        let section1ImageUrl = existingTechnology.section1?.imageUrl;

        // If new image uploaded, delete old one and use new URL
        if (data.section1ImageUrl) {
          if (section1ImageUrl) {
            await deleteFromCloudinaryByUrl(section1ImageUrl);
          }
          section1ImageUrl = data.section1ImageUrl;
        }

        await db.dentalTechnologySection1.upsert({
          where: { dentalTechnologyId: id },
          create: {
            dentalTechnologyId: id,
            imageUrl: section1ImageUrl,
            title: data.section1Title || null,
            description: data.section1Description || null,
          },
          update: {
            imageUrl: section1ImageUrl,
            title: data.section1Title || null,
            description: data.section1Description || null,
          },
        });
      } else {
        // Delete section1 if no data is provided
        const section1 = await db.dentalTechnologySection1.findUnique({
          where: { dentalTechnologyId: id },
        });

        if (section1) {
          if (section1.imageUrl) {
            await deleteFromCloudinaryByUrl(section1.imageUrl);
          }
          await db.dentalTechnologySection1.delete({
            where: { dentalTechnologyId: id },
          });
        }
      }

      // Handle Cards
      if (data.cards && data.cards.length > 0) {
        // Get existing cards to handle cleanup
        const existingCards = existingTechnology.cards || [];

        // Track which existing cards are being updated
        const updatedCardIds = new Set(
          data.cards.filter((card) => card.id).map((card) => card.id!)
        );

        // Delete cards that are no longer needed
        for (const existingCard of existingCards) {
          if (!updatedCardIds.has(existingCard.id)) {
            // Delete image if exists
            if (existingCard.imageUrl) {
              await deleteFromCloudinaryByUrl(existingCard.imageUrl);
            }
            // Delete card
            await db.dentalTechnologyCard.delete({
              where: { id: existingCard.id },
            });
          }
        }

        // Update existing cards and create new ones
        for (let i = 0; i < data.cards.length; i++) {
          const card = data.cards[i];

          if (card.id) {
            // Update existing card
            const existingCard = existingCards.find((ec) => ec.id === card.id);
            let cardImageUrl = existingCard?.imageUrl;

            // If new image uploaded, delete old one and use new URL
            if (card.imageUrl) {
              if (cardImageUrl) {
                await deleteFromCloudinaryByUrl(cardImageUrl);
              }
              cardImageUrl = card.imageUrl;
            }

            await db.dentalTechnologyCard.update({
              where: { id: card.id },
              data: {
                imageUrl: cardImageUrl,
                title: card.title || null,
                description: card.description || null,
                sortOrder: i,
              },
            });
          } else {
            // Create new card
            await db.dentalTechnologyCard.create({
              data: {
                dentalTechnologyId: id,
                imageUrl: card.imageUrl || null,
                title: card.title || null,
                description: card.description || null,
                sortOrder: i,
              },
            });
          }
        }
      } else {
        // Delete all cards if no data is provided
        const existingCards = existingTechnology.cards || [];

        for (const card of existingCards) {
          // Delete image if exists
          if (card.imageUrl) {
            await deleteFromCloudinaryByUrl(card.imageUrl);
          }
          // Delete card
          await db.dentalTechnologyCard.delete({
            where: { id: card.id },
          });
        }
      }

      // Return the updated technology with all sections
      const updatedTechnology = await this.getTechnologyById(id);
      return updatedTechnology as TechnologyWithSections;
    } catch (error) {
      // If there's an error, clean up any newly uploaded images
      try {
        if (data.imageUrl) {
          await deleteFromCloudinaryByUrl(data.imageUrl);
        }
        if (data.section1ImageUrl) {
          await deleteFromCloudinaryByUrl(data.section1ImageUrl);
        }
        if (data.cards) {
          for (const card of data.cards) {
            if (card.imageUrl) {
              await deleteFromCloudinaryByUrl(card.imageUrl);
            }
          }
        }
      } catch (cleanupError) {
        console.error("Failed to cleanup images:", cleanupError);
      }

      throw error;
    }
  }

  /**
   * Delete a technology and all associated data
   */
  static async deleteTechnology(id: string): Promise<void> {
    await db.$transaction(async (prisma) => {
      // Get technology to ensure it exists and clean up images
      const technology = await this.getTechnologyById(id);
      if (!technology) {
        throw new Error("Technology not found");
      }

      // Delete the entire technology folder from Cloudinary
      try {
        await deleteFolderFromCloudinary(`technologies/${id}`);
      } catch (cloudinaryError) {
        console.error(
          `Failed to delete Cloudinary folder for technology ${id}:`,
          cloudinaryError
        );
        // Don't throw error here - we still want to delete from database
      }

      // Delete the technology (cascade will handle sections)
      await prisma.dentalTechnology.delete({
        where: { id },
      });
    });
  }

  /**
   * Get technology count
   */
  static async getTechnologyCount(): Promise<number> {
    return await db.dentalTechnology.count();
  }
}

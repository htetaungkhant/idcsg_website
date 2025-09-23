import db from "@/lib/db/db";
import {
  uploadToCloudinary,
  deleteFromCloudinaryByUrl,
  deleteFolderFromCloudinary,
} from "@/lib/cloudinary";
import type {
  DentalTechnology,
  DentalTechnologySection1,
  DentalTechnologyCard1,
  DentalTechnologyCard2,
} from "@/app/generated/prisma";

// Technology with all nested sections and relationships
export interface TechnologyWithSections extends DentalTechnology {
  section1?: DentalTechnologySection1 | null;
  card1?: DentalTechnologyCard1 | null;
  card2?: DentalTechnologyCard2 | null;
}

// Create technology data interface
export interface CreateTechnologyData {
  imageUrl: string; // Main image (required)
  title: string; // Title (required)
  overview: string; // Overview (required)
  description?: string; // Optional description
  section1?: {
    imageUrl?: string;
    title?: string;
    description?: string;
  };
  card1?: {
    imageUrl?: string;
    title?: string;
    description?: string;
  };
  card2?: {
    imageUrl?: string;
    title?: string;
    description?: string;
  };
}

export interface UpdateTechnologyData extends Partial<CreateTechnologyData> {
  id?: string; // For update operations
}

export interface CreateTechnologyFormData {
  // Required fields
  mainImage: File;
  title: string;
  overview: string;

  // Optional main description
  description?: string;

  // Section 1 fields
  section1Image?: File;
  section1Title?: string;
  section1Description?: string;

  // Card 1 fields
  card1Image?: File;
  card1Title?: string;
  card1Description?: string;

  // Card 2 fields
  card2Image?: File;
  card2Title?: string;
  card2Description?: string;
}

export class TechnologyService {
  /**
   * Get all technologies with their sections
   */
  static async getTechnologies(): Promise<TechnologyWithSections[]> {
    const technologies = await db.dentalTechnology.findMany({
      include: {
        section1: true,
        card1: true,
        card2: true,
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
        card1: true,
        card2: true,
      },
    });

    return technology;
  }

  /**
   * Create a new technology with all sections
   */
  static async createTechnology(
    data: CreateTechnologyFormData
  ): Promise<TechnologyWithSections> {
    // First create the technology record without the main image URL to get the actual ID
    const technology = await db.dentalTechnology.create({
      data: {
        imageUrl: "", // Temporary empty string, will be updated after image upload
        title: data.title,
        overview: data.overview,
        description: data.description || null,
      },
    });

    // Now upload all images using the actual technology ID
    const uploadedImages: { [key: string]: string } = {};

    try {
      // Upload main image (required)
      const mainImageBuffer = Buffer.from(await data.mainImage.arrayBuffer());
      const mainImageUpload = await uploadToCloudinary(mainImageBuffer, {
        folder: `technologies/${technology.id}/main`,
      });
      uploadedImages.mainImage = mainImageUpload.secure_url;

      // Upload Section 1 image if provided
      if (data.section1Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await data.section1Image.arrayBuffer()),
          { folder: `technologies/${technology.id}/section1` }
        );
        uploadedImages.section1Image = uploadResult.secure_url;
      }

      // Upload Card 1 image if provided
      if (data.card1Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await data.card1Image.arrayBuffer()),
          { folder: `technologies/${technology.id}/card1` }
        );
        uploadedImages.card1Image = uploadResult.secure_url;
      }

      // Upload Card 2 image if provided
      if (data.card2Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await data.card2Image.arrayBuffer()),
          { folder: `technologies/${technology.id}/card2` }
        );
        uploadedImages.card2Image = uploadResult.secure_url;
      }

      // Create sections with uploaded image URLs in a transaction
      return await db.$transaction(async (prisma) => {
        // Update the technology with the main image URL
        await prisma.dentalTechnology.update({
          where: { id: technology.id },
          data: { imageUrl: uploadedImages.mainImage },
        });
        // Create Section 1 if data is provided
        if (
          data.section1Title ||
          data.section1Description ||
          uploadedImages.section1Image
        ) {
          await prisma.dentalTechnologySection1.create({
            data: {
              dentalTechnologyId: technology.id,
              imageUrl: uploadedImages.section1Image || null,
              title: data.section1Title || null,
              description: data.section1Description || null,
            },
          });
        }

        // Create Card 1 if data is provided
        if (
          data.card1Title ||
          data.card1Description ||
          uploadedImages.card1Image
        ) {
          await prisma.dentalTechnologyCard1.create({
            data: {
              dentalTechnologyId: technology.id,
              imageUrl: uploadedImages.card1Image || null,
              title: data.card1Title || null,
              description: data.card1Description || null,
            },
          });
        }

        // Create Card 2 if data is provided
        if (
          data.card2Title ||
          data.card2Description ||
          uploadedImages.card2Image
        ) {
          await prisma.dentalTechnologyCard2.create({
            data: {
              dentalTechnologyId: technology.id,
              imageUrl: uploadedImages.card2Image || null,
              title: data.card2Title || null,
              description: data.card2Description || null,
            },
          });
        }

        // Return the full technology with all sections
        const createdTechnology = await this.getTechnologyById(technology.id);
        return createdTechnology as TechnologyWithSections;
      });
    } catch (error) {
      // If there's an error, clean up the technology and any uploaded images
      try {
        // Delete the technology from database
        await db.dentalTechnology.delete({ where: { id: technology.id } });
        // Delete the entire folder from Cloudinary
        await deleteFolderFromCloudinary(`technologies/${technology.id}`);
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
    data: CreateTechnologyFormData
  ): Promise<TechnologyWithSections> {
    // First, upload new images outside of the transaction
    const uploadedImages: { [key: string]: string } = {};

    try {
      // Upload main image if provided
      if (data.mainImage) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await data.mainImage.arrayBuffer()),
          { folder: `technologies/${id}/main` }
        );
        uploadedImages.mainImage = uploadResult.secure_url;
      }

      // Upload Section 1 image if provided
      if (data.section1Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await data.section1Image.arrayBuffer()),
          { folder: `technologies/${id}/section1` }
        );
        uploadedImages.section1Image = uploadResult.secure_url;
      }

      // Upload Card 1 image if provided
      if (data.card1Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await data.card1Image.arrayBuffer()),
          { folder: `technologies/${id}/card1` }
        );
        uploadedImages.card1Image = uploadResult.secure_url;
      }

      // Upload Card 2 image if provided
      if (data.card2Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await data.card2Image.arrayBuffer()),
          { folder: `technologies/${id}/card2` }
        );
        uploadedImages.card2Image = uploadResult.secure_url;
      }

      return await db.$transaction(async (prisma) => {
        // Get existing technology to handle image cleanup
        const existingTechnology = await this.getTechnologyById(id);
        if (!existingTechnology) {
          throw new Error("Technology not found");
        }

        // Update the main technology
        let mainImageUrl = existingTechnology.imageUrl;

        // If new main image uploaded, delete old one and use new URL
        if (uploadedImages.mainImage) {
          if (mainImageUrl) {
            await deleteFromCloudinaryByUrl(mainImageUrl);
          }
          mainImageUrl = uploadedImages.mainImage;
        }

        await prisma.dentalTechnology.update({
          where: { id },
          data: {
            imageUrl: mainImageUrl,
            title: data.title,
            overview: data.overview,
            description: data.description || null,
          },
        });

        // Handle Section 1
        if (
          data.section1Title ||
          data.section1Description ||
          data.section1Image
        ) {
          let section1ImageUrl = existingTechnology.section1?.imageUrl;

          // If new image uploaded, delete old one and use new URL
          if (uploadedImages.section1Image) {
            if (section1ImageUrl) {
              await deleteFromCloudinaryByUrl(section1ImageUrl);
            }
            section1ImageUrl = uploadedImages.section1Image;
          }

          await prisma.dentalTechnologySection1.upsert({
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
          const section1 = await prisma.dentalTechnologySection1.findUnique({
            where: { dentalTechnologyId: id },
          });

          if (section1) {
            if (section1.imageUrl) {
              await deleteFromCloudinaryByUrl(section1.imageUrl);
            }
            await prisma.dentalTechnologySection1.delete({
              where: { dentalTechnologyId: id },
            });
          }
        }

        // Handle Card 1
        if (data.card1Title || data.card1Description || data.card1Image) {
          let card1ImageUrl = existingTechnology.card1?.imageUrl;

          // If new image uploaded, delete old one and use new URL
          if (uploadedImages.card1Image) {
            if (card1ImageUrl) {
              await deleteFromCloudinaryByUrl(card1ImageUrl);
            }
            card1ImageUrl = uploadedImages.card1Image;
          }

          await prisma.dentalTechnologyCard1.upsert({
            where: { dentalTechnologyId: id },
            create: {
              dentalTechnologyId: id,
              imageUrl: card1ImageUrl,
              title: data.card1Title || null,
              description: data.card1Description || null,
            },
            update: {
              imageUrl: card1ImageUrl,
              title: data.card1Title || null,
              description: data.card1Description || null,
            },
          });
        } else {
          // Delete card1 if no data is provided
          const card1 = await prisma.dentalTechnologyCard1.findUnique({
            where: { dentalTechnologyId: id },
          });

          if (card1) {
            if (card1.imageUrl) {
              await deleteFromCloudinaryByUrl(card1.imageUrl);
            }
            await prisma.dentalTechnologyCard1.delete({
              where: { dentalTechnologyId: id },
            });
          }
        }

        // Handle Card 2
        if (data.card2Title || data.card2Description || data.card2Image) {
          let card2ImageUrl = existingTechnology.card2?.imageUrl;

          // If new image uploaded, delete old one and use new URL
          if (uploadedImages.card2Image) {
            if (card2ImageUrl) {
              await deleteFromCloudinaryByUrl(card2ImageUrl);
            }
            card2ImageUrl = uploadedImages.card2Image;
          }

          await prisma.dentalTechnologyCard2.upsert({
            where: { dentalTechnologyId: id },
            create: {
              dentalTechnologyId: id,
              imageUrl: card2ImageUrl,
              title: data.card2Title || null,
              description: data.card2Description || null,
            },
            update: {
              imageUrl: card2ImageUrl,
              title: data.card2Title || null,
              description: data.card2Description || null,
            },
          });
        } else {
          // Delete card2 if no data is provided
          const card2 = await prisma.dentalTechnologyCard2.findUnique({
            where: { dentalTechnologyId: id },
          });

          if (card2) {
            if (card2.imageUrl) {
              await deleteFromCloudinaryByUrl(card2.imageUrl);
            }
            await prisma.dentalTechnologyCard2.delete({
              where: { dentalTechnologyId: id },
            });
          }
        }

        // Return the updated technology with all sections
        const updatedTechnology = await this.getTechnologyById(id);
        return updatedTechnology as TechnologyWithSections;
      });
    } catch (error) {
      // If there's an error, clean up any newly uploaded images
      for (const imageUrl of Object.values(uploadedImages)) {
        try {
          await deleteFromCloudinaryByUrl(imageUrl);
        } catch (cleanupError) {
          console.error("Failed to cleanup image:", imageUrl, cleanupError);
        }
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

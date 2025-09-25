import db from "@/lib/db/db";
import {
  uploadToCloudinary,
  deleteFromCloudinaryByUrl,
  deleteFolderFromCloudinary,
} from "@/lib/cloudinary";
import type {
  Service,
  ServiceSection1,
  ServiceSection2,
  ServiceSection3,
  ServiceSection4,
  ServiceSection4Card,
  ServiceSection5,
  ServiceSection5PriceRange,
  Category,
} from "@/app/generated/prisma";

// Helper function to convert Prisma Decimal to number or null
function convertDecimalToNumber(decimal: unknown): number | null {
  if (decimal === null || decimal === undefined) {
    return null;
  }
  return Number(decimal);
}

// Service with all nested sections and relationships (serialized for client)
export interface ServiceWithSections extends Omit<Service, "section5"> {
  category: Category;
  section1?: ServiceSection1 | null;
  section2?: ServiceSection2 | null;
  section3?: ServiceSection3 | null;
  section4?:
    | (ServiceSection4 & {
        cards: ServiceSection4Card[];
      })
    | null;
  section5?:
    | (Omit<ServiceSection5, "priceRanges"> & {
        priceRanges: Array<
          Omit<ServiceSection5PriceRange, "startPrice" | "endPrice"> & {
            startPrice: number | null;
            endPrice: number | null;
          }
        >;
      })
    | null;
}

// Helper function to serialize service data for client components
function serializeServiceForClient(service: unknown): ServiceWithSections {
  if (!service) return service as ServiceWithSections;

  // Type assertion for Prisma result with Decimal fields
  const typedService = service as Record<string, unknown> & {
    section5?: {
      priceRanges?: Array<Record<string, unknown>>;
      [key: string]: unknown;
    };
  };

  return {
    ...typedService,
    section5: typedService.section5
      ? {
          ...typedService.section5,
          priceRanges:
            typedService.section5.priceRanges?.map((range) => ({
              ...range,
              startPrice: convertDecimalToNumber(range.startPrice),
              endPrice: convertDecimalToNumber(range.endPrice),
            })) || [],
        }
      : null,
  } as ServiceWithSections;
}

// Create service data interfaces
export interface CreateServiceData {
  categoryId: string;
  imageUrl: string; // Main service image (mandatory)
  name: string;
  overview: string;
  section1?: {
    imageUrl?: string;
    title?: string;
    description?: string;
  };
  section2?: {
    videoUrl: string;
  };
  section3?: {
    imageUrl?: string;
    title?: string;
    description?: string;
  };
  section4?: {
    title?: string;
    cards: {
      imageUrl?: string;
      title?: string;
      description: string;
      sortOrder: number;
    }[];
  };
  section5?: {
    imageUrl?: string;
    title?: string;
    priceRanges: {
      title: string;
      startPrice?: number;
      endPrice?: number;
      sortOrder: number;
    }[];
  };
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id?: string; // For update operations
}

export interface CreateServiceFormData {
  categoryId: string;
  image: File; // Main service image (mandatory)
  name: string;
  overview: string;

  // Section 1
  section1Image?: File;
  section1Title?: string;
  section1Description?: string;

  // Section 2
  section2VideoUrl?: string;

  // Section 3
  section3Image?: File;
  section3Title?: string;
  section3Description?: string;

  // Section 4
  section4Title?: string;
  section4Cards?: {
    id?: string; // For existing cards during updates
    image?: File;
    title?: string;
    description: string;
  }[];

  // Section 5
  section5Image?: File;
  section5Title?: string;
  section5PriceRanges?: {
    title: string;
    startPrice?: number;
    endPrice?: number;
  }[];
}

export class ServiceService {
  /**
   * Get all services with their sections and category info
   */
  static async getServices(
    categoryId?: string
  ): Promise<ServiceWithSections[]> {
    const services = await db.service.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true,
        section1: true,
        section2: true,
        section3: true,
        section4: {
          include: {
            cards: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
        section5: {
          include: {
            priceRanges: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return services.map((service) => serializeServiceForClient(service));
  }

  /**
   * Get a single service by ID with all sections
   */
  static async getServiceById(id: string): Promise<ServiceWithSections | null> {
    const service = await db.service.findUnique({
      where: { id },
      include: {
        category: true,
        section1: true,
        section2: true,
        section3: true,
        section4: {
          include: {
            cards: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
        section5: {
          include: {
            priceRanges: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    return service ? serializeServiceForClient(service) : null;
  }

  /**
   * Create a new service with all sections
   */
  static async createService(
    data: CreateServiceFormData,
    imageFiles?: { [key: string]: File }
  ): Promise<ServiceWithSections> {
    // Upload main service image first (mandatory)
    let mainImageUrl: string = "";
    if (data.image && imageFiles?.image) {
      const uploadResult = await uploadToCloudinary(
        Buffer.from(await imageFiles.image.arrayBuffer()),
        { folder: `services/main-images` }
      );
      mainImageUrl = uploadResult.secure_url;
    }

    // Create the service with main image URL
    const service = await db.service.create({
      data: {
        categoryId: data.categoryId,
        imageUrl: mainImageUrl,
        name: data.name,
        overview: data.overview,
      },
    });

    // Now upload all images using the actual service ID
    const uploadedImages: { [key: string]: string } = {};

    try {
      // Upload Section 1 image
      if (data.section1Image && imageFiles?.section1Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await imageFiles.section1Image.arrayBuffer()),
          { folder: `services/${service.id}/section1` }
        );
        uploadedImages.section1Image = uploadResult.secure_url;
      }

      // Upload Section 3 image
      if (data.section3Image && imageFiles?.section3Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await imageFiles.section3Image.arrayBuffer()),
          { folder: `services/${service.id}/section3` }
        );
        uploadedImages.section3Image = uploadResult.secure_url;
      }

      // Upload Section 4 card images
      if (data.section4Cards?.length) {
        for (let i = 0; i < data.section4Cards.length; i++) {
          const card = data.section4Cards[i];
          if (card.image && imageFiles?.[`section4Card${i}`]) {
            const uploadResult = await uploadToCloudinary(
              Buffer.from(await imageFiles[`section4Card${i}`].arrayBuffer()),
              { folder: `services/${service.id}/section4/card${i}` }
            );
            uploadedImages[`section4Card${i}`] = uploadResult.secure_url;
          }
        }
      }

      // Upload Section 5 image
      if (data.section5Image && imageFiles?.section5Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await imageFiles.section5Image.arrayBuffer()),
          { folder: `services/${service.id}/section5` }
        );
        uploadedImages.section5Image = uploadResult.secure_url;
      }

      // Now create the sections with uploaded image URLs in a transaction
      return await db.$transaction(async (prisma) => {
        // Create Section 1 if data is provided
        if (
          data.section1Title ||
          data.section1Description ||
          uploadedImages.section1Image
        ) {
          await prisma.serviceSection1.create({
            data: {
              serviceId: service.id,
              imageUrl: uploadedImages.section1Image || null,
              title: data.section1Title || null,
              description: data.section1Description || null,
            },
          });
        }

        // Create Section 2 if data is provided
        if (data.section2VideoUrl) {
          await prisma.serviceSection2.create({
            data: {
              serviceId: service.id,
              videoUrl: data.section2VideoUrl,
            },
          });
        }

        // Create Section 3 if data is provided
        if (
          data.section3Title ||
          data.section3Description ||
          uploadedImages.section3Image
        ) {
          await prisma.serviceSection3.create({
            data: {
              serviceId: service.id,
              imageUrl: uploadedImages.section3Image || null,
              title: data.section3Title || null,
              description: data.section3Description || null,
            },
          });
        }

        // Create Section 4 if data is provided
        if (data.section4Title || data.section4Cards?.length) {
          const section4 = await prisma.serviceSection4.create({
            data: {
              serviceId: service.id,
              title: data.section4Title || null,
            },
          });

          // Create cards if provided
          if (data.section4Cards?.length) {
            for (let i = 0; i < data.section4Cards.length; i++) {
              const card = data.section4Cards[i];

              await prisma.serviceSection4Card.create({
                data: {
                  section4Id: section4.id,
                  imageUrl: uploadedImages[`section4Card${i}`] || null,
                  title: card.title || null,
                  description: card.description,
                  sortOrder: i,
                },
              });
            }
          }
        }

        // Create Section 5 if data is provided
        if (
          data.section5Title ||
          data.section5PriceRanges?.length ||
          uploadedImages.section5Image
        ) {
          const section5 = await prisma.serviceSection5.create({
            data: {
              serviceId: service.id,
              imageUrl: uploadedImages.section5Image || null,
              title: data.section5Title || null,
            },
          });

          // Create price ranges if provided
          if (data.section5PriceRanges?.length) {
            for (let i = 0; i < data.section5PriceRanges.length; i++) {
              const priceRange = data.section5PriceRanges[i];

              await prisma.serviceSection5PriceRange.create({
                data: {
                  section5Id: section5.id,
                  title: priceRange.title,
                  startPrice: priceRange.startPrice || null,
                  endPrice: priceRange.endPrice || null,
                  sortOrder: i,
                },
              });
            }
          }
        }

        // Return the full service with all sections
        const createdService = await this.getServiceById(service.id);
        return createdService as ServiceWithSections;
      });
    } catch (error) {
      // If there's an error, clean up the service and any uploaded images
      try {
        // Delete the service from database
        await db.service.delete({ where: { id: service.id } });
        // Delete the entire folder from Cloudinary
        await deleteFolderFromCloudinary(`services/${service.id}`);
      } catch (cleanupError) {
        console.error("Failed to cleanup service and images:", cleanupError);
      }
      throw error;
    }
  }

  /**
   * Update an existing service
   */
  static async updateService(
    id: string,
    data: CreateServiceFormData,
    imageFiles?: { [key: string]: File }
  ): Promise<ServiceWithSections> {
    // First, upload new images outside of the transaction
    const uploadedImages: { [key: string]: string } = {};

    try {
      // Upload main service image if provided
      if (data.image && imageFiles?.image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await imageFiles.image.arrayBuffer()),
          { folder: `services/main-images` }
        );
        uploadedImages.image = uploadResult.secure_url;
      }

      // Upload Section 1 image if provided
      if (data.section1Image && imageFiles?.section1Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await imageFiles.section1Image.arrayBuffer()),
          { folder: `services/${id}/section1` }
        );
        uploadedImages.section1Image = uploadResult.secure_url;
      }

      // Upload Section 3 image if provided
      if (data.section3Image && imageFiles?.section3Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await imageFiles.section3Image.arrayBuffer()),
          { folder: `services/${id}/section3` }
        );
        uploadedImages.section3Image = uploadResult.secure_url;
      }

      // Upload Section 4 card images
      if (data.section4Cards?.length) {
        for (let i = 0; i < data.section4Cards.length; i++) {
          const card = data.section4Cards[i];
          if (card.image && imageFiles?.[`section4Card${i}`]) {
            const uploadResult = await uploadToCloudinary(
              Buffer.from(await imageFiles[`section4Card${i}`].arrayBuffer()),
              { folder: `services/${id}/section4/card${i}` }
            );
            uploadedImages[`section4Card${i}`] = uploadResult.secure_url;
          }
        }
      }

      // Upload Section 5 image if provided
      if (data.section5Image && imageFiles?.section5Image) {
        const uploadResult = await uploadToCloudinary(
          Buffer.from(await imageFiles.section5Image.arrayBuffer()),
          { folder: `services/${id}/section5` }
        );
        uploadedImages.section5Image = uploadResult.secure_url;
      }

      return await db.$transaction(async (prisma) => {
        // Update the main service
        const updateData: {
          categoryId: string;
          name: string;
          overview: string;
          imageUrl?: string;
        } = {
          categoryId: data.categoryId,
          name: data.name,
          overview: data.overview,
        };

        // Add main image URL if uploaded
        if (uploadedImages.image) {
          // Delete old main image if it exists
          const existingService = await this.getServiceById(id);
          if (existingService?.imageUrl) {
            await deleteFromCloudinaryByUrl(existingService.imageUrl);
          }
          updateData.imageUrl = uploadedImages.image;
        }

        await prisma.service.update({
          where: { id },
          data: updateData,
        });

        // Get existing service to handle image cleanup
        const existingService = await this.getServiceById(id);
        if (!existingService) {
          throw new Error("Service not found");
        }

        // Handle Section 1
        if (
          data.section1Title ||
          data.section1Description ||
          data.section1Image
        ) {
          let section1ImageUrl = existingService.section1?.imageUrl;

          // If new image uploaded, delete old one and use new URL
          if (uploadedImages.section1Image) {
            if (section1ImageUrl) {
              await deleteFromCloudinaryByUrl(section1ImageUrl);
            }
            section1ImageUrl = uploadedImages.section1Image;
          }

          await prisma.serviceSection1.upsert({
            where: { serviceId: id },
            create: {
              serviceId: id,
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
          const section1 = await prisma.serviceSection1.findUnique({
            where: { serviceId: id },
          });

          if (section1) {
            if (section1.imageUrl) {
              await deleteFromCloudinaryByUrl(section1.imageUrl);
            }
            await prisma.serviceSection1.delete({
              where: { serviceId: id },
            });
          }
        }

        // Handle Section 2
        if (data.section2VideoUrl) {
          await prisma.serviceSection2.upsert({
            where: { serviceId: id },
            create: {
              serviceId: id,
              videoUrl: data.section2VideoUrl,
            },
            update: {
              videoUrl: data.section2VideoUrl,
            },
          });
        } else {
          // Delete section2 if no data is provided
          await prisma.serviceSection2.deleteMany({
            where: { serviceId: id },
          });
        }

        // Handle Section 3
        if (
          data.section3Title ||
          data.section3Description ||
          data.section3Image
        ) {
          let section3ImageUrl = existingService.section3?.imageUrl;

          // If new image uploaded, delete old one and use new URL
          if (uploadedImages.section3Image) {
            if (section3ImageUrl) {
              await deleteFromCloudinaryByUrl(section3ImageUrl);
            }
            section3ImageUrl = uploadedImages.section3Image;
          }

          await prisma.serviceSection3.upsert({
            where: { serviceId: id },
            create: {
              serviceId: id,
              imageUrl: section3ImageUrl,
              title: data.section3Title || null,
              description: data.section3Description || null,
            },
            update: {
              imageUrl: section3ImageUrl,
              title: data.section3Title || null,
              description: data.section3Description || null,
            },
          });
        } else {
          // Delete section3 if no data is provided
          const section3 = await prisma.serviceSection3.findUnique({
            where: { serviceId: id },
          });

          if (section3) {
            if (section3.imageUrl) {
              await deleteFromCloudinaryByUrl(section3.imageUrl);
            }
            await prisma.serviceSection3.delete({
              where: { serviceId: id },
            });
          }
        }

        // Handle Section 4
        if (data.section4Title || data.section4Cards?.length) {
          // Get or create section4
          let section4 = await prisma.serviceSection4.findUnique({
            where: { serviceId: id },
            include: { cards: true },
          });

          if (!section4) {
            section4 = await prisma.serviceSection4.create({
              data: {
                serviceId: id,
                title: data.section4Title || null,
              },
              include: { cards: true },
            });
          } else {
            // Update section4
            await prisma.serviceSection4.update({
              where: { id: section4.id },
              data: {
                title: data.section4Title || null,
              },
            });
          }

          // Handle cards intelligently - preserve existing ones, update/add new ones
          const existingCards = section4.cards;
          const incomingCards = data.section4Cards || [];

          // Get IDs of cards that should be kept
          const cardsToKeep = incomingCards
            .filter((card) => card.id) // Only existing cards have IDs
            .map((card) => card.id!);

          // Delete cards that are no longer in the list
          const cardsToDelete = existingCards.filter(
            (card) => !cardsToKeep.includes(card.id)
          );
          for (const card of cardsToDelete) {
            if (card.imageUrl) {
              await deleteFromCloudinaryByUrl(card.imageUrl);
            }
            await prisma.serviceSection4Card.delete({
              where: { id: card.id },
            });
          }

          // Process each incoming card
          for (let i = 0; i < incomingCards.length; i++) {
            const card = incomingCards[i];

            if (card.id) {
              // Existing card - update it
              const existingCard = existingCards.find(
                (ec) => ec.id === card.id
              );
              let imageUrl = existingCard?.imageUrl;

              // If new image uploaded, delete old one and use new URL
              if (uploadedImages[`section4Card${i}`]) {
                if (imageUrl) {
                  await deleteFromCloudinaryByUrl(imageUrl);
                }
                imageUrl = uploadedImages[`section4Card${i}`];
              }

              await prisma.serviceSection4Card.update({
                where: { id: card.id },
                data: {
                  imageUrl: imageUrl,
                  title: card.title || null,
                  description: card.description,
                  sortOrder: i,
                },
              });
            } else {
              // New card - create it
              await prisma.serviceSection4Card.create({
                data: {
                  section4Id: section4.id,
                  imageUrl: uploadedImages[`section4Card${i}`] || null,
                  title: card.title || null,
                  description: card.description,
                  sortOrder: i,
                },
              });
            }
          }
        } else {
          // Delete section4 if no data is provided
          const section4 = await prisma.serviceSection4.findUnique({
            where: { serviceId: id },
            include: { cards: true },
          });

          if (section4) {
            // Delete card images
            for (const card of section4.cards) {
              if (card.imageUrl) {
                await deleteFromCloudinaryByUrl(card.imageUrl);
              }
            }

            await prisma.serviceSection4.delete({
              where: { serviceId: id },
            });
          }
        }

        // Handle Section 5
        if (
          data.section5Title ||
          data.section5PriceRanges?.length ||
          data.section5Image
        ) {
          let section5ImageUrl = existingService.section5?.imageUrl;

          // If new image uploaded, delete old one and use new URL
          if (uploadedImages.section5Image) {
            if (section5ImageUrl) {
              await deleteFromCloudinaryByUrl(section5ImageUrl);
            }
            section5ImageUrl = uploadedImages.section5Image;
          }

          // Get or create section5
          let section5 = await prisma.serviceSection5.findUnique({
            where: { serviceId: id },
            include: { priceRanges: true },
          });

          if (!section5) {
            section5 = await prisma.serviceSection5.create({
              data: {
                serviceId: id,
                imageUrl: section5ImageUrl,
                title: data.section5Title || null,
              },
              include: { priceRanges: true },
            });
          } else {
            // Update section5
            await prisma.serviceSection5.update({
              where: { id: section5.id },
              data: {
                imageUrl: section5ImageUrl,
                title: data.section5Title || null,
              },
            });
          }

          // Delete existing price ranges
          await prisma.serviceSection5PriceRange.deleteMany({
            where: { section5Id: section5.id },
          });

          // Create new price ranges
          if (data.section5PriceRanges?.length) {
            for (let i = 0; i < data.section5PriceRanges.length; i++) {
              const priceRange = data.section5PriceRanges[i];

              await prisma.serviceSection5PriceRange.create({
                data: {
                  section5Id: section5.id,
                  title: priceRange.title,
                  startPrice: priceRange.startPrice || null,
                  endPrice: priceRange.endPrice || null,
                  sortOrder: i,
                },
              });
            }
          }
        } else {
          // Delete section5 if no data is provided
          const section5 = await prisma.serviceSection5.findUnique({
            where: { serviceId: id },
          });

          if (section5) {
            if (section5.imageUrl) {
              await deleteFromCloudinaryByUrl(section5.imageUrl);
            }
            await prisma.serviceSection5.delete({
              where: { serviceId: id },
            });
          }
        }

        // Return the updated service with all sections
        const updatedService = await this.getServiceById(id);
        return updatedService as ServiceWithSections;
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
   * Delete a service and all associated data
   */
  static async deleteService(id: string): Promise<void> {
    await db.$transaction(async (prisma) => {
      // Get service to ensure it exists
      const service = await this.getServiceById(id);
      if (!service) {
        throw new Error("Service not found");
      }

      // Extract the actual folder ID from any existing image URL
      let cloudinaryFolderId: string | null = null;

      // Try to get folder ID from any available image URL
      const sampleImageUrl =
        service.imageUrl ||
        service.section1?.imageUrl ||
        service.section3?.imageUrl ||
        service.section4?.cards?.[0]?.imageUrl ||
        service.section5?.imageUrl;

      if (sampleImageUrl) {
        try {
          // Extract the folder ID from the URL
          // URL format: https://res.cloudinary.com/.../services/{folderId}/section1/filename.jpg
          const match = sampleImageUrl.match(/services\/([^/]+)\//);
          if (match && match[1]) {
            cloudinaryFolderId = match[1];
            console.log(
              `Extracted Cloudinary folder ID: ${cloudinaryFolderId}`
            );
          }
        } catch (extractError) {
          console.error(
            "Failed to extract folder ID from image URL:",
            extractError
          );
        }
      }

      // Delete the entire service folder from Cloudinary using the correct folder ID
      if (cloudinaryFolderId) {
        try {
          await deleteFolderFromCloudinary(`services/${cloudinaryFolderId}`);
        } catch (cloudinaryError) {
          console.error(
            `Failed to delete Cloudinary folder for service ${cloudinaryFolderId}:`,
            cloudinaryError
          );
          // Don't throw error here - we still want to delete from database
        }
      } else {
        console.warn(
          `No images found for service ${id}, skipping Cloudinary cleanup`
        );
      }

      // Delete the service (cascade will handle sections)
      await prisma.service.delete({
        where: { id },
      });
    });
  }

  /**
   * Get service count by category
   */
  static async getServiceCountByCategory(): Promise<{
    [categoryId: string]: number;
  }> {
    const services = await db.service.groupBy({
      by: ["categoryId"],
      _count: {
        id: true,
      },
    });

    return services.reduce((acc, service) => {
      acc[service.categoryId] = service._count.id;
      return acc;
    }, {} as { [categoryId: string]: number });
  }
}

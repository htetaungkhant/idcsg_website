import db from "@/lib/db/db";
import {
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

export interface ServiceFormData {
  id?: string; // For updates
  categoryId: string;
  imageUrl: string;
  name: string;
  overview: string;

  // Section 1
  section1ImageUrl?: string;
  section1Title?: string;
  section1Description?: string;

  // Section 2
  section2VideoUrl?: string;

  // Section 3
  section3ImageUrl?: string;
  section3Title?: string;
  section3Description?: string;

  // Section 4
  section4Title?: string;
  section4Cards?: {
    id?: string; // For existing cards during updates
    imageUrl?: string;
    title?: string;
    description: string;
  }[];

  // Section 5
  section5ImageUrl?: string;
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
    data: ServiceFormData
  ): Promise<ServiceWithSections> {
    // Create the service with main image URL
    const id =
      data.id ||
      (
        await db.service.create({
          data: {
            categoryId: data.categoryId,
            imageUrl: data.imageUrl,
            name: data.name,
            overview: data.overview,
          },
        })
      ).id;

    try {
      await db.$transaction(async (prisma) => {
        // Create Section 1 if data is provided
        if (
          data.section1Title ||
          data.section1Description ||
          data.section1ImageUrl
        ) {
          await prisma.serviceSection1.create({
            data: {
              serviceId: id,
              imageUrl: data.section1ImageUrl || null,
              title: data.section1Title || null,
              description: data.section1Description || null,
            },
          });
        }

        // Create Section 2 if data is provided
        if (data.section2VideoUrl) {
          await prisma.serviceSection2.create({
            data: {
              serviceId: id,
              videoUrl: data.section2VideoUrl,
            },
          });
        }

        // Create Section 3 if data is provided
        if (
          data.section3Title ||
          data.section3Description ||
          data.section3ImageUrl
        ) {
          await prisma.serviceSection3.create({
            data: {
              serviceId: id,
              imageUrl: data.section3ImageUrl || null,
              title: data.section3Title || null,
              description: data.section3Description || null,
            },
          });
        }

        // Create Section 4 if data is provided
        if (data.section4Title || data.section4Cards?.length) {
          const section4 = await prisma.serviceSection4.create({
            data: {
              serviceId: id,
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
                  imageUrl: card.imageUrl || null,
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
          data.section5ImageUrl
        ) {
          const section5 = await prisma.serviceSection5.create({
            data: {
              serviceId: id,
              imageUrl: data.section5ImageUrl || null,
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
      });

      // Return the full service with all sections
      const createdService = await this.getServiceById(id);
      return createdService as ServiceWithSections;
    } catch (error) {
      // If there's an error, clean up the service and any uploaded images
      try {
        // Delete the service from database
        await db.service.delete({ where: { id: id } });
        // Delete the entire folder from Cloudinary
        await deleteFolderFromCloudinary(`services/${id}`);
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
    data: ServiceFormData
  ): Promise<ServiceWithSections> {
    try {
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
      if (data.imageUrl) {
        // Delete old main image if it exists
        const existingService = await this.getServiceById(id);
        if (existingService?.imageUrl) {
          await deleteFromCloudinaryByUrl(existingService.imageUrl);
        }
        updateData.imageUrl = data.imageUrl;
      }

      await db.service.update({
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
        data.section1ImageUrl
      ) {
        let section1ImageUrl = existingService.section1?.imageUrl;

        // If new image uploaded, delete old one and use new URL
        if (data.section1ImageUrl) {
          if (section1ImageUrl) {
            await deleteFromCloudinaryByUrl(section1ImageUrl);
          }
          section1ImageUrl = data.section1ImageUrl;
        }

        await db.serviceSection1.upsert({
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
        const section1 = await db.serviceSection1.findUnique({
          where: { serviceId: id },
        });

        if (section1) {
          if (section1.imageUrl) {
            await deleteFromCloudinaryByUrl(section1.imageUrl);
          }
          await db.serviceSection1.delete({
            where: { serviceId: id },
          });
        }
      }

      // Handle Section 2
      if (data.section2VideoUrl) {
        await db.serviceSection2.upsert({
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
        await db.serviceSection2.deleteMany({
          where: { serviceId: id },
        });
      }

      // Handle Section 3
      if (
        data.section3Title ||
        data.section3Description ||
        data.section3ImageUrl
      ) {
        let section3ImageUrl = existingService.section3?.imageUrl;

        // If new image uploaded, delete old one and use new URL
        if (data.section3ImageUrl) {
          if (section3ImageUrl) {
            await deleteFromCloudinaryByUrl(section3ImageUrl);
          }
          section3ImageUrl = data.section3ImageUrl;
        }

        await db.serviceSection3.upsert({
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
        const section3 = await db.serviceSection3.findUnique({
          where: { serviceId: id },
        });

        if (section3) {
          if (section3.imageUrl) {
            await deleteFromCloudinaryByUrl(section3.imageUrl);
          }
          await db.serviceSection3.delete({
            where: { serviceId: id },
          });
        }
      }

      // Handle Section 4
      if (data.section4Title || data.section4Cards?.length) {
        // Get or create section4
        let section4 = await db.serviceSection4.findUnique({
          where: { serviceId: id },
          include: { cards: true },
        });

        if (!section4) {
          section4 = await db.serviceSection4.create({
            data: {
              serviceId: id,
              title: data.section4Title || null,
            },
            include: { cards: true },
          });
        } else {
          // Update section4
          await db.serviceSection4.update({
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
          await db.serviceSection4Card.delete({
            where: { id: card.id },
          });
        }

        // Process each incoming card
        for (let i = 0; i < incomingCards.length; i++) {
          const card = incomingCards[i];

          if (card.id) {
            // Existing card - update it
            const existingCard = existingCards.find((ec) => ec.id === card.id);
            let imageUrl = existingCard?.imageUrl;

            // If new image uploaded, delete old one and use new URL
            if (data.section4Cards?.[i].imageUrl) {
              if (imageUrl) {
                await deleteFromCloudinaryByUrl(imageUrl);
              }
              imageUrl = data.section4Cards[i].imageUrl;
            }

            await db.serviceSection4Card.update({
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
            await db.serviceSection4Card.create({
              data: {
                section4Id: section4.id,
                imageUrl: data.section4Cards?.[i].imageUrl || null,
                title: card.title || null,
                description: card.description,
                sortOrder: i,
              },
            });
          }
        }
      } else {
        // Delete section4 if no data is provided
        const section4 = await db.serviceSection4.findUnique({
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

          await db.serviceSection4.delete({
            where: { serviceId: id },
          });
        }
      }

      // Handle Section 5
      if (
        data.section5Title ||
        data.section5PriceRanges?.length ||
        data.section5ImageUrl
      ) {
        let section5ImageUrl = existingService.section5?.imageUrl;

        // If new image uploaded, delete old one and use new URL
        if (data.section5ImageUrl) {
          if (section5ImageUrl) {
            await deleteFromCloudinaryByUrl(section5ImageUrl);
          }
          section5ImageUrl = data.section5ImageUrl;
        }

        // Get or create section5
        let section5 = await db.serviceSection5.findUnique({
          where: { serviceId: id },
          include: { priceRanges: true },
        });

        if (!section5) {
          section5 = await db.serviceSection5.create({
            data: {
              serviceId: id,
              imageUrl: section5ImageUrl,
              title: data.section5Title || null,
            },
            include: { priceRanges: true },
          });
        } else {
          // Update section5
          await db.serviceSection5.update({
            where: { id: section5.id },
            data: {
              imageUrl: section5ImageUrl,
              title: data.section5Title || null,
            },
          });
        }

        // Delete existing price ranges
        await db.serviceSection5PriceRange.deleteMany({
          where: { section5Id: section5.id },
        });

        // Create new price ranges
        if (data.section5PriceRanges?.length) {
          for (let i = 0; i < data.section5PriceRanges.length; i++) {
            const priceRange = data.section5PriceRanges[i];

            await db.serviceSection5PriceRange.create({
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
        const section5 = await db.serviceSection5.findUnique({
          where: { serviceId: id },
        });

        if (section5) {
          if (section5.imageUrl) {
            await deleteFromCloudinaryByUrl(section5.imageUrl);
          }
          await db.serviceSection5.delete({
            where: { serviceId: id },
          });
        }
      }

      // Return the updated service with all sections
      const updatedService = await this.getServiceById(id);
      return updatedService as ServiceWithSections;
    } catch (error) {
      // If there's an error, clean up any newly uploaded images
      try {
        await deleteFromCloudinaryByUrl(data.imageUrl);
        if (data.section1ImageUrl) {
          await deleteFromCloudinaryByUrl(data.section1ImageUrl);
        }
        if (data.section3ImageUrl) {
          await deleteFromCloudinaryByUrl(data.section3ImageUrl);
        }
        if (data.section5ImageUrl) {
          await deleteFromCloudinaryByUrl(data.section5ImageUrl);
        }
        if (data.section4Cards?.length) {
          for (const card of data.section4Cards) {
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
   * Delete a service and all associated data
   */
  static async deleteService(id: string): Promise<void> {
    try {
      // Get service to ensure it exists
      const service = await this.getServiceById(id);
      if (!service) {
        throw new Error("Service not found");
      }

      // Extract the actual folder ID from any existing image URL
      let cloudinaryServiceFolderId: string | null = null;

      // Try to get folder ID from any available image URL
      const sectionsImageUrl =
        service.section1?.imageUrl ||
        service.section3?.imageUrl ||
        service.section4?.cards?.[0]?.imageUrl ||
        service.section5?.imageUrl;

      if (sectionsImageUrl) {
        try {
          // Extract the folder ID from the URL
          // URL format: https://res.cloudinary.com/.../services/{folderId}/section1/filename.jpg
          const match = sectionsImageUrl.match(/services\/([^/]+)\//);
          if (match && match[1]) {
            cloudinaryServiceFolderId = match[1];
            console.log(
              `Extracted Cloudinary folder ID: ${cloudinaryServiceFolderId}`
            );
          }
        } catch (extractError) {
          console.error(
            "Failed to extract folder ID from image URL:",
            extractError
          );
        }
      }

      // Delete the main service image if it exists
      if (service.imageUrl) {
        try {
          await deleteFromCloudinaryByUrl(service.imageUrl);
        } catch (imageError) {
          console.error(
            `Failed to delete main image for service ${id}:`,
            imageError
          );
        }
        // Don't throw error here - we still want to delete from database
      } else {
        console.warn(
          `No main image found for service ${id}, skipping Cloudinary cleanup`
        );
      }

      // Delete the entire service folder from Cloudinary using the correct folder ID
      if (cloudinaryServiceFolderId) {
        try {
          await deleteFolderFromCloudinary(
            `services/${cloudinaryServiceFolderId}`
          );
        } catch (cloudinaryError) {
          console.error(
            `Failed to delete Cloudinary folder for service ${cloudinaryServiceFolderId}:`,
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
      await db.$transaction(async (prisma) => {
        await prisma.service.delete({
          where: { id },
        });
      });
    } catch (error) {
      console.error("Failed to delete service:", error);
      throw error;
    }
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

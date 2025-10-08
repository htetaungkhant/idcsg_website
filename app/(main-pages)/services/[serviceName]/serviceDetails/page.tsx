import React from "react";
import Image from "next/image";
import { ServiceService } from "@/lib/services/service-service";
import { PrimaryBtn2 } from "@/components/CustomButtons";
import { formatPrice } from "@/lib/utils";
import ServiceDetailsCardsSection from "@/app/(main-pages)/services/(components)/ServiceDetailsCardsSection";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

interface ServiceDetailsProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function ServiceDetails({
  searchParams,
}: ServiceDetailsProps) {
  const { id } = await searchParams;
  if (!id) {
    return <div>Service not found</div>;
  }

  const service = await ServiceService.getServiceById(id as string);
  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="mx-auto w-[90%] pb-10 flex flex-col gap-y-10">
      <h1 className="text-6xl text-[#233259] font-semibold">
        {service.category.title}
      </h1>
      {/* Figma => shadow-[4px_4px_12px_0px_rgba(0,0,0,0.25)] */}
      <div className="p-4 lg:px-6 lg:py-8 flex flex-col gap-y-10 rounded-2xl bg-radial from-[#FFFFFF] to-[#D2F7FF] shadow-lg">
        {service.section1 && (
          <section className="flex gap-2 md:gap-4 lg:gap-8 text-[#233259]">
            {service.section1?.imageUrl && (
              <div>
                <Image
                  src={service.section1.imageUrl}
                  alt={service.section1.title || "Section Image"}
                  width={400}
                  height={400}
                  className="w-48 lg:w-68 h-full object-cover rounded-2xl"
                  priority
                />
              </div>
            )}
            <div className="flex-1 flex flex-col gap-4">
              {service.section1?.title && (
                <h1 className="text-3xl lg:text-5xl">
                  {service.section1.title}
                </h1>
              )}
              <div className="h-full flex flex-col gap-4 justify-between items-end">
                {service.section1?.description && (
                  <p
                    className="w-full font-(family-name:--font-ubuntu) whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: service.section1?.description,
                    }}
                  />
                )}
                <PrimaryBtn2 className="bg-transparent">
                  Chat with us
                </PrimaryBtn2>
              </div>
            </div>
          </section>
        )}
        {service.section2 && service.section2.videoUrl && (
          <div className="relative w-full pb-[40%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              src={service.section2.videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        {service.section3 && (
          <section className="flex gap-2 md:gap-4 lg:gap-8 text-[#233259]">
            <div className="flex-1 flex flex-col gap-4">
              {service.section3?.title && (
                <h1 className="text-3xl lg:text-5xl">
                  {service.section3.title}
                </h1>
              )}
              {service.section3?.description && (
                <p
                  className="font-(family-name:--font-ubuntu) whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: service.section3?.description,
                  }}
                />
              )}
            </div>
            {service.section3?.imageUrl && (
              <div>
                <Image
                  src={service.section3.imageUrl}
                  alt={service.section3.title || "Section Image"}
                  width={400}
                  height={400}
                  className="w-48 lg:w-68 h-full object-cover rounded-2xl"
                  priority
                />
              </div>
            )}
          </section>
        )}
        {service.section4 && (
          <section className="flex flex-col gap-4">
            {service.section4?.title && (
              <h1 className="text-3xl lg:text-5xl text-[#233259]">
                {service.section4.title}
              </h1>
            )}
            {service.section4?.cards && service.section4?.cards.length > 0 && (
              <ServiceDetailsCardsSection cards={service.section4.cards} />
            )}
          </section>
        )}
        {service.section5 && (
          <section className="flex flex-col gap-4">
            {service.section5?.title && (
              <h1 className="text-3xl lg:text-5xl text-[#233259]">
                {service.section5.title}
              </h1>
            )}
            {service.section5?.imageUrl && service.section5?.priceRanges && (
              <div className="grid grid-cols-[25%_1fr] gap-4">
                {service.section5.imageUrl && (
                  <div>
                    <Image
                      src={service.section5.imageUrl}
                      alt={service.section5.title || "Section Image"}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-2xl"
                      priority
                    />
                  </div>
                )}
                {service.section5.priceRanges && (
                  <div className="flex flex-col items-end gap-y-4 bg-white p-4 rounded-2xl">
                    {service.section5.priceRanges.map((priceRange, index) => (
                      <div
                        key={index}
                        className="w-full flex justify-between lg:text-lg"
                      >
                        <span className="font-bold">{priceRange.title}</span>
                        <span className="font-(family-name:--font-ubuntu) font-medium">
                          {!priceRange.endPrice && "Starts from "}
                          {priceRange.startPrice && priceRange.endPrice
                            ? `${formatPrice(
                                priceRange.startPrice
                              )} - ${formatPrice(priceRange.endPrice)}`
                            : priceRange.startPrice
                            ? `${formatPrice(priceRange.startPrice)}`
                            : priceRange.endPrice
                            ? `${formatPrice(priceRange.endPrice)}`
                            : null}
                        </span>
                      </div>
                    ))}
                    <span className="w-full font-light">
                      (Prices are customized based on your unique needs and are
                      inclusive of GST. The dentist will advise you of your
                      treatment costs following your consultation.)
                    </span>
                    <PrimaryBtn2>Pay Now</PrimaryBtn2>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

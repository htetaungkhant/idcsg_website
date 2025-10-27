import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PrimaryBtn2 } from "@/components/CustomButtons";
import { ServiceService } from "@/lib/services/service-service";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

interface ServiceProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Service({ searchParams }: ServiceProps) {
  const { id } = await searchParams;
  if (!id) {
    return <div>Service not found</div>;
  }

  const service = await ServiceService.getServiceById(id as string);
  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">
        {service.category.title}
      </h1>
      <div className="mt-10 flex relative">
        <div
          className="absolute w-[90%] h-[85%] inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(to right, ${
              service.overviewBgStartingColor || "#CA4E48"
            }, ${service.overviewBgEndingColor || "#642724"})`,
          }}
        ></div>

        <div className="relative max-w-64 pl-5 py-5 pr-3 flex flex-col gap-y-4">
          <Link
            href={`/services/${encodeURIComponent(
              service.name
            )}/serviceDetails?id=${service.id}`}
            className="px-2 pt-3 pb-1.5 flex flex-col gap-3 items-end border border-[#650F0F] rounded-tl-2xl rounded-tr-lg rounded-bl-lg rounded-br-3xl hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: service.detailsLinkBgColor || "#68211E",
            }}
          >
            <h2 className="text-white text-3xl">
              Click Here to view more details
            </h2>
            <div className="max-w-[40px] max-h-[40px] bg-white border border-[#ABABAB] rounded-full p-2.5 transition-all duration-300 -rotate-90 text-8xl">
              <svg
                className="w-full h-full text-[#C64C46] transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </div>
          </Link>
          <div className="z-10 w-100 xl:w-130 ml-12 flex flex-col gap-y-4 text-[#233259] bg-white px-5 py-3 rounded-3xl shadow-lg">
            <h3 className="text-center text-2xl xl:text-4xl font-bold">
              Overview
            </h3>
            <p
              className="text-base xl:text-xl font-(family-name:--font-roboto) whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: service.overview }}
            />
            <div className="flex items-center justify-center gap-5 mt-2">
              <PrimaryBtn2>Book</PrimaryBtn2>
              {/* <PrimaryBtn2>Pre-Pay</PrimaryBtn2> */}
            </div>
          </div>
        </div>
        <div className="relative flex-1 mt-16">
          <h1 className="absolute top-2 right-4 text-right text-white text-6xl w-72">
            {service.name}
          </h1>
          <Image
            src={service.imageUrl}
            alt={service.name}
            width={500}
            height={500}
            className="w-full rounded-3xl shadow-lg object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

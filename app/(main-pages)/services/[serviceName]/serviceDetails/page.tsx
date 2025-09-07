import React from "react";
import Image from "next/image";

interface ServiceDetailsProps {
  params: Promise<{
    serviceName: string;
  }>;
}
export default async function ServiceDetails({ params }: ServiceDetailsProps) {
  const { serviceName } = await params;
  console.log("Service Name:", decodeURIComponent(serviceName));

  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">
        General Dentistry
      </h1>
      <Image
        src="/dummy-data/service_details_page.png"
        alt="service details"
        width={500}
        height={500}
        className="mt-10 w-full rounded-3xl shadow-lg object-cover"
      />
    </div>
  );
}

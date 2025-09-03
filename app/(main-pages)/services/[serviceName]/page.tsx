import React from "react";

interface ServiceDetailsProps {
  params: {
    serviceName: string;
  };
}

export default async function ServiceDetails({ params }: ServiceDetailsProps) {
  const { serviceName } = await params;

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-10">
        Service Details for {decodeURIComponent(serviceName)}
      </h1>
    </div>
  );
}

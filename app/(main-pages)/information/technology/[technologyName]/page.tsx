import React from "react";
import { TechnologyService } from "@/lib/services/technology-service";

interface TechnologyDetailsProps {
  params: Promise<{
    technologyName: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function TechnologyDetails({
  // params,
  searchParams,
}: TechnologyDetailsProps) {
  // const { technologyName } = await params;
  const { id } = await searchParams;
  if (!id) {
    return <div>Technology not found</div>;
  }

  const technology = await TechnologyService.getTechnologyById(id as string);
  if (!technology) {
    return <div>Technology not found</div>;
  }

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-10">
        {technology.title}
      </h1>
    </div>
  );
}

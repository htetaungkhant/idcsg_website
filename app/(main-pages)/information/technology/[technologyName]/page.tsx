import React from "react";
import Image from "next/image";
import { TechnologyService } from "@/lib/services/technology-service";
import { CardCollectionStyle3 } from "@/components/CardCollection";
import { TechnologyCardGrid } from "@/components/TechnologyCardGrid";

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
    <div className="mx-auto w-[90%] pb-10">
      <CardCollectionStyle3
        title={technology.descriptionTitle}
        imageTitle={technology.title}
        image={technology.imageUrl}
      >
        {technology.description && (
          <p
            className="font-(family-name:--font-ubuntu) whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: technology.description }}
          />
        )}
      </CardCollectionStyle3>
      {technology.section1 && (
        <div className="text-[#233259] bg-white p-4 rounded-2xl flex gap-2 lg:gap-4 mt-12">
          <div className="flex-1 flex flex-col gap-4">
            {technology.section1?.title && (
              <h1 className="text-3xl lg:text-5xl xl:text-6xl">
                {technology.section1.title}
              </h1>
            )}
            {technology.section1?.description && (
              <p
                className="xl:text-lg font-(family-name:--font-ubuntu) whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: technology.section1.description,
                }}
              />
            )}
          </div>
          {technology.section1?.imageUrl && (
            <div>
              <Image
                src={technology.section1.imageUrl}
                alt="Information"
                width={400}
                height={400}
                className="w-48 lg:w-80 lg:h-105 xl:w-100 h-full object-cover object-left rounded-2xl"
              />
            </div>
          )}
        </div>
      )}
      {technology.cards && technology.cards.length > 0 && (
        <TechnologyCardGrid cards={technology.cards} />
      )}
    </div>
  );
}

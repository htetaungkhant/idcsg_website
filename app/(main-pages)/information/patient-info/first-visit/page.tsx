import React from "react";
import { CardCollectionStyle3 } from "@/components/CardCollection";
import { FirstVisitService } from "@/lib/services/first-visit-service";
import { PrimaryBtn2 } from "@/components/CustomButtons";
import Image from "next/image";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export default async function FirstVisit() {
  const firstVisit = await FirstVisitService.getFirstVisit();

  if (!firstVisit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">
          Patient information is being prepared. Please check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[90%] pb-10">
      {firstVisit.sections &&
        firstVisit.sections.map((section, index) => (
          <CardCollectionStyle3
            key={section.id || index}
            title={section.descriptionTitle}
            imageTitle={section.title || "First Visit"}
            image={section.imageUrl || "/3.png"}
          >
            <p
              className="font-(family-name:--font-ubuntu) whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: section.description }}
            />
            <div className="flex items-center justify-end gap-5 mt-2">
              <PrimaryBtn2>Patient Forms</PrimaryBtn2>
              <PrimaryBtn2>Contact Us</PrimaryBtn2>
            </div>
          </CardCollectionStyle3>
        ))}
      {firstVisit.videoSection && firstVisit.videoSection.videoUrl && (
        <div className="relative w-full mt-12 pb-[45%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-2xl"
            src={firstVisit.videoSection.videoUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {firstVisit.informationSection && (
        <div className="text-[#233259] bg-white p-4 rounded-2xl flex gap-2 lg:gap-4 mt-12">
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-3xl lg:text-5xl">
              {firstVisit.informationSection.descriptionTitle}
            </h1>
            <p
              className="font-(family-name:--font-ubuntu) whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: firstVisit.informationSection.description,
              }}
            />
          </div>
          <div>
            {firstVisit.informationSection.imageUrl && (
              <Image
                src={firstVisit.informationSection.imageUrl}
                alt="Information"
                width={400}
                height={400}
                className="w-48 lg:w-68 h-full object-cover rounded-2xl"
                priority
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

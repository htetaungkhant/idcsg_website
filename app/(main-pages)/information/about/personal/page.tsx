import React from "react";

import {
  CardCollectionStyle1,
  CardCollectionStyle2,
} from "@/components/CardCollection";
import { PersonalService } from "@/lib/services/personal-service";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60; // instant updates (0 seconds delay), Dynamic rendering on every request

export default async function Personal() {
  const personal = await PersonalService.getPersonal();

  if (!personal || !personal.sections || personal.sections.length <= 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600">
          No personal information available.
        </p>
      </div>
    );
  }

  // Render the precise information using CardCollection components
  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">Personal</h1>

      <div className="flex flex-col mt-20">
        {personal.sections.map((section, index) =>
          section.cardStyle === "CARDSTYLE1" ||
          section.cardStyle === "CARDSTYLE3" ? (
            <CardCollectionStyle1
              key={index}
              image={section.imageUrl || "/2.png"}
              imageTitle={section.title || ""}
              title={section.descriptionTitle}
              bgCardColor={
                section.cardStyle === "CARDSTYLE3"
                  ? "bg-gradient-to-b from-[#B2966D] to-[#967253]"
                  : ""
              }
              className={index > 0 ? "mt-40" : ""}
            >
              <p className="font-(family-name:--font-old-standard-tt) whitespace-pre-wrap">
                {section.description}
              </p>
            </CardCollectionStyle1>
          ) : section.cardStyle === "CARDSTYLE2" ? (
            <CardCollectionStyle2
              key={index}
              title={section.descriptionTitle}
              image={section.imageUrl || "/2.png"}
              imageTitle={section.title || ""}
              className={index > 0 ? "mt-20" : ""}
            >
              <p className="font-(family-name:--font-old-standard-tt) whitespace-pre-wrap">
                {section.description}
              </p>
            </CardCollectionStyle2>
          ) : null
        )}
      </div>
    </div>
  );
}

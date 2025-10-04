import React from "react";
import { TechnologyService } from "@/lib/services/technology-service";
import {
  CardCollectionStyle4,
  CardCollectionStyle5,
} from "@/components/CardCollection";

export default async function DentalTechnology() {
  const technologies = await TechnologyService.getTechnologies();

  if (!technologies || technologies.length <= 0) {
    return <div className="mx-auto w-[90%]">No technologies available</div>;
  }

  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl xl:text-7xl text-[#233259] font-semibold">
        Dental Technology
      </h1>
      {technologies.map((tech, index) =>
        tech.cardStyle === "CARDSTYLE1" ? (
          <CardCollectionStyle4
            key={tech.id}
            imageUrl={tech.imageUrl}
            imageTitle={tech.title}
            overviewTitle={tech.title}
            overviewDescription={tech.overview}
            detailLink={`/information/technology/${encodeURIComponent(
              tech.title.toLowerCase().replace(/ /g, "-")
            )}?id=${tech.id}`}
            className={index > 0 ? "mt-20" : ""}
          />
        ) : tech.cardStyle === "CARDSTYLE2" ? (
          <CardCollectionStyle5
            key={tech.id}
            imageUrl={tech.imageUrl}
            imageTitle={tech.title}
            overviewTitle={tech.title}
            overviewDescription={tech.overview}
            detailLink={`/information/technology/${encodeURIComponent(
              tech.title.toLowerCase().replace(/ /g, "-")
            )}?id=${tech.id}`}
            className={index > 0 ? "mt-20" : ""}
          />
        ) : null
      )}
    </div>
  );
}

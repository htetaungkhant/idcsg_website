"use client";

import React, { useEffect, useState } from "react";
import { CustomCard1 } from "@/components/CustomCard";
import { DentalTechnologyCard } from "@/app/generated/prisma";

interface TechnologyCardGridProps {
  cards: DentalTechnologyCard[];
}

export const TechnologyCardGrid = ({ cards }: TechnologyCardGridProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncHeights = () => {
      const titles = document.querySelectorAll("[data-tech-card-title]");
      let maxHeight = 0;

      titles.forEach((el) => {
        (el as HTMLElement).style.height = "auto";
        maxHeight = Math.max(maxHeight, el.clientHeight);
      });

      titles.forEach((el) => {
        (el as HTMLElement).style.height = `${maxHeight}px`;
      });

      setIsReady(true);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(syncHeights, 10);

    window.addEventListener("resize", syncHeights);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", syncHeights);
    };
  }, [cards]);

  return (
    <div
      className={`mt-10 w-full grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-200 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
    >
      {cards.map((card) => (
        <CustomCard1
          key={card.id}
          title={card.title}
          description={card.description}
          bgImageUrl={card.imageUrl}
          size="lg"
          className="w-full h-full"
          titleDataAttr="data-tech-card-title"
        />
      ))}
    </div>
  );
};

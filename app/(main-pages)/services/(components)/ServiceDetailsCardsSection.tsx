"use client";

import React, { useState, useEffect } from "react";
import { ServiceSection4Card } from "@/app/generated/prisma";
import { cn } from "@/lib/utils";
import { Section4Card } from "@/app/(main-pages)/services/(components)/Section4Card";

interface ServiceDetailsCardsSectionProps {
  cards: ServiceSection4Card[];
  className?: string;
}
const ServiceDetailsCardsSection: React.FC<ServiceDetailsCardsSectionProps> = ({
  className,
  cards,
}) => {
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
    // reference from TeamList.tsx and TechnologyCardGrid.tsx components
    <div
      className={cn(
        "w-full flex gap-3 xl:gap-6 transition-opacity duration-200 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        isReady ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {cards.map((card) => (
        <Section4Card
          key={card.id}
          title={card.title}
          description={card.description}
          bgImageUrl={card.imageUrl}
          className="w-full"
          titleDataAttr="data-tech-card-title"
        />
      ))}
    </div>
  );
};

export default ServiceDetailsCardsSection;

"use client";
import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { Doctor } from "@/types/global";
import { PrimaryBtn1 } from "@/components/CustomButtons";

type Category = "doctors" | "consultant" | "allied";
interface CategoriesProps {
  onSelectCategory?: (category: Category) => void;
  className?: string;
}
const Categories: React.FC<CategoriesProps> = ({
  className,
  onSelectCategory,
}) => {
  const [activeCategory, setActiveCategory] =
    React.useState<Category>("doctors");

  const handleCategorySelect = (category: Category) => {
    setActiveCategory(category);
    onSelectCategory?.(category);
  };

  return (
    <div
      className={cn(
        "mx-auto w-9/10 p-3 rounded-3xl bg-[#BBC1CF] font-semibold flex justify-between gap-4 xl:gap-8",
        className
      )}
    >
      <button
        className={cn(
          "uppercase flex-1 p-1.5 rounded-2xl cursor-pointer",
          activeCategory === "doctors" ? "bg-[#233259] text-white" : "bg-white"
        )}
        onClick={() => handleCategorySelect("doctors")}
      >
        Doctors
      </button>
      <button
        className={cn(
          "uppercase flex-1 p-1.5 rounded-2xl cursor-pointer",
          activeCategory === "consultant"
            ? "bg-[#233259] text-white"
            : "bg-white"
        )}
        onClick={() => handleCategorySelect("consultant")}
      >
        Consultant Specialists
      </button>
      <button
        className={cn(
          "uppercase flex-1 p-1.5 rounded-2xl cursor-pointer",
          activeCategory === "allied" ? "bg-[#233259] text-white" : "bg-white"
        )}
        onClick={() => handleCategorySelect("allied")}
      >
        Allied Health & Support Staff
      </button>
    </div>
  );
};

interface TeamListProps {
  doctors: Doctor[];
}

export default function TeamList({ doctors }: TeamListProps) {
  const mobileScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleLeftArrowClick = () => {
    if (mobileScrollContainerRef.current) {
      const cardWidth = (
        mobileScrollContainerRef.current.querySelector(
          ":first-child"
        ) as HTMLElement | null
      )?.offsetWidth;
      if (cardWidth) {
        mobileScrollContainerRef.current.scrollTo({
          left: mobileScrollContainerRef.current.scrollLeft - cardWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const handleRightArrowClick = () => {
    if (mobileScrollContainerRef.current) {
      const cardWidth = (
        mobileScrollContainerRef.current.querySelector(
          ":first-child"
        ) as HTMLElement | null
      )?.offsetWidth;
      if (cardWidth) {
        mobileScrollContainerRef.current.scrollTo({
          left: mobileScrollContainerRef.current.scrollLeft + cardWidth,
          behavior: "smooth",
        });
      }
    }
  };
  return (
    <div className="flex flex-col gap-8">
      <Categories />
      <div
        ref={mobileScrollContainerRef}
        className="flex overflow-x-hidden select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {doctors?.length >= 5 &&
          doctors.map((doctor, index) => (
            <div
              key={`${doctor.id}-${index}`}
              className="group flex-shrink-0 max-lg:min-w-[300px] w-full lg:w-1/5 h-100 lg:h-120 bg-cover bg-center bg-no-repeat flex overflow-hidden"
              style={{ backgroundImage: `url(${doctor.image.image})` }}
            >
              {/* overlay */}
              {/* <div className="absolute w-[200%] inset-0 bg-black opacity-60"></div> */}

              <div className="min-w-[100%] h-full bg-black opacity-60 group-hover:-translate-x-full transition-all duration-500 ease-in-out"></div>
              <div className="min-w-[100%] h-full px-2.5 py-5 flex flex-col items-end justify-end group-hover:-translate-x-full transition-all duration-500 ease-in-out">
                <PrimaryBtn1>View Details</PrimaryBtn1>
              </div>
            </div>
          ))}
      </div>

      {/* Mobile Navigation Arrows */}
      <div className={cn("relative flex justify-center mb-8")}>
        <button
          onClick={handleLeftArrowClick}
          className="px-4 py-2 bg-white cursor-pointer rounded-l-2xl hover:shadow-xl transition-all duration-500 ease-in-out"
        >
          <FaArrowLeft className="text-[#545454]" />
        </button>
        <button
          onClick={handleRightArrowClick}
          className="px-4 py-2 bg-white cursor-pointer rounded-r-2xl hover:shadow-xl transition-all duration-500 ease-in-out"
        >
          <FaArrowRight className="text-[#545454]" />
        </button>
      </div>
    </div>
  );
}

"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

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
  const [activeCategory, setActiveCategory] = useState<Category>("doctors");

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

interface DoctorCardProps {
  doctor: Doctor;
  overlay?: boolean;
  onClose?: () => void;
  className?: string;
}
const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  overlay = false,
  onClose,
  className,
}) => {
  // disable document scroll
  // React.useEffect(() => {
  //   document.body.style.overflow = "hidden";

  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, []);

  return (
    <div className="fixed z-1000 inset-0">
      {/* overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black invisible opacity-30",
          overlay && "visible"
        )}
      />

      <div
        className={cn(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[300px] max-w-4/5 max-h-[80vh] p-2.5 lg:p-4 text-[#233259] bg-white rounded-2xl border border-[#233259] shadow-lg flex gap-12 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          className
        )}
      >
        <IoClose
          className="absolute top-2 right-2 w-6 h-6 cursor-pointer"
          onClick={onClose}
        />
        <Image
          src={doctor.image.image}
          alt={doctor.name}
          width={300}
          height={450}
          className="rounded-2xl"
        />
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-3xl font-semibold">{doctor.name}</h3>
            <p className="text-lg">{doctor.degree}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <h4 className="font-(family-name:--font-poppins) font-semibold">
              About
            </h4>
            <p className="font-(family-name:--font-old-standard-tt)">
              {doctor.about}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TeamListProps {
  doctors: Doctor[];
  className?: string;
}
export default function TeamList({ doctors, className }: TeamListProps) {
  const mobileScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

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
    <div className={cn("flex flex-col gap-8", className)}>
      <Categories />
      <div
        ref={mobileScrollContainerRef}
        className="flex overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
                <PrimaryBtn1 onClick={() => setSelectedDoctor(doctor)}>
                  View Details
                </PrimaryBtn1>
              </div>
            </div>
          ))}
      </div>
      {selectedDoctor && (
        <DoctorCard
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

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

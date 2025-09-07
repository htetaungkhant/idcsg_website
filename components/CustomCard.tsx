import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface CustomCard1Props {
  icon: string | React.ReactNode;
  title: string;
  description: string;
  className?: string;
}
export const CustomCard1 = ({
  className,
  icon,
  title,
  description,
}: CustomCard1Props) => {
  return (
    <div
      className={cn(
        "w-60 px-4 py-4 flex flex-col gap-y-3 bg-cover bg-center bg-no-repeat text-white rounded-2xl shadow-lg font-(family-name:--font-ubuntu) relative",
        className
      )}
      style={{ backgroundImage: "url('/4.png')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black opacity-70 rounded-2xl" />

      {typeof icon === "string" ? (
        <Image
          src={icon}
          width={100}
          height={100}
          alt={title}
          className="w-10 h-auto object-contain relative"
        />
      ) : (
        icon
      )}
      <h2 className="flex-1 text-2xl font-bold relative w-[80%]">{title}</h2>
      <p className="text-sm relative">{description}</p>
    </div>
  );
};

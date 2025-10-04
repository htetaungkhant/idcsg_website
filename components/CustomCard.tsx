import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface CustomCard1Props {
  icon?: string | React.ReactNode;
  title?: string | null;
  description: string | null;
  bgImageUrl?: string | null;
  size?: "sm" | "lg";
  className?: string;
  titleDataAttr?: string;
}
export const CustomCard1 = ({
  className,
  icon,
  title,
  bgImageUrl,
  size = "sm",
  description,
  titleDataAttr,
}: CustomCard1Props) => {
  return (
    <div
      className={cn(
        "w-60 px-4 py-4 flex flex-col gap-4 bg-cover bg-center bg-no-repeat text-white font-(family-name:--font-ubuntu) rounded-2xl overflow-hidden relative",
        className
      )}
      style={{
        backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : "url('/4.png')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-[#000000B8]" />

      <div className="relative">
        {typeof icon === "string" ? (
          <Image
            src={icon}
            width={100}
            height={100}
            alt={title || "icon"}
            className="w-10 h-auto object-contain"
          />
        ) : (
          icon
        )}
      </div>
      {title && (
        <h2
          {...(titleDataAttr && { [titleDataAttr]: true })}
          className={cn(
            "font-bold relative",
            size === "sm" && "flex-1 text-2xl w-[80%]",
            size === "lg" && "text-3xl lg:text-4xl xl:text-[40px]"
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={cn(
            "relative whitespace-pre-wrap",
            size === "sm" && "text-sm",
            size === "lg" && "xl:text-lg"
          )}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};

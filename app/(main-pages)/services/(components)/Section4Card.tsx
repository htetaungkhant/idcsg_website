import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface Section4CardProps {
  icon?: string | React.ReactNode;
  title?: string | null;
  description: string | null;
  bgImageUrl?: string | null;
  className?: string;
  titleDataAttr?: string;
}
export const Section4Card = ({
  icon,
  title,
  bgImageUrl,
  description,
  titleDataAttr,
  className,
}: Section4CardProps) => {
  return (
    <div
      className={cn(
        "w-full px-4 py-4 flex flex-col gap-2 lg:gap-4 bg-cover bg-center bg-no-repeat text-white font-(family-name:--font-roboto) rounded-2xl overflow-hidden relative",
        className
      )}
      style={{
        backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : "url('/4.png')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-[#000000B8]" />

      {icon && (
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
      )}
      {title && (
        <h2
          {...(titleDataAttr && { [titleDataAttr]: true })}
          className={"font-bold relative text-xl lg:text-2xl"}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={"relative text-xs whitespace-pre-wrap"}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};

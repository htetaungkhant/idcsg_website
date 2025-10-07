import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  icon,
  title,
  bgImageUrl,
  size = "sm",
  description,
  titleDataAttr,
  className,
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

interface CustomCard2Props {
  icon?: string;
  title?: string | null;
  description: string | null;
  contentImageUrl?: string | null;
  bgImageUrl?: string | null;
  className?: string;
}
export const CustomCard2 = ({
  icon,
  title,
  description,
  contentImageUrl,
  bgImageUrl,
  className,
}: CustomCard2Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "cursor-pointer bg-cover bg-center bg-no-repeat w-full h-80 lg:h-100 flex flex-col justify-center items-center gap-y-6 text-white font-(family-name:--font-ubuntu) rounded-2xl overflow-hidden relative",
            className
          )}
          style={{
            backgroundImage: bgImageUrl
              ? `url(${bgImageUrl})`
              : "url('/4.png')",
          }}
        >
          <div className="absolute inset-0 bg-[#000000B8]" />
          {icon && (
            <Image
              src={icon}
              width={100}
              height={100}
              alt={title || "icon"}
              className="w-24 lg:w-32 h-auto object-contain relative"
            />
          )}
          {title && (
            <h2 className="font-bold text-2xl lg:text-3xl xl:text-4xl relative px-10 lg:px-20 text-center line-clamp-3">
              {title}
            </h2>
          )}
        </div>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="z-100 gap-0 p-0 sm:max-w-[90vw] w-[90%] lg:max-w-400 text-[#233259] bg-radial from-[#FFFFFF] to-[#D2F7FF] outline-none focus-visible:ring-0"
      >
        <DialogTitle />
        <DialogClose asChild>
          <Image
            src="/cross-icon.png"
            alt="Close"
            width={24}
            height={24}
            className="absolute top-2 right-2 cursor-pointer z-10"
          />
        </DialogClose>
        <div className="px-4 py-4 lg:px-6 lg:py-6 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {title && (
            <h1 className="text-3xl lg:text-4xl xl:text-6xl font-bold lg:w-[50%] mx-auto text-center font-(family-name:--font-oswald)">
              {title}
            </h1>
          )}
          <div className="mt-4 lg:mt-12">
            {contentImageUrl && (
              <div className="pl-5 pb-2 float-right">
                <Image
                  src={contentImageUrl}
                  alt="content image"
                  width={500}
                  height={300}
                  className="w-80 h-80 object-cover rounded-lg"
                />
              </div>
            )}
            {description && (
              <p
                className="whitespace-pre-wrap text-sm lg:text-base font-(family-name:--font-ubuntu)"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import React from "react";
import Image from "next/image";
import { FaWhatsapp, FaFax } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import NavLinks from "./NavLinks";

interface HeaderProps {
  color?: "transparent" | "white";
  className?: string;
}
export default function Header({
  className,
  color = "transparent",
}: HeaderProps) {
  return (
    <section
      className={cn(
        "z-100 fixed w-11/12 top-8 left-1/2 transform -translate-x-1/2 px-6 text-white bg-gradient-to-br from-[#595e6a99] to-[#1018284e] backdrop-blur-xl border border-white/10 shadow-lg rounded-4xl flex items-center justify-between gap-3 xl:gap-5",
        color === "white" && "bg-white text-[#404040] shadow-sm",
        className
      )}
    >
      <Image
        src="/logo_with_text.svg"
        alt="Logo"
        width={100}
        height={100}
        className="h-10 xl:h-14 w-auto"
      />

      <div>
        <ul className="flex gap-2.5 xl:gap-5 items-center list-none font-(family-name:--font-ubuntu-condensed) text-[10px] xl:text-xs border-b border-[#E6E6E6] py-2.5">
          <li className="flex gap-1 xl:gap-1.5 items-center whitespace-nowrap">
            <FaWhatsapp />
            <span>+65-96870775</span>
          </li>
          <li className="flex gap-1 xl:gap-1.5 items-center whitespace-nowrap">
            <FaFax />
            <span>+65-96870775</span>
          </li>
          <li className="flex gap-1 xl:gap-1.5 items-center">
            <MdMailOutline />
            <span>admin@idcsg.com</span>
          </li>
          <li className="flex gap-1 xl:gap-1.5 items-center">
            <FaLocationDot />
            <span className="whitespace-nowrap">
              No 6 International Dental Centre, No.06 Gemmill Lane Singapore
              069249
            </span>
          </li>
          <button
            className={cn(
              "px-4 py-1.5 bg-[#38588066] rounded-full font-medium font-(family-name:--font-poppins) cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-300",
              color === "white" && "text-white bg-[#1e3a8a]"
            )}
          >
            Login
          </button>
          <button
            className={cn(
              "px-4 py-1.5 bg-[#38588066] rounded-full font-medium font-(family-name:--font-poppins) cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-300",
              color === "white" && "text-white bg-[#1e3a8a]"
            )}
          >
            Register
          </button>
        </ul>

        <div className="py-2.5 flex items-center justify-between">
          <ul className="list-none flex items-center gap-1.5">
            <li>
              <Image
                src="/google.svg"
                alt="Description of image"
                width={19}
                height={19}
                className="w-4 h-4 object-contain"
              />
            </li>
            <li>
              <Image
                src="/facebook.svg"
                alt="Description of image"
                width={19}
                height={19}
                className="w-4 h-4 object-contain"
              />
            </li>
            <li>
              <Image
                src="/youtube.svg"
                alt="Description of image"
                width={19}
                height={19}
                className="w-5 h-5 object-contain"
              />
            </li>
            <li>
              <Image
                src="/instagram.svg"
                alt="Description of image"
                width={19}
                height={19}
                className="w-4 h-4 object-contain"
              />
            </li>
          </ul>
          <NavLinks />
        </div>
      </div>
    </section>
  );
}

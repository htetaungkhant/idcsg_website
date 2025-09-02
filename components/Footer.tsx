import React from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}
export default function Footer({ className }: FooterProps) {
  return (
    <section
      className={cn(
        "px-6 pt-6 pb-3 text-white bg-gradient-to-br from-[#595e6a99] to-[#1018284e] backdrop-blur-lg rounded-t-2xl flex flex-col items-center gap-6 max-md:gap-3",
        className
      )}
    >
      <div className="flex justify-center items-center gap-8 max-lg:flex-col max-lg:gap-4">
        <Image
          src="/logo_with_text_1.svg"
          alt="Logo"
          width={100}
          height={100}
          className="h-15 w-auto"
        />
        <ul className="list-none flex items-center gap-4">
          <li>
            <Image
              src="/facebook.svg"
              alt="Description of image"
              width={19}
              height={19}
              className="w-6 h-6 rounded-sm object-contain"
            />
          </li>
          <li className="w-6 h-6 p-0.5 rounded-sm bg-white flex items-center justify-center">
            <Image
              src="/youtube.svg"
              alt="Description of image"
              width={19}
              height={19}
              className="w-full h-full object-contain"
            />
          </li>
          <li className="w-6 h-6 p-0.5 rounded-sm bg-white flex items-center justify-center">
            <Image
              src="/google.svg"
              alt="Description of image"
              width={19}
              height={19}
              className="w-full h-full object-contain"
            />
          </li>
          <li>
            <Image
              src="/instagram.svg"
              alt="Description of image"
              width={19}
              height={19}
              className="w-6 h-6 rounded-sm object-contain"
            />
          </li>
        </ul>
      </div>
      <div className="py-2 font-(family-name:--font-old-standard-tt)">
        <p className="text-center max-xl:text-sm max-lg:text-xs">
          Copyright © 2025 International Dental Centre. All rights reserved.
        </p>
        <p className="text-center max-xl:text-sm max-lg:text-xs">
          IDC® and the IDC logo are registered trademarks of International
          Dental Centre. All other names, trademarks, and logos are the property
          of their respective owners.
        </p>
      </div>
      <div className="w-11/12 pt-3 border-t border-[#DCDCDC] flex items-center justify-center font-(family-name:--font-old-standard-tt)">
        <Link
          href="/privacy-policy"
          className="text-center block max-xl:text-sm max-lg:text-xs hover:underline"
        >
          Privacy Policy
        </Link>
        {/* splitter */}
        <div className="w-px h-6 bg-[#DCDCDC] mx-4" />
        <Link
          href="/terms-of-service"
          className="text-center block max-xl:text-sm max-lg:text-xs hover:underline"
        >
          Terms of Service
        </Link>
      </div>
    </section>
  );
}

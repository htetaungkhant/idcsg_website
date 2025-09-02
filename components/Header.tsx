import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaFax } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}
export default function Header({ className }: HeaderProps) {
  return (
    <section
      className={cn(
        "z-100 fixed w-11/12 top-8 left-1/2 transform -translate-x-1/2 px-6 text-white bg-gradient-to-br from-[#595e6a99] to-[#1018284e] backdrop-blur-xl border border-white/10 shadow-lg rounded-4xl flex items-center justify-between gap-5",
        className
      )}
    >
      <Image
        src="/logo_with_text.svg"
        alt="Logo"
        width={100}
        height={100}
        className="h-14 w-auto"
      />

      <div>
        <ul className="flex gap-2.5 lg:gap-5 items-center list-none font-(family-name:--font-ubuntu-condensed) text-xs border-b border-[#E6E6E6] py-2.5">
          <li className="flex gap-1.5 items-center whitespace-nowrap">
            <FaWhatsapp />
            <span>+65-96870775</span>
          </li>
          <li className="flex gap-1.5 items-center whitespace-nowrap">
            <FaFax />
            <span>+65-96870775</span>
          </li>
          <li className="flex gap-1.5 items-center">
            <MdMailOutline />
            <span>admin@idcsg.com</span>
          </li>
          <li className="flex gap-1.5 items-center">
            <FaLocationDot />
            <span>
              No 6 International Dental Centre, No.06 Gemmill Lane Singapore
              069249
            </span>
          </li>
          <button className="px-4 py-1.5 bg-[#38588066] rounded-full font-medium font-(family-name:--font-poppins)">
            Login
          </button>
          <button className="px-4 py-1.5 bg-[#38588066] rounded-full font-medium font-(family-name:--font-poppins)">
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
          <ul className="list-none flex items-center gap-3 xl:gap-6 font-(family-name:--font-oswald) text-base xl:text-lg">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/teams">Teams</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/information">Information</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/pay">Pay</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

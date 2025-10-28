import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { MdAccessTimeFilled } from "react-icons/md";

import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}
export const OriginalFooter: React.FC<FooterProps> = ({ className }) => {
  return (
    <section
      className={cn(
        "px-6 pt-6 pb-3 text-white bg-gradient-to-br from-[#595e6a99] to-[#1018284e] backdrop-blur-lg rounded-t-2xl flex flex-col items-center gap-6 max-md:gap-3",
        className
      )}
    >
      <div className="flex justify-center items-center gap-8 max-lg:flex-col max-lg:gap-4">
        <Link href="/">
          <Image
            src="/footer_logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="h-15 w-auto"
          />
        </Link>
        <ul className="list-none flex items-center gap-4">
          <li className="hover:scale-110 transition-all duration-300">
            <Link
              href="https://www.facebook.com/idcsg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/facebook.svg"
                alt="Description of image"
                width={19}
                height={19}
                className="w-6 h-6 rounded-sm object-contain"
              />
            </Link>
          </li>
          <li className="w-6 h-6 p-0.5 rounded-sm bg-white flex items-center justify-center hover:scale-110 transition-all duration-300">
            <Link
              href="https://www.youtube.com/idcsg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/youtube.svg"
                alt="Description of image"
                width={19}
                height={19}
                className="w-full h-full object-contain"
              />
            </Link>
          </li>
          <li className="w-6 h-6 p-0.5 rounded-sm bg-white flex items-center justify-center hover:scale-110 transition-all duration-300">
            <Link
              href="https://www.google.com/idcsg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/google.svg"
                alt="Description of image"
                width={19}
                height={19}
                className="w-full h-full object-contain"
              />
            </Link>
          </li>
          <li className="hover:scale-110 transition-all duration-300">
            <Link
              href="https://www.instagram.com/idcsg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/instagram.svg"
                alt="Description of image"
                width={19}
                height={19}
                className="w-6 h-6 rounded-sm object-contain"
              />
            </Link>
          </li>
        </ul>
      </div>
      <div className="py-2">
        <p className="text-center max-xl:text-sm max-lg:text-xs">
          Copyright © 2025 International Dental Centre. All rights reserved.
        </p>
        <p className="text-center max-xl:text-sm max-lg:text-xs">
          IDC® and the IDC logo are registered trademarks of International
          Dental Centre. All other names, trademarks, and logos are the property
          of their respective owners.
        </p>
      </div>
      <div className="w-11/12 pt-3 border-t border-[#DCDCDC] flex items-center justify-center">
        <Link
          href="/information/patient-info/privacy-policy"
          className="text-center block max-xl:text-sm max-lg:text-xs hover:underline"
        >
          Privacy Policy
        </Link>
        {/* splitter */}
        <div className="w-px h-6 bg-[#DCDCDC] mx-4" />
        <Link
          href="/information/patient-info/terms-of-service"
          className="text-center block max-xl:text-sm max-lg:text-xs hover:underline"
        >
          Terms of Service
        </Link>
      </div>
    </section>
  );
};

export default function Footer({ className }: FooterProps) {
  return (
    <section
      className={cn(
        "px-4 md:px-8 xl:px-16 py-2 xl:py-3 border-white text-white bg-gradient-to-br from-[#595e6a99] to-[#1018284e] backdrop-blur-lg rounded-t-2xl font-(family-name:--font-roboto) select-none",
        className
      )}
    >
      <div className="pb-1 xl:pb-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 max-md:gap-3 border-b border-inherit">
        <ul className="lg:w-80 xl:w-100 flex flex-col gap-0.5 lg:gap-1 list-none text-[10px] xl:text-xs">
          <li>
            <Link
              href="https://www.google.com/maps/place/International+Dental+Centre+Pte+Ltd/@1.2825521,103.8470548,17z/data=!4m17!1m10!3m9!1s0x31da190cfc9866a1:0x42565d78ea85c125!2sInternational+Dental+Centre+Pte+Ltd!8m2!3d1.282558!4d103.846992!10e5!14m1!1BCgIgAQ!16s%2Fg%2F1wk7nd23!3m5!1s0x31da190cfc9866a1:0x42565d78ea85c125!8m2!3d1.282558!4d103.846992!16s%2Fg%2F1wk7nd23?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 xl:gap-1.5 items-center"
            >
              <FaLocationDot className="w-4 min-w-4 h-4" />
              <span>
                International Dental Centre,
                <br />
                No.06 Gemmill Lane Singapore 069249
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="mailto:admin@idcsg.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 xl:gap-1.5 items-center"
            >
              <MdMailOutline className="w-4 min-w-4 h-4" />
              <span>admin@idcsg.com</span>
            </Link>
          </li>
          <li>
            <Link
              href="https://wa.me/6596870775"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 xl:gap-1.5 items-center"
            >
              <FaWhatsapp className="w-4 min-w-4 h-4" />
              <span>+65-96870775</span>
            </Link>
          </li>
          <li className="flex gap-1 xl:gap-1.5 items-center">
            <MdAccessTimeFilled className="w-4 min-w-4 h-4" />
            <span>08:00 AM to 05:00 PM</span>
          </li>
        </ul>
        <div className="flex-1 flex flex-col items-center gap-2">
          <Link href="/">
            <Image
              src="/footer_logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="h-15 w-auto"
            />
          </Link>
          <ul className="list-none flex items-center gap-4">
            <li className="hover:scale-110 transition-all duration-300">
              <Link
                href="https://www.facebook.com/idcsg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/facebook.svg"
                  alt="Description of image"
                  width={19}
                  height={19}
                  className="w-6 h-6 rounded-sm object-contain"
                />
              </Link>
            </li>
            <li className="w-6 h-6 p-0.5 rounded-sm bg-white flex items-center justify-center hover:scale-110 transition-all duration-300">
              <Link
                href="https://www.youtube.com/idcsg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/youtube.svg"
                  alt="Description of image"
                  width={19}
                  height={19}
                  className="w-full h-full object-contain"
                />
              </Link>
            </li>
            <li className="w-6 h-6 p-0.5 rounded-sm bg-white flex items-center justify-center hover:scale-110 transition-all duration-300">
              <Link
                href="https://www.google.com/idcsg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/google.svg"
                  alt="Description of image"
                  width={19}
                  height={19}
                  className="w-full h-full object-contain"
                />
              </Link>
            </li>
            <li className="hover:scale-110 transition-all duration-300">
              <Link
                href="https://www.instagram.com/idcsg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/instagram.svg"
                  alt="Description of image"
                  width={19}
                  height={19}
                  className="w-6 h-6 rounded-sm object-contain"
                />
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:w-80 xl:w-100 flex flex-col gap-1">
          <p className="text-right text-xs xl:text-sm">
            <Link
              href="/information/patient-info/privacy-policy"
              className="hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link
              href="/information/patient-info/terms-of-service"
              className="hover:underline"
            >
              Terms of Service
            </Link>
          </p>
          <p className="text-right text-[10px] xl:text-xs">
            Copyright © 2025 International Dental Centre. All rights reserved.
          </p>
          <p className="text-right text-[8px] xl:text-[10px]">
            IDC® and the IDC logo are registered trademarks of International
            Dental Centre. All other names, trademarks, and logos are the
            property of their respective owners.
          </p>
        </div>
      </div>
    </section>
  );
}

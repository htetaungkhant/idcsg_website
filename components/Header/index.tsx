import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaFax } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { TechnologyService } from "@/lib/services/technology-service";
import { getCategories } from "@/lib/services/category-service";
import { ServiceService } from "@/lib/services/service-service";
import NavLinks from "./NavLinks";

interface HeaderProps {
  color?: "transparent" | "white";
  className?: string;
}
export default async function Header({
  className,
  color = "transparent",
}: HeaderProps) {
  const technologies = await TechnologyService.getTechnologies();
  const technologyData = technologies?.map((tech) => ({
    id: tech.id,
    title: tech.title,
  }));

  const categories = await getCategories();
  const services = await ServiceService.getServices();

  const servicesData = categories?.map((category) => {
    const relatedServices = services.filter(
      (service) => service.categoryId === category.id
    );
    if (relatedServices?.length === 0) return [];
    return relatedServices.map((service) => ({
      id: service.id,
      name: service.name,
      categoryTitle: service.category?.title,
    }));
  });

  return (
    <section
      className={cn(
        "z-100 fixed w-11/12 top-8 left-1/2 transform -translate-x-1/2 px-6 text-white bg-gradient-to-br from-[#595e6a99] to-[#1018284e] backdrop-blur-xl border border-white/10 shadow-lg rounded-4xl flex items-center justify-between gap-3 xl:gap-5",
        color === "white" && "bg-white text-[#404040] shadow-sm",
        className
      )}
    >
      <Link href="/">
        <Image
          src="/logo_with_text.svg"
          alt="Logo"
          width={100}
          height={100}
          className="h-10 xl:h-14 w-auto"
        />
      </Link>

      <div>
        <ul className="flex gap-2.5 xl:gap-5 items-center justify-between list-none font-(family-name:--font-ubuntu-condensed) text-[10px] xl:text-xs border-b border-[#E6E6E6] py-2.5">
          <li>
            <Link
              href="https://wa.me/6596870775"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 xl:gap-1.5 items-center"
            >
              <FaWhatsapp />
              <span className="whitespace-nowrap">+65-96870775</span>
            </Link>
          </li>
          <li>
            <Link
              href="tel:+6563720082"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 xl:gap-1.5 items-center"
            >
              <FaFax />
              <span className="whitespace-nowrap">+65-63720082</span>
            </Link>
          </li>
          <li>
            <Link
              href="mailto:admin@idcsg.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 xl:gap-1.5 items-center"
            >
              <MdMailOutline />
              <span className="whitespace-nowrap">admin@idcsg.com</span>
            </Link>
          </li>
          <li>
            <Link
              href="https://www.google.com/maps/place/International+Dental+Centre+Pte+Ltd/@1.2825521,103.8470548,17z/data=!4m17!1m10!3m9!1s0x31da190cfc9866a1:0x42565d78ea85c125!2sInternational+Dental+Centre+Pte+Ltd!8m2!3d1.282558!4d103.846992!10e5!14m1!1BCgIgAQ!16s%2Fg%2F1wk7nd23!3m5!1s0x31da190cfc9866a1:0x42565d78ea85c125!8m2!3d1.282558!4d103.846992!16s%2Fg%2F1wk7nd23?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 xl:gap-1.5 items-center"
            >
              <FaLocationDot />
              <span className="whitespace-nowrap">
                International Dental Centre, No.06 Gemmill Lane Singapore 069249
              </span>
            </Link>
          </li>
          {/* <button
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
          </button> */}
        </ul>

        <div className="py-2.5 flex items-center justify-between gap-20">
          <ul className="list-none flex items-center gap-1.5">
            <li className="hover:scale-110 transition-all duration-300">
              <Link
                href="https://www.google.com/maps/place/International+Dental+Centre+Pte+Ltd/@1.2825521,103.8470548,17z/data=!4m17!1m10!3m9!1s0x31da190cfc9866a1:0x42565d78ea85c125!2sInternational+Dental+Centre+Pte+Ltd!8m2!3d1.282558!4d103.846992!10e5!14m1!1BCgIgAQ!16s%2Fg%2F1wk7nd23!3m5!1s0x31da190cfc9866a1:0x42565d78ea85c125!8m2!3d1.282558!4d103.846992!16s%2Fg%2F1wk7nd23?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/google.svg"
                  alt="Description of image"
                  width={19}
                  height={19}
                  className="w-4 h-4 object-contain"
                />
              </Link>
            </li>
            <li className="hover:scale-110 transition-all duration-300">
              <Link
                href="https://www.facebook.com/idcsing/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/facebook.svg"
                  alt="Description of image"
                  width={19}
                  height={19}
                  className="w-4 h-4 object-contain"
                />
              </Link>
            </li>
            <li className="hover:scale-110 transition-all duration-300">
              <Link
                href="https://www.youtube.com/@internationaldentalcentre"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/youtube.svg"
                  alt="Description of image"
                  width={19}
                  height={19}
                  className="w-5 h-5 object-contain"
                />
              </Link>
            </li>
            <li className="hover:scale-110 transition-all duration-300">
              <Link
                href="https://www.instagram.com/idcsingapore/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/instagram.svg"
                  alt="Description of image"
                  width={19}
                  height={19}
                  className="w-4 h-4 object-contain"
                />
              </Link>
            </li>
          </ul>
          <NavLinks
            technologyData={technologyData}
            categoryData={categories}
            servicesData={servicesData}
          />
        </div>
      </div>
    </section>
  );
}

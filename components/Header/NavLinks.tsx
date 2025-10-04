"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const dentalServicesData = {
  "GENERAL DENTISTRY": [
    "General Check-up",
    "Scaling and Polishing",
    "Airflow Cleaning",
    "Dental Fillings",
    "Kids Dental",
    "Orthodontics (Braces)",
    "Periodontal Gum Disease",
    "Dental X-Rays",
  ],
  "EMERGENCY DENTISTRY": [
    "Toothache",
    "Root Canal Treatment",
    "Tooth Extraction",
    "Wisdom Tooth Removal",
    "TMJ Disorder",
  ],
  "RESTORATIVE DENTAL": [
    "Dental Crowns",
    "Dental Bridge",
    "Same Day Dentures",
    "Missing Teeth Replacement",
    "Smile Improvement",
    "ICON Resin Infiltration",
  ],
  "WELLNESS DENTISTRY": [
    "Sports Guard",
    "Dental Mouth Guard",
    "Sleep Apnea Device",
    "Clear Retainer",
    "Holistic Dentistry",
  ],
};

interface ServiceMenuItemProps {
  name?: string;
  onClick?: () => void;
  children: React.ReactNode;
}
const ServiceMenuItem = ({ name, children, onClick }: ServiceMenuItemProps) => (
  <Link
    href={name ? `/services/${encodeURIComponent(name)}` : "#"}
    onClick={onClick}
    className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
  >
    <span>{children}</span>
    <ArrowRight />
  </Link>
);

interface NavLinksProps {
  servicesData?: { [category: string]: string[] };
  technologyData?: { id: string; title: string }[];
  className?: string;
}
export default function NavLinks({
  className,
  servicesData = dentalServicesData,
  technologyData,
}: NavLinksProps) {
  const pathname = usePathname();
  const serviceRef = React.useRef<HTMLDivElement>(null);
  const serviceDropdownRef = React.useRef<HTMLDivElement>(null);
  const informationRef = React.useRef<HTMLDivElement>(null);
  const informationDropdownRef = React.useRef<HTMLDivElement>(null);

  const { categoryTitles, serviceRows } = useMemo(() => {
    const titles = Object.keys(servicesData);
    const arrays = Object.values(servicesData);

    const maxServices = Math.max(...arrays.map((services) => services.length));

    const rows = [];
    for (let i = 0; i < maxServices; i++) {
      const row = arrays.map((services) => services[i] || null);
      rows.push(row);
    }

    return { categoryTitles: titles, serviceRows: rows };
  }, [servicesData]);

  const toggleServiceDropdown = () => {
    serviceDropdownRef.current?.classList.toggle("hidden");
  };

  const toggleInformationDropdown = () => {
    informationDropdownRef.current?.classList.toggle("hidden");
  };

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node) &&
        serviceRef.current &&
        !serviceRef.current.contains(event.target as Node)
      ) {
        serviceDropdownRef.current.classList.add("hidden");
      }

      if (
        informationDropdownRef.current &&
        !informationDropdownRef.current.contains(event.target as Node) &&
        informationRef.current &&
        !informationRef.current.contains(event.target as Node)
      ) {
        informationDropdownRef.current.classList.add("hidden");
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <ul
      className={cn(
        "list-none flex items-center gap-1 font-(family-name:--font-oswald) text-base xl:text-lg",
        className
      )}
    >
      <li
        className={cn(
          "w-15 text-center rounded-full",
          pathname === "/" && "font-bold text-white bg-[#30457C]"
        )}
      >
        <Link href="/" className="w-full block">
          Home
        </Link>
      </li>
      <li
        className={cn(
          "w-15 text-center rounded-full",
          pathname.startsWith("/teams") && "font-bold text-white bg-[#30457C]"
        )}
      >
        <Link href="/teams" className="w-full block">
          Teams
        </Link>
      </li>
      <li
        className={cn(
          "w-19 text-center rounded-full relative",
          pathname.startsWith("/services") &&
            "font-bold text-white bg-[#30457C]"
        )}
      >
        <span
          ref={serviceRef}
          className="w-full cursor-pointer"
          onClick={toggleServiceDropdown}
        >
          Services
        </span>
        <div
          ref={serviceDropdownRef}
          className="pt-8 absolute left-1/2 -translate-x-1/2 hidden"
        >
          {/* top triangle */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 w-0 h-0 border-l-18 border-r-18 border-b-18 border-transparent border-b-white" />

          <div
            className={cn(
              "w-150 p-4 font-normal text-[#010101] bg-white rounded-3xl shadow-md grid grid-cols-4 gap-x-4 gap-y-2.5 max-h-[76vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            )}
          >
            {categoryTitles.map((title) => (
              <h2 key={title} className="uppercase tracking-widest">
                {title}
              </h2>
            ))}
            {serviceRows.flat().map((service, index) =>
              service ? (
                <ServiceMenuItem
                  key={`${service}-${index}`}
                  name={service}
                  onClick={toggleServiceDropdown}
                >
                  {service}
                </ServiceMenuItem>
              ) : (
                <div key={`placeholder-${index}`} aria-hidden="true"></div>
              )
            )}
          </div>
        </div>
      </li>
      <li
        className={cn(
          "w-25 text-center rounded-full relative",
          pathname.startsWith("/information") &&
            "font-bold text-white bg-[#30457C]"
        )}
      >
        <span
          ref={informationRef}
          className="w-full cursor-pointer"
          onClick={toggleInformationDropdown}
        >
          Information
        </span>
        <div
          ref={informationDropdownRef}
          className="pt-8 absolute left-1/2 -translate-x-1/2 hidden"
        >
          {/* top triangle */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 w-0 h-0 border-l-18 border-r-18 border-b-18 border-transparent border-b-white" />

          <div
            className={cn(
              "w-50 p-4 font-normal text-[#010101] bg-white rounded-2xl shadow-md flex flex-col gap-2.5 max-h-[76vh] overflow-visible"
            )}
          >
            <div className="relative group/menu flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300">
              <span>About</span>
              <ArrowRight className="w-5 h-5" />

              <div className="absolute -top-4 left-full hidden group-hover/menu:block">
                <ul className="ml-5 w-50 p-4 bg-white rounded-2xl shadow-md opacity-0 group-hover/menu:opacity-100 invisible group-hover/menu:visible transition-all duration-300 flex flex-col gap-2.5">
                  <li>
                    <Link
                      href="/information/about/safe"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Safe</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/about/precise"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Precise</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/about/personal"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Personal</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <Link
              href="/information/warranty"
              onClick={toggleInformationDropdown}
              className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
            >
              <span>Warranty</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/information/financing-insurance"
              onClick={toggleInformationDropdown}
              className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
            >
              <span>Financing & Insurance</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="relative group/menu flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300">
              <span>Patient Info</span>
              <ArrowRight className="w-5 h-5" />

              <div className="absolute -top-4 left-full hidden group-hover/menu:block">
                <ul className="ml-5 w-50 p-4 bg-white rounded-2xl shadow-md opacity-0 group-hover/menu:opacity-100 invisible group-hover/menu:visible transition-all duration-300 flex flex-col gap-2.5">
                  <li>
                    <Link
                      href="/information/patient-info/office-policies"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Office Policies</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/terms-of-service"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Terms of Service</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/patient-instructions"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Patient Instructions</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/first-visit"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>First Visit</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/patient-forms"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Patient Forms</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/privacy-policy"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Privacy Policy</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative group/menu flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300">
              <span>Technology</span>
              <ArrowRight className="w-5 h-5" />

              <div className="absolute -top-4 left-full hidden group-hover/menu:block">
                <ul className="ml-5 w-50 p-4 bg-white rounded-2xl shadow-md opacity-0 group-hover/menu:opacity-100 invisible group-hover/menu:visible transition-all duration-300 flex flex-col gap-2.5">
                  <li>
                    <Link
                      href="/information/technology"
                      onClick={toggleInformationDropdown}
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Dental Technology</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  {technologyData?.map((tech) => (
                    <li key={tech.id}>
                      <Link
                        href={`/information/technology/${encodeURIComponent(
                          tech.title.toLowerCase().replace(/ /g, "-")
                        )}?id=${tech.id}`}
                        onClick={toggleInformationDropdown}
                        className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                      >
                        <span>{tech.title}</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li
        className={cn(
          "w-15 text-center rounded-full",
          pathname.startsWith("/blog") && "font-bold text-white bg-[#30457C]"
        )}
      >
        <Link href="/blog" className="w-full block">
          Blog
        </Link>
      </li>
      <li
        className={cn(
          "w-15 text-center rounded-full",
          pathname.startsWith("/shop") && "font-bold text-white bg-[#30457C]"
        )}
      >
        <Link href="/shop" className="w-full block">
          Shop
        </Link>
      </li>
      <li
        className={cn(
          "w-13 text-center rounded-full",
          pathname.startsWith("/pay") && "font-bold text-white bg-[#30457C]"
        )}
      >
        <Link href="/pay" className="w-full block">
          Pay
        </Link>
      </li>
      <li
        className={cn(
          "w-19 text-center rounded-full",
          pathname.startsWith("/contact") && "font-bold text-white bg-[#30457C]"
        )}
      >
        <Link href="/contact" className="w-full block">
          Contact
        </Link>
      </li>
    </ul>
  );
}

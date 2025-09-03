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
  children: React.ReactNode;
}
const ServiceMenuItem = ({ name, children }: ServiceMenuItemProps) => (
  <Link
    href={name ? `/services/${name}` : "#"}
    className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
  >
    <span>{children}</span>
    <ArrowRight />
  </Link>
);

interface NavLinksProps {
  servicesData?: { [category: string]: string[] };
  className?: string;
}
export default function NavLinks({
  className,
  servicesData = dentalServicesData,
}: NavLinksProps) {
  const pathname = usePathname();

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

  return (
    <ul
      className={cn(
        "list-none flex items-center gap-1 lg:gap-3 font-(family-name:--font-oswald) text-base xl:text-lg",
        className
      )}
    >
      <li className="w-12 text-center">
        <Link
          href="/"
          className={cn(
            "w-full hover:underline",
            pathname === "/" && "font-bold"
          )}
        >
          Home
        </Link>
      </li>
      <li className="w-12.5 text-center">
        <Link
          href="/teams"
          className={cn(
            "w-full hover:underline",
            pathname.startsWith("/teams") && "font-bold"
          )}
        >
          Teams
        </Link>
      </li>
      <li
        className={cn(
          "w-16 text-center relative group",
          pathname.startsWith("/services") && "font-bold"
        )}
      >
        <span className="w-full cursor-pointer">Services</span>
        <div className="pt-8 absolute left-1/2 -translate-x-1/2 hidden group-hover:block">
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
                <ServiceMenuItem key={`${service}-${index}`} name={service}>
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
          "w-22 text-center relative group",
          pathname.startsWith("/information") && "font-bold"
        )}
      >
        <span className="w-full cursor-pointer">Information</span>
        <div className="pt-8 absolute left-1/2 -translate-x-1/2 hidden group-hover:block">
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
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Safe</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/about/precise"
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Precise</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/about/personal"
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
              className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
            >
              <span>Warranty</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/information/financing-insurance"
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
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Office Policies</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/terms-of-service"
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Terms of Service</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/patient-instructions"
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Patient Instructions</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/first-visit"
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>First Visit</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/patient-forms"
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Patient Forms</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/patient-info/privacy-policy"
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
                      href="/information/technology/dental-technology"
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Dental Technology</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/technology/cone-beam-imaging"
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Cone Beam Imaging</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/information/technology/laser-dentistry"
                      className="flex justify-between items-center gap-4 text-sm text-gray-700 p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-500 transition-all duration-300"
                    >
                      <span>Laser Dentistry</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li className="w-12 text-center">
        <Link
          href="/blog"
          className={cn(
            "w-full hover:underline",
            pathname.startsWith("/blog") && "font-bold"
          )}
        >
          Blog
        </Link>
      </li>
      <li className="w-12 text-center">
        <Link
          href="/shop"
          className={cn(
            "w-full hover:underline",
            pathname.startsWith("/shop") && "font-bold"
          )}
        >
          Shop
        </Link>
      </li>
      <li className="w-10 text-center">
        <Link
          href="/pay"
          className={cn(
            "w-full hover:underline",
            pathname.startsWith("/pay") && "font-bold"
          )}
        >
          Pay
        </Link>
      </li>
      <li className="w-16 text-center">
        <Link
          href="/contact"
          className={cn(
            "w-full hover:underline",
            pathname.startsWith("/contact") && "font-bold"
          )}
        >
          Contact
        </Link>
      </li>
    </ul>
  );
}

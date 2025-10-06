"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  className?: string;
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ className }) => {
  const pathnames = usePathname()
    ?.split("/")
    .filter((x) => x);

  return (
    <div
      className={cn(
        "text-sm bg-white text-[#777777] py-1 px-5 rounded-full shadow-sm",
        className
      )}
    >
      {pathnames && pathnames.length > 0 ? (
        <nav aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="hover:text-gray-900 inline-flex items-center"
              >
                Home
              </Link>
            </li>
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              // Capitalize the first letter and replace hyphens with spaces
              const displayName = name
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

              return (
                <li key={routeTo}>
                  <div className="flex items-center">
                    <span className="px-1">/</span>
                    {isLast ? (
                      <span
                        className="font-bold text-[#233259]"
                        aria-current="page"
                      >
                        {decodeURIComponent(displayName)}
                      </span>
                    ) : (
                      //   <Link href={routeTo} className="hover:text-gray-900">
                      //     {decodeURIComponent(displayName)}
                      //   </Link>
                      <span>{decodeURIComponent(displayName)}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </div>
  );
};

export default Breadcrumb;

"use client";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className }) => {
  const pathnames = usePathname()
    ?.split("/")
    .filter((x) => x);

  const searchParams = useSearchParams();
  const categoryName = searchParams.get("category");

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
              const isServicePage =
                pathnames[0] === "services" && pathnames.length === 2;

              // Capitalize the first letter and replace hyphens with spaces
              const displayName = name
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());

              return (
                <React.Fragment key={routeTo}>
                  <li>
                    <div className="flex items-center">
                      <span className="px-1">/</span>
                      {isLast ? (
                        <>
                          {/* Insert category name before service name if available */}
                          {isServicePage && categoryName && (
                            <>
                              <span>{categoryName}</span>
                              <span className="px-1">/</span>
                            </>
                          )}
                          <span
                            className="font-bold text-[#233259]"
                            aria-current="page"
                          >
                            {decodeURIComponent(displayName)}
                          </span>
                        </>
                      ) : (
                        <span>{decodeURIComponent(displayName)}</span>
                      )}
                    </div>
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      ) : null}
    </div>
  );
};

export default Breadcrumb;

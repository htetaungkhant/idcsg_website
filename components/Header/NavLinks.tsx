"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinksProps {
  className?: string;
}
export default function NavLinks({ className }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        "list-none flex items-center gap-3 xl:gap-6 font-(family-name:--font-oswald) text-base xl:text-lg",
        className
      )}
    >
      <li>
        <Link
          href="/"
          className={cn("hover:underline", pathname === "/" && "font-bold")}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/teams"
          className={cn(
            "hover:underline",
            pathname.startsWith("/teams") && "font-bold"
          )}
        >
          Teams
        </Link>
      </li>
      <li>
        <Link
          href="/services"
          className={cn(
            "hover:underline",
            pathname.startsWith("/services") && "font-bold"
          )}
        >
          Services
        </Link>
      </li>
      <li>
        <Link
          href="/information"
          className={cn(
            "hover:underline",
            pathname.startsWith("/information") && "font-bold"
          )}
        >
          Information
        </Link>
      </li>
      <li>
        <Link
          href="/blog"
          className={cn(
            "hover:underline",
            pathname.startsWith("/blog") && "font-bold"
          )}
        >
          Blog
        </Link>
      </li>
      <li>
        <Link
          href="/shop"
          className={cn(
            "hover:underline",
            pathname.startsWith("/shop") && "font-bold"
          )}
        >
          Shop
        </Link>
      </li>
      <li>
        <Link
          href="/pay"
          className={cn(
            "hover:underline",
            pathname.startsWith("/pay") && "font-bold"
          )}
        >
          Pay
        </Link>
      </li>
      <li>
        <Link
          href="/contact"
          className={cn(
            "hover:underline",
            pathname.startsWith("/contact") && "font-bold"
          )}
        >
          Contact
        </Link>
      </li>
    </ul>
  );
}

import React from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";

export const HomePageBtn: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      children: React.ReactNode;
    }
> = ({ ...props }) => {
  const content = (
    <>
      <span className="font-sans">{props.children}</span>

      <div className="bg-white rounded-full p-2.5 transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#1e3a8a]">
        <svg
          className="w-4 h-4 text-[#1e3a8a] transition-all duration-300 group-hover:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </div>
    </>
  );

  if (props.href) {
    return (
      <Link
        href={props.href}
        {...props}
        className={cn(
          "group flex gap-2.5 items-center justify-between bg-[#6f5653]/50 backdrop-blur-md border border-white/20 text-white text-base font-semibold rounded-full pl-6 pr-1.5 py-1.5 shadow-lg transition-all duration-300 transform hover:bg-white hover:text-[#1e3a8a] hover:scale-105 focus-within:ring-0 cursor-pointer select-none",
          props.className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={cn(
        "group flex gap-2.5 items-center justify-between bg-[#6f5653]/50 backdrop-blur-md border border-white/20 text-white text-base font-semibold rounded-full pl-6 pr-1.5 py-1.5 shadow-lg transition-all duration-300 transform hover:bg-white hover:text-[#1e3a8a] hover:scale-105 focus-within:ring-0 cursor-pointer select-none",
        props.className
      )}
    >
      {content}
    </button>
  );
};

export const PrimaryBtn1: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      children: React.ReactNode;
    }
> = ({ ...props }) => {
  const content = (
    <>
      <span className="font-sans">{props.children}</span>

      <div className="bg-[#233259] rounded-full p-2.5 transition-all duration-300 rotate-45">
        <svg
          className="w-4 h-4 text-white transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </div>
    </>
  );

  if (props.href) {
    return (
      <Link
        href={props.href}
        {...props}
        className={cn(
          "flex gap-2.5 items-center justify-between bg-white border-[0.5px] border-[#233259]/50 text-[#233259] text-base font-semibold rounded-full pl-5 pr-1 py-1 shadow-lg transition-all duration-300 transform hover:scale-105 focus-within:ring-0 cursor-pointer",
          props.className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={cn(
        "flex gap-2.5 items-center justify-between bg-white border-[0.5px] border-[#233259]/50 text-[#233259] text-base font-semibold rounded-full pl-5 pr-1 py-1 shadow-lg transition-all duration-300 transform hover:scale-105 focus-within:ring-0 cursor-pointer",
        props.className
      )}
    >
      {content}
    </button>
  );
};

export const PrimaryBtn2: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      children: React.ReactNode;
    }
> = ({ ...props }) => {
  const content = (
    <>
      <span className="font-sans">{props.children}</span>

      <div className="bg-[#D4D1D1] rounded-full p-2.5 transition-all duration-300 group-hover/pbtn2:rotate-45 group-hover/pbtn2:bg-[#233259]">
        <svg
          className="w-4 h-4 text-[#233259] group-hover/pbtn2:text-white transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </div>
    </>
  );

  if (props.href) {
    return (
      <Link
        href={props.href}
        {...props}
        className={cn(
          "group/pbtn2 flex gap-2.5 items-center justify-between bg-white border-[0.5px] border-[#233259]/50 text-[#233259] text-base font-medium rounded-full pl-5 pr-1 py-1 transition-all duration-300 transform focus-within:ring-0 cursor-pointer",
          props.className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={cn(
        "group/pbtn2 flex gap-2.5 items-center justify-between bg-white border-[0.5px] border-[#233259]/50 text-[#233259] text-base font-medium rounded-full pl-5 pr-1 py-1 transition-all duration-300 transform focus-within:ring-0 cursor-pointer",
        props.className
      )}
    >
      {content}
    </button>
  );
};

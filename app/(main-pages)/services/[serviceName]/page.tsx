import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PrimaryBtn2 } from "@/components/CustomButtons";

interface ServiceProps {
  params: {
    serviceName: string;
  };
}

export default async function Service({ params }: ServiceProps) {
  const { serviceName } = await params;

  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">
        General Dentistry
      </h1>
      <div className="mt-10 flex relative">
        <div className="absolute w-[90%] h-[85%] inset-0 bg-gradient-to-r from-[#CA4E48] to-[#642724] rounded-3xl"></div>

        <div className="relative max-w-64 pl-5 py-5 pr-3 flex flex-col gap-y-4">
          <Link
            href={`/services/${encodeURIComponent(
              decodeURIComponent(serviceName)
            )}/serviceDetails`}
            className="px-2 pt-3 pb-1.5 flex flex-col gap-3 items-end bg-[#68211E] border border-[#650F0F] rounded-tl-2xl rounded-tr-lg rounded-bl-lg rounded-br-3xl hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-white text-3xl">
              Click Here to view more details
            </h2>
            <div className="max-w-[40px] max-h-[40px] bg-white border border-[#ABABAB] rounded-full p-2.5 transition-all duration-300 -rotate-90 text-8xl">
              <svg
                className="w-full h-full text-[#C64C46] transition-all duration-300"
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
          </Link>
          <div className="z-10 w-100 xl:w-130 ml-12 flex flex-col gap-y-2 text-[#233259] bg-white px-5 py-3 rounded-3xl shadow-lg">
            <h3 className="text-center text-2xl xl:text-4xl font-bold">
              Overview
            </h3>
            <p className="text-base xl:text-xl font-(family-name:--font-old-standard-tt)">
              A dental check-up at IDC is a comprehensive assessment designed to
              maintain your oral health and catch potential issues early. It
              includes a detailed dental examination, digital X-rays,
              high-resolution photographs, and professional teeth cleaning. Our
              dentists also provide personalised oral hygiene guidance tailored
              to your needs. Whether you&apos;re a first-time visitor or
              returning for routine care, each check-up is conducted in a calm,
              patient-focused environment—ensuring comfort, clarity, and
              long-term dental wellness.
            </p>
            <div className="flex items-center justify-center gap-5 mt-2">
              <PrimaryBtn2>Book</PrimaryBtn2>
              <PrimaryBtn2>Pre-Pay</PrimaryBtn2>
            </div>
          </div>
        </div>
        <div className="relative flex-1 mt-16">
          <h1 className="absolute top-2 right-4 text-right text-white text-6xl w-52">
            {decodeURIComponent(serviceName)}
          </h1>
          <Image
            src="/little_boy_dentist.jpg"
            alt="Little Boy Dentist"
            width={500}
            height={500}
            className="w-full rounded-3xl shadow-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
}

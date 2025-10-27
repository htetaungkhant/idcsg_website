import React from "react";
import Image from "next/image";

import { PrimaryBtn1 } from "@/components/CustomButtons";

export default function PatientForms() {
  return (
    <div className="flex flex-col gap-20 justify-center mx-auto w-[90%] pb-20">
      <div className="relative">
        <h1 className="absolute top-0 left-0 px-5 py-5 w-full h-40 bg-gradient-to-b from-[#000000] to-[#00000000] text-white text-5xl rounded-t-2xl">
          Patient Forms
        </h1>
        <Image
          src="/3.png"
          width={500}
          height={300}
          alt="Patient Forms"
          className="w-full h-auto object-cover rounded-2xl shadow-sm"
        />
      </div>
      <div className="text-[#233259]">
        <h2 className="font-(family-name:--font-roboto) font-bold text-2xl">
          Patient Intake Information
        </h2>
        <p className="font-(family-name:--font-roboto) text-lg mt-4">
          Please click this link to register your new patient intake information
          and health history. Our office will text you this link when you make
          an actual appointment with our office. This is a reference in case you
          did not receive the text link.
        </p>
        <PrimaryBtn1 className="mx-auto mt-10">Click to Apply</PrimaryBtn1>
      </div>
    </div>
  );
}

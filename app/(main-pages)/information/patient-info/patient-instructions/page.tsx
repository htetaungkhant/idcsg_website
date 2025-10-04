import React from "react";
import Image from "next/image";
import { PatientInstructionsService } from "@/lib/services/patient-instructions-service";
import { CustomCard2 } from "@/components/CustomCard";

export default async function PatientInstructions() {
  const patientInstructionsData =
    await PatientInstructionsService.getPatientInstructions();

  if (!patientInstructionsData) {
    return (
      <div className="mx-auto w-[90%]">No patient instructions available.</div>
    );
  }
  return (
    <div className="flex flex-col gap-20 justify-center mx-auto w-[90%] pb-20">
      {patientInstructionsData.bannerImage && (
        <div className="relative">
          <h1 className="absolute top-0 left-0 px-5 py-5 w-full h-40 bg-gradient-to-b from-[#000000] to-[#00000000] text-white text-5xl rounded-t-2xl">
            Patient Instructions
          </h1>
          <Image
            src="/3.png"
            width={500}
            height={300}
            alt="Patient Forms"
            className="w-full h-auto object-cover rounded-2xl shadow-sm"
          />
        </div>
      )}
      {patientInstructionsData.cards &&
        patientInstructionsData.cards.length > 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
            {patientInstructionsData.cards.map((card) => (
              <CustomCard2
                key={card.id}
                icon="/patient-instructions-icon.svg"
                title={card.contentTitle}
                contentImageUrl={card.contentImage}
                description={card.contentDescription}
                bgImageUrl={card.backgroundImage}
              />
            ))}
          </div>
        )}
    </div>
  );
}

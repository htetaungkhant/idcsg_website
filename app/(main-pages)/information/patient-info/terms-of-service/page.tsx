import React from "react";
import { termsOfServiceService } from "@/lib/services/terms-of-service-service";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export default async function TermsOfService() {
  const TermsOfService = await termsOfServiceService.getTermsOfService();

  if (!TermsOfService) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600">
          Terms of Service is being prepared. Please check back soon!
        </p>
      </div>
    );
  }

  // Render the terms of service content
  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">
        Terms of Service
      </h1>
      <div className="mt-8 flex flex-col gap-y-4 text-lg text-[#233259] font-(family-name:--font-ubuntu)">
        <p>Effective Date: {TermsOfService.hostingDate}</p>
        <div>
          <p
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: TermsOfService.description }}
          />
        </div>
      </div>
    </div>
  );
}

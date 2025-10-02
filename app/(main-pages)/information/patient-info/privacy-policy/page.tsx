import React from "react";
import { privacyPolicyService } from "@/lib/services/privacy-policy-service";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export default async function PrivacyPolicy() {
  const privacyPolicy = await privacyPolicyService.getPrivacyPolicy();

  if (!privacyPolicy) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <p className="text-2xl text-gray-600">
          Privacy policy is being prepared. Please check back soon!
        </p>
      </div>
    );
  }

  // Render the privacy policy content
  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">Privacy policy</h1>
      <div className="mt-8 flex flex-col gap-y-4 text-lg text-[#233259] font-(family-name:--font-ubuntu)">
        <p>Effective Date: {privacyPolicy.hostingDate}</p>
        <div>
          <p
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: privacyPolicy.description }}
          />
        </div>
      </div>
    </div>
  );
}

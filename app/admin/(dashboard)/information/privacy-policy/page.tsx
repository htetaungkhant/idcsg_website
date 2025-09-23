import React from "react";
import { privacyPolicyService } from "@/lib/services/privacy-policy-service";
import PrivacyPolicyForm from "./(components)/PrivacyPolicyForm";

export default async function PrivacyPolicyPage() {
  // Fetch existing privacy policy data (if any)
  let initialData = null;

  try {
    initialData = await privacyPolicyService.getPrivacyPolicy();
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    // Continue with null data - form will handle empty state
  }

  return (
    <div className="container">
      <PrivacyPolicyForm initialData={initialData} />
    </div>
  );
}

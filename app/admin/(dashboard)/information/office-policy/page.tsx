import React from "react";
import { officePolicyService } from "@/lib/services/office-policy-service";
import OfficePolicyForm from "./(components)/OfficePolicyForm";

export default async function OfficePolicyPage() {
  // Fetch existing office policy data (if any)
  let initialData = null;

  try {
    initialData = await officePolicyService.getOfficePolicy();
  } catch (error) {
    console.error("Error fetching office policy:", error);
    // Continue with null data - form will handle empty state
  }

  return (
    <div className="container">
      <OfficePolicyForm initialData={initialData} />
    </div>
  );
}

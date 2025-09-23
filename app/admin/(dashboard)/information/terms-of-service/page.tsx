import React from "react";
import { termsOfServiceService } from "@/lib/services/terms-of-service-service";
import TermsOfServiceForm from "./(components)/TermsOfServiceForm";

export default async function TermsOfServicePage() {
  // Fetch existing terms of service data (if any)
  let initialData = null;

  try {
    initialData = await termsOfServiceService.getTermsOfService();
  } catch (error) {
    console.error("Error fetching terms of service:", error);
    // Continue with null data - form will handle empty state
  }

  return (
    <div className="container">
      <TermsOfServiceForm initialData={initialData} />
    </div>
  );
}

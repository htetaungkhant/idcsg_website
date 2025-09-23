import React from "react";
import { PersonalService } from "@/lib/services/personal-service";
import PersonalForm from "./(components)/PersonalForm";

export default async function PersonalPage() {
  // Fetch existing Personal data
  let personalData = null;
  try {
    personalData = await PersonalService.getPersonal();
  } catch (error) {
    console.error("Error fetching Personal data:", error);
    // Continue with null data - form will handle creating new record
  }

  return (
    <div className="container">
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Personal Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your Personal information. The system maintains only one
            Personal record at a time.
          </p>
        </div>

        <PersonalForm initialData={personalData} />
      </div>
    </div>
  );
}

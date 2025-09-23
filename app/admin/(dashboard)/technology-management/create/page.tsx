import React from "react";
import BackNavigation from "@/app/admin/(dashboard)/(components)/BackNavigation";
import CreateTechnologyForm from "@/app/admin/(dashboard)/technology-management/(components)/CreateTechnologyForm";

export default async function CreateTechnologyPage() {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <BackNavigation href="/admin/technology-management" />

      {/* Technology Form */}
      <CreateTechnologyForm />
    </div>
  );
}

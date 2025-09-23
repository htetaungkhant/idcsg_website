import React from "react";
import BackNavigation from "@/app/admin/(dashboard)/(components)/BackNavigation";
import CreateServiceForm from "@/app/admin/(dashboard)/service-management/(components)/CreateServiceForm";

export default async function CreateServicePage() {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <BackNavigation href="/admin/service-management" />

      {/* Service Form */}
      <CreateServiceForm />
    </div>
  );
}

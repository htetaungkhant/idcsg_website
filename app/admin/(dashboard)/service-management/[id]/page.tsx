import React from "react";
import BackNavigation from "@/app/admin/(dashboard)/(components)/BackNavigation";
import EditServiceForm from "@/app/admin/(dashboard)/service-management/(components)/EditServiceForm";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <BackNavigation href="/admin/service-management" />

      {/* Service Form in Edit Mode */}
      <EditServiceForm serviceId={id} />
    </div>
  );
}

import React from "react";
import BackNavigation from "@/app/admin/(dashboard)/(components)/BackNavigation";
import MemberForm from "@/app/admin/(dashboard)/team-management/(components)/CreateMemberForm";

export default function CreateMemberPage() {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <BackNavigation href="/admin/team-management" />

      {/* Member Form */}
      <MemberForm />
    </div>
  );
}

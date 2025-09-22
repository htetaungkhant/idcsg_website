import React from "react";
import MemberForm from "../(components)/CreateMemberForm";
import BackNavigation from "../(components)/BackNavigation";

export default function CreateMemberPage() {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <BackNavigation />

      {/* Member Form */}
      <MemberForm />
    </div>
  );
}

import React from "react";
import MemberForm from "../(components)/MemberForm";
import BackNavigation from "../(components)/BackNavigation";

export default function Page() {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <BackNavigation />

      {/* Member Form */}
      <MemberForm />
    </div>
  );
}

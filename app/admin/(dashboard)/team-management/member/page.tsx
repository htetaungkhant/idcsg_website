import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MemberForm from "../(components)/MemberForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/team-management"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:underline p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Member Form */}
      <MemberForm />
    </div>
  );
}

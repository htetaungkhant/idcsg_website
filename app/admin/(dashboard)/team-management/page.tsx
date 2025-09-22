import Link from "next/link";
import React from "react";

export default async function page() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and configure your team members
        </p>
        <Link
          href="/admin/team-management/member"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Create or Edit Member
        </Link>
      </div>
    </div>
  );
}

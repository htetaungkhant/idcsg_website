import React from "react";
import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";

export default function AddMemberCard() {
  return (
    <Link href="/admin/team-management/create">
      <div className="h-full flex flex-col justify-center bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer">
        {/* Card Content */}
        <div className="aspect-square w-full rounded-t-lg flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors duration-200">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center">
                <UserPlus className="h-8 w-8" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-current rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium">Add New Member</p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-1">
            Add Team Member
          </h3>
          <p className="text-sm text-gray-500">
            Click to add a new member to your team
          </p>
        </div>
      </div>
    </Link>
  );
}

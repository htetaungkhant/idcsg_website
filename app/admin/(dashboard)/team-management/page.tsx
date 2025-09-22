import React from "react";
import { memberService } from "@/lib/services/member-service";
import TeamManagementContent from "./(components)/TeamManagementContent";

export default async function TeamManagementPage() {
  try {
    // Fetch all active members from the database
    const members = await memberService.getMembers({
      isActive: true,
      orderBy: "sortOrder",
      orderDirection: "asc",
    });

    return <TeamManagementContent initialMembers={members} />;
  } catch (error) {
    console.error("Error fetching team members:", error);

    // Return error state
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and configure your team members
          </p>
        </div>

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 19c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Team Members
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading the team members. Please try refreshing
            the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

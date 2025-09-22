import React from "react";
import { notFound } from "next/navigation";
import { memberService } from "@/lib/services/member-service";
import EditMemberForm from "@/app/admin/(dashboard)/team-management/(components)/EditMemberForm";
import BackNavigation from "@/app/admin/(dashboard)/team-management/(components)/BackNavigation";

interface EditMemberPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  try {
    // Fetch the member data
    const { id } = await params;
    const member = await memberService.getMemberById(id);

    if (!member) {
      notFound();
    }

    return (
      <div className="space-y-6">
        {/* Back Navigation */}
        <BackNavigation />

        {/* Edit Member Form */}
        <EditMemberForm member={member} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching member for edit:", error);

    // Return error state
    return (
      <div className="space-y-6">
        <BackNavigation />

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
            Error Loading Member
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading the member details. Please try again.
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

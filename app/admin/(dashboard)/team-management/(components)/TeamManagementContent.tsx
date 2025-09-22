"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import TeamMemberCard, { type TeamMember } from "./TeamMemberCard";
import AddMemberCard from "./AddMemberCard";
import FilterTabs, { type TeamType } from "./FilterTabs";
import DeleteMemberDialog from "./DeleteMemberDialog";

interface TeamManagementContentProps {
  initialMembers: TeamMember[];
}

export default function TeamManagementContent({
  initialMembers,
}: TeamManagementContentProps) {
  const [activeTab, setActiveTab] = useState<TeamType>("ALL");
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter members based on active tab
  const filteredMembers = useMemo(() => {
    if (activeTab === "ALL") {
      return members;
    }
    return members.filter((member) => member.team === activeTab);
  }, [members, activeTab]);

  // Calculate member counts for tabs
  const memberCounts = useMemo(() => {
    return {
      ALL: members.length,
      DOCTORS: members.filter((member) => member.team === "DOCTORS").length,
      CONSULTANT_SPECIALISTS: members.filter(
        (member) => member.team === "CONSULTANT_SPECIALISTS"
      ).length,
      ALLIED_HEALTH_SUPPORT_STAFF: members.filter(
        (member) => member.team === "ALLIED_HEALTH_SUPPORT_STAFF"
      ).length,
    };
  }, [members]);

  // Handle member actions
  const handleEditMember = (memberId: string) => {
    // TODO: Navigate to edit page
    toast.info(`Edit member: ${memberId}`);
  };

  const handleDeleteMember = async (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    setMemberToDelete(member);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);

    try {
      // Optimistically remove the member from the UI
      const previousMembers = members;
      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));

      // Call the API to delete the member
      const response = await fetch(
        `/api/team-members/${memberToDelete.id}?hard=true`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        // Revert the optimistic update if the API call fails
        setMembers(previousMembers);
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete member");
      }

      toast.success(`${memberToDelete.name} has been deleted successfully`);

      // Close the dialog
      setMemberToDelete(null);
    } catch (error) {
      console.error("Error deleting member:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete member. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setMemberToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and configure your team members ({members.length} members)
        </p>
      </div>

      {/* Filter Tabs */}
      <FilterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        memberCounts={memberCounts}
      />

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Add Member Card - Always first */}
        <AddMemberCard />

        {/* Team Member Cards */}
        {filteredMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No members found
          </h3>
          <p className="text-gray-600">
            {activeTab === "ALL"
              ? "Add your first team member to get started."
              : `No members found in the ${activeTab
                  .toLowerCase()
                  .replace(/_/g, " ")} category.`}
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteMemberDialog
        isOpen={memberToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        member={memberToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

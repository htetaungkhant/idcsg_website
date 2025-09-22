import React from "react";
import Image from "next/image";
import { User, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TeamMember {
  id: string;
  imageUrl: string | null;
  name: string;
  designation: string | null;
  team: "DOCTORS" | "CONSULTANT_SPECIALISTS" | "ALLIED_HEALTH_SUPPORT_STAFF";
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit?: (memberId: string) => void;
  onDelete?: (memberId: string) => void;
}

const getTeamDisplayName = (team: TeamMember["team"]): string => {
  switch (team) {
    case "DOCTORS":
      return "Doctors";
    case "CONSULTANT_SPECIALISTS":
      return "Consultant Specialists";
    case "ALLIED_HEALTH_SUPPORT_STAFF":
      return "Allied Health & Support Staff";
    default:
      return team;
  }
};

const getTeamBadgeColor = (team: TeamMember["team"]): string => {
  switch (team) {
    case "DOCTORS":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "CONSULTANT_SPECIALISTS":
      return "bg-green-100 text-green-800 border-green-200";
    case "ALLIED_HEALTH_SUPPORT_STAFF":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function TeamMemberCard({
  member,
  onEdit,
  onDelete,
}: TeamMemberCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Member Image */}
      <div className="relative">
        <div className="aspect-square w-full rounded-t-lg overflow-hidden bg-gray-100">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <User className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-2 right-2 flex gap-1">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(member.id)}
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(member.id)}
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 border-red-200 hover:border-red-300"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Member Information */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Name and Designation */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {member.name}
          </h3>
          {member.designation && (
            <p className="text-sm font-medium text-gray-600">
              {member.designation}
            </p>
          )}
        </div>

        {/* Team Badge */}
        <div className="mb-3">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTeamBadgeColor(
              member.team
            )}`}
          >
            {getTeamDisplayName(member.team)}
          </span>
        </div>

        {/* Description */}
        <p className="flex-1 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {member.description}
        </p>

        {/* Status Indicator */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                member.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-gray-500">
              {member.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).format(new Date(member.createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
}

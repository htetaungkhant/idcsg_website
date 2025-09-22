"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type TeamType =
  | "ALL"
  | "DOCTORS"
  | "CONSULTANT_SPECIALISTS"
  | "ALLIED_HEALTH_SUPPORT_STAFF";

interface FilterTabsProps {
  activeTab: TeamType;
  onTabChange: (tab: TeamType) => void;
  memberCounts?: {
    ALL: number;
    DOCTORS: number;
    CONSULTANT_SPECIALISTS: number;
    ALLIED_HEALTH_SUPPORT_STAFF: number;
  };
}

const tabs = [
  {
    key: "ALL" as TeamType,
    label: "All Teams",
    description: "View all team members",
  },
  {
    key: "DOCTORS" as TeamType,
    label: "Doctors",
    description: "Medical doctors and physicians",
  },
  {
    key: "CONSULTANT_SPECIALISTS" as TeamType,
    label: "Consultant Specialists",
    description: "Specialized medical consultants",
  },
  {
    key: "ALLIED_HEALTH_SUPPORT_STAFF" as TeamType,
    label: "Allied Health & Support Staff",
    description: "Support staff and allied health professionals",
  },
];

export default function FilterTabs({
  activeTab,
  onTabChange,
  memberCounts,
}: FilterTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = memberCounts?.[tab.key] ?? 0;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                isActive
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              type="button"
              title={tab.description}
            >
              <div className="flex items-center gap-2">
                <span>{tab.label}</span>
                {memberCounts && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium",
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackNavigationProps {
  href?: string;
  label?: string;
}

export default function BackNavigation({
  href = "/admin/team-management",
  label = "Back",
}: BackNavigationProps) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={href}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:underline p-0"
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </div>
  );
}

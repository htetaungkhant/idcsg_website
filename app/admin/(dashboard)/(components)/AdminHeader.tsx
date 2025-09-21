"use client";

import { User } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = "Dashboard" }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left Side - Mobile Menu + Title */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <span className="text-xs text-gray-500">IDCSG Admin Panel</span>
          </div>
        </div>

        {/* Right Side - Actions & User */}
        <div className="flex items-center gap-2">
          {/* User Profile */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium text-gray-900">
                {session?.user?.name || "Admin User"}
              </span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

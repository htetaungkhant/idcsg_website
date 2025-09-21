"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Info,
  LogOut,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isInformationOpen, setIsInformationOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleInformationMenu = () => {
    setIsInformationOpen(!isInformationOpen);
  };

  const menuItems = [
    {
      title: "Homepage Management",
      icon: Home,
      href: "/admin/home-page-management",
      isActive: pathname === "/admin/home-page-management",
    },
    {
      title: "Information Management",
      icon: Info,
      href: "#",
      isActive: pathname.startsWith("/admin/information"),
      hasSubmenu: true,
      submenu: [
        {
          title: "Patient Instructions",
          icon: FileText,
          href: "/admin/information/patient-instructions",
          isActive: pathname === "/admin/information/patient-instructions",
        },
        {
          title: "First Visit",
          icon: UserCheck,
          href: "/admin/information/first-visit",
          isActive: pathname === "/admin/information/first-visit",
        },
      ],
    },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Home className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              IDCSG Admin
            </span>
            <span className="text-xs text-gray-500">Dashboard Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.hasSubmenu ? (
                    <>
                      <SidebarMenuButton
                        isActive={item.isActive}
                        onClick={toggleInformationMenu}
                        className="flex w-full items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {isInformationOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                      {isInformationOpen && (
                        <SidebarMenuSub>
                          {item.submenu?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subItem.isActive}
                              >
                                <Link
                                  href={subItem.href}
                                  className="flex items-center gap-2"
                                >
                                  <subItem.icon className="h-3 w-3" />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}

              {/* Logout Button */}
              <SidebarMenuItem>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

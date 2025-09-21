import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/lib/auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./(components)/AdminSidebar";
import { AdminHeader } from "./(components)/AdminHeader";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (
    !session ||
    (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
  ) {
    redirect("/admin/sign-in");
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}

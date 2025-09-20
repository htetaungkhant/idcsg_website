import { redirect } from "next/navigation";

import { SignOut } from "@/components/SignOut";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/admin/sign-in");

  return (
    <div className="flex flex-col min-h-screen">
      {children}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <SignOut />
      </header>
      <main className="flex-grow p-4">{/* Admin content goes here */}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} International Dental Centre
      </footer>
    </div>
  );
}

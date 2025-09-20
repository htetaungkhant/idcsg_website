import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/admin/sign-in");

  return <div className="flex flex-col min-h-screen">{children}</div>;
}

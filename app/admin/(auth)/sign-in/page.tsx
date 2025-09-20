import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import SignInForm from "./(components)/SignInForm";

export default async function Page() {
  const session = await auth();
  if (session) redirect("/admin/home-page-management");

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

      {/* SignInForm Component */}
      <SignInForm />
    </div>
  );
}

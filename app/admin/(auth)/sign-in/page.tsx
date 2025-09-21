import { redirect } from "next/navigation";
import Image from "next/image";

import { auth } from "@/lib/auth";
import SignInForm from "./(components)/SignInForm";

export default async function Page() {
  const session = await auth();
  if (
    session &&
    (session.user as unknown as Record<string, unknown>)?.role === "ADMIN"
  ) {
    redirect("/admin/home-page-management");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/little_boy_dentist.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="mb-8">
            <Image
              src="/logo_with_text.svg"
              alt="IDCSG Logo"
              width={200}
              height={80}
              className="mx-auto mb-6"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome to IDCSG Admin
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Access your administrative dashboard to manage your dental practice
            efficiently and effectively.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Patient Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Appointment Scheduling</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Content Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Analytics & Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/logo_with_text.svg"
              alt="IDCSG Logo"
              width={150}
              height={60}
              className="mx-auto mb-4"
              priority
            />
          </div>

          {/* Sign In Card */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Sign In to Admin
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access the dashboard
              </p>
            </div>

            <SignInForm />
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>© 2025 IDCSG. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

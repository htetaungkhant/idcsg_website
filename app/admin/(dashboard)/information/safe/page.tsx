import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SafeService } from "@/lib/services/safe-service";
import SafeForm from "./(components)/SafeForm";

export default async function SafePage() {
  // Check authentication and authorization
  const session = await auth();
  if (
    !session ||
    (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
  ) {
    redirect("/admin/sign-in");
  }

  // Fetch existing Safe data
  let safeData = null;
  try {
    safeData = await SafeService.getSafe();
  } catch (error) {
    console.error("Error fetching Safe data:", error);
    // Continue with null data - form will handle creating new record
  }

  return (
    <div className="container">
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safe Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Safe information. The system maintains only one Safe
            record at a time.
          </p>
        </div>

        <SafeForm initialData={safeData} />
      </div>
    </div>
  );
}

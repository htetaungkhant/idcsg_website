import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PreciseService } from "@/lib/services/precise-service";
import PreciseForm from "./(components)/PreciseForm";

export default async function PrecisePage() {
  // Check authentication and authorization
  const session = await auth();
  if (
    !session ||
    (session.user as unknown as Record<string, unknown>)?.role !== "ADMIN"
  ) {
    redirect("/admin/sign-in");
  }

  // Fetch existing Precise data
  let preciseData = null;
  try {
    preciseData = await PreciseService.getPrecise();
  } catch (error) {
    console.error("Error fetching Precise data:", error);
    // Continue with null data - form will handle creating new record
  }

  return (
    <div className="container">
      <div className="max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Precise Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your Precise information. The system maintains only one
            Precise record at a time.
          </p>
        </div>

        <PreciseForm initialData={preciseData} />
      </div>
    </div>
  );
}

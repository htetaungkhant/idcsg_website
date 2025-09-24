import React from "react";
import { PatientInstructionsService } from "@/lib/services/patient-instructions-service";
import PatientInstructionsForm from "./(components)/PatientInstructionsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function PatientInstructionsPage() {
  let initialData = null;
  let error = null;

  try {
    initialData = await PatientInstructionsService.getPatientInstructions();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Failed to load patient instructions data";
    console.error("Failed to fetch patient instructions:", err);
  }

  if (error) {
    return (
      <div className="container">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Patient Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}. Please try refreshing the page or contact support if
                the problem persists.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <PatientInstructionsForm initialData={initialData} />
    </div>
  );
}

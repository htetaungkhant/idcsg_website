import React from "react";
import { FirstVisitService } from "@/lib/services/first-visit-service";
import FirstVisitForm from "./(components)/FirstVisitForm";

export default async function FirstVisitPage() {
  let firstVisitData = null;

  try {
    // Fetch existing FirstVisit data
    firstVisitData = await FirstVisitService.getFirstVisit();
  } catch (error) {
    console.error("Error fetching FirstVisit data:", error);
    // Continue rendering with null data - form will handle creating new data
  }

  return (
    <div className="container">
      <FirstVisitForm initialData={firstVisitData} />
    </div>
  );
}

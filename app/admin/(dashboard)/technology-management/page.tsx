import { Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TechnologyService } from "@/lib/services/technology-service";
import TechnologyManagementContent from "@/app/admin/(dashboard)/technology-management/(components)/TechnologyManagementContent";

// Loading component for Suspense
function TechnologiesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technology Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage dental technologies and their information
          </p>
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex space-x-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Server Component for fetching data
async function TechnologiesList() {
  try {
    const technologies = await TechnologyService.getTechnologies();
    return <TechnologyManagementContent initialTechnologies={technologies} />;
  } catch (error) {
    console.error("Error fetching technologies:", error);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Technology Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage dental technologies and their information
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load technologies"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

export default function TechnologyManagementPage() {
  return (
    <Suspense fallback={<TechnologiesLoadingSkeleton />}>
      <TechnologiesList />
    </Suspense>
  );
}

import { Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCategories } from "@/lib/services/category-service";
import CategoryManagement from "@/app/admin/(dashboard)/category-management/(components)/CategoryManagement";

// Loading component for Suspense
function CategoriesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage categories for your services
          </p>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Server Component for fetching data
async function CategoriesList() {
  try {
    const categories = await getCategories();
    return <CategoryManagement initialCategories={categories} />;
  } catch (error) {
    console.error("Error fetching categories:", error);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Category Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage categories for your services
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load categories"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

export default function CategoryManagementPage() {
  return (
    <Suspense fallback={<CategoriesLoadingSkeleton />}>
      <CategoriesList />
    </Suspense>
  );
}

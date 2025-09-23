import React from "react";
import { ServiceService } from "@/lib/services/service-service";
import { getCategories } from "@/lib/services/category-service";
import ServiceManagementContent from "./(components)/ServiceManagementContent";

export default async function ServiceManagementPage() {
  try {
    // Fetch services and categories in parallel
    const [services, categories] = await Promise.all([
      ServiceService.getServices(),
      getCategories(),
    ]);

    return (
      <ServiceManagementContent
        initialServices={services}
        categories={categories}
      />
    );
  } catch (error) {
    console.error("Error loading service management page:", error);

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Services
          </h2>
          <p className="text-gray-600">
            There was an error loading the services. Please try refreshing the
            page.
          </p>
        </div>
      </div>
    );
  }
}

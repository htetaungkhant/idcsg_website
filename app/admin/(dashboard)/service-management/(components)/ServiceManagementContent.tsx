"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Filter, Edit2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { ServiceWithSections } from "@/lib/services/service-service";
import type { CategoryWithServicesCount } from "@/lib/services/category-service";
import DeleteServiceDialog from "./DeleteServiceDialog";

interface ServiceManagementContentProps {
  initialServices: ServiceWithSections[];
  categories: CategoryWithServicesCount[];
}

export default function ServiceManagementContent({
  initialServices,
  categories,
}: ServiceManagementContentProps) {
  const [services, setServices] =
    useState<ServiceWithSections[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Filtered services based on search and category
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.categoryId === selectedCategory
      );
    }

    return filtered;
  }, [services, searchQuery, selectedCategory]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/services");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch services");
      }

      setServices(result.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch services"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleServiceDeleted = () => {
    fetchServices();
  };

  const getSectionCount = (service: ServiceWithSections): number => {
    let count = 0;
    if (service.section1) count++;
    if (service.section2) count++;
    if (service.section3) count++;
    if (service.section4) count++;
    if (service.section5) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Service Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your services with detailed sections and content
          </p>
        </div>

        <Link href="/admin/service-management/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search services by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 sm:min-w-[200px]">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title} ({category._count?.services || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-sm mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedCategory !== "all"
                  ? "No services found"
                  : "No services yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first service."}
              </p>
              {!searchQuery && selectedCategory === "all" && (
                <Link href="/admin/service-management/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <Badge variant="secondary">
                          {service.category.title}
                        </Badge>
                        <Badge variant="outline">
                          {getSectionCount(service)} section
                          {getSectionCount(service) !== 1 ? "s" : ""}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {service.overview}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.section1 && (
                          <Badge variant="outline" className="text-xs">
                            Section 1
                          </Badge>
                        )}
                        {service.section2 && (
                          <Badge variant="outline" className="text-xs">
                            Video
                          </Badge>
                        )}
                        {service.section3 && (
                          <Badge variant="outline" className="text-xs">
                            Section 3
                          </Badge>
                        )}
                        {service.section4 && (
                          <Badge variant="outline" className="text-xs">
                            Cards ({service.section4.cards.length})
                          </Badge>
                        )}
                        {service.section5 && (
                          <Badge variant="outline" className="text-xs">
                            Pricing ({service.section5.priceRanges.length})
                          </Badge>
                        )}
                      </div>

                      <div className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(service.createdAt).toLocaleDateString()}
                        {service.updatedAt !== service.createdAt && (
                          <>
                            {" "}
                            • Updated:{" "}
                            {new Date(service.updatedAt).toLocaleDateString()}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/admin/service-management/${service.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteServiceDialog
                        service={service}
                        onServiceDeleted={handleServiceDeleted}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filteredServices.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          Showing {filteredServices.length} of {services.length} service
          {services.length !== 1 ? "s" : ""}
          {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
          {selectedCategory !== "all" && (
            <> in {categories.find((c) => c.id === selectedCategory)?.title}</>
          )}
        </div>
      )}
    </div>
  );
}

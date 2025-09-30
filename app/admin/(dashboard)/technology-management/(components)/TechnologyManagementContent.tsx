"use client";

import { useState } from "react";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TechnologyWithSections } from "@/lib/services/technology-service";
import DeleteTechnologyDialog from "./DeleteTechnologyDialog";

interface TechnologyManagementContentProps {
  initialTechnologies: TechnologyWithSections[];
}

export function TechnologyManagementContent({
  initialTechnologies,
}: TechnologyManagementContentProps) {
  const [technologies, setTechnologies] =
    useState<TechnologyWithSections[]>(initialTechnologies);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technology Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage dental technologies and their information
          </p>
        </div>
        <Link href="/admin/technology-management/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Technology
          </Button>
        </Link>
      </div>

      {/* Technologies List */}
      {technologies.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-48 text-muted-foreground">
              <div className="text-6xl mb-4">⚕️</div>
              <h3 className="text-lg font-semibold mb-2">
                No Technologies Found
              </h3>
              <p className="text-sm mb-4">
                Get started by adding your first dental technology. Technologies
                help showcase your advanced equipment and procedures.
              </p>
              <div className="flex justify-center">
                <Link href="/admin/technology-management/create">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Technology
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {technologies.map((technology) => (
            <Card
              key={technology.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Technology Thumbnail */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={technology.imageUrl}
                        alt={technology.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Technology Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold truncate">
                          {technology.title}
                        </h3>

                        {/* Content Indicators */}
                        <div className="flex space-x-1">
                          {technology.description && (
                            <Badge variant="secondary" className="text-xs">
                              Desc
                            </Badge>
                          )}
                          {technology.section1 && (
                            <Badge variant="outline" className="text-xs">
                              Sec1
                            </Badge>
                          )}
                          {technology.cards?.map((_, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {`C${index + 1}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {technology.overview}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(technology.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Link
                        href={`/admin/technology-management/${technology.id}`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit technology</span>
                        </Button>
                      </Link>

                      <DeleteTechnologyDialog
                        technologyId={technology.id}
                        technologyTitle={technology.title}
                        onTechnologyDeleted={() => {
                          setTechnologies(
                            technologies.filter(
                              (tech) => tech.id !== technology.id
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnologyManagementContent;

import { notFound } from "next/navigation";
import { TechnologyService } from "@/lib/services/technology-service";
import BackNavigation from "@/app/admin/(dashboard)/(components)/BackNavigation";
import EditTechnologyForm from "@/app/admin/(dashboard)/technology-management/(components)/EditTechnologyForm";

interface EditTechnologyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTechnologyPage({
  params,
}: EditTechnologyPageProps) {
  const { id } = await params;

  try {
    const technology = await TechnologyService.getTechnologyById(id);

    if (!technology) {
      notFound();
    }

    return (
      <div className="space-y-6">
        {/* Back Navigation */}
        <BackNavigation href="/admin/technology-management" />
        <EditTechnologyForm technology={technology} />
      </div>
    );
  } catch (error) {
    console.error("Error loading technology:", error);
    notFound();
  }
}

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

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <BackNavigation href="/admin/technology-management" />
      <EditTechnologyForm technologyId={id} />
    </div>
  );
}

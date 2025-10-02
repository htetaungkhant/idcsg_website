import { memberService } from "@/lib/services/member-service";
import TeamList from "./(components)/TeamList";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export default async function Teams() {
  const doctors = await memberService.getMembers({
    isActive: true,
    orderBy: "createdAt",
    team: "DOCTORS",
  });

  const consultantSpecialists = await memberService.getMembers({
    isActive: true,
    orderBy: "createdAt",
    team: "CONSULTANT_SPECIALISTS",
  });

  const alliedHealthAndSupportStaff = await memberService.getMembers({
    isActive: true,
    orderBy: "createdAt",
    team: "ALLIED_HEALTH_SUPPORT_STAFF",
  });

  if (
    !doctors ||
    doctors.length < 5 ||
    !consultantSpecialists ||
    consultantSpecialists.length < 5 ||
    !alliedHealthAndSupportStaff ||
    alliedHealthAndSupportStaff.length < 5
  ) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-2xl text-gray-600">
            Our team is being assembled. Please check back soon!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <TeamList
        doctors={doctors}
        consultantSpecialists={consultantSpecialists}
        alliedHealthAndSupportStaff={alliedHealthAndSupportStaff}
      />
    </>
  );
}

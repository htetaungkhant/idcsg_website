"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { PrimaryBtn1 } from "@/components/CustomButtons";
import { Member, TeamType } from "@/app/generated/prisma";
interface TeamFilterProps {
  onSelectTeam?: (team: TeamType) => void;
  className?: string;
}
const TeamFilter: React.FC<TeamFilterProps> = ({ className, onSelectTeam }) => {
  const [activeTeam, setActiveTeam] = useState<TeamType>("DOCTORS");

  const handleTeamSelect = (team: TeamType) => {
    setActiveTeam(team);
    onSelectTeam?.(team);
  };

  return (
    <div
      className={cn(
        "mx-auto w-9/10 p-3 rounded-3xl bg-[#BBC1CF] font-semibold flex justify-between gap-4 xl:gap-8",
        className
      )}
    >
      <button
        className={cn(
          "uppercase flex-1 p-1.5 rounded-2xl cursor-pointer",
          activeTeam === "DOCTORS" ? "bg-[#233259] text-white" : "bg-white"
        )}
        onClick={() => handleTeamSelect("DOCTORS")}
      >
        Doctors
      </button>
      <button
        className={cn(
          "uppercase flex-1 p-1.5 rounded-2xl cursor-pointer",
          activeTeam === "CONSULTANT_SPECIALISTS"
            ? "bg-[#233259] text-white"
            : "bg-white"
        )}
        onClick={() => handleTeamSelect("CONSULTANT_SPECIALISTS")}
      >
        Consultant Specialists
      </button>
      <button
        className={cn(
          "uppercase flex-1 p-1.5 rounded-2xl cursor-pointer",
          activeTeam === "ALLIED_HEALTH_SUPPORT_STAFF"
            ? "bg-[#233259] text-white"
            : "bg-white"
        )}
        onClick={() => handleTeamSelect("ALLIED_HEALTH_SUPPORT_STAFF")}
      >
        Allied Health & Support Staff
      </button>
    </div>
  );
};

interface MemberCardProps {
  member: Member;
  overlay?: boolean;
  onClose?: () => void;
  className?: string;
}
const MemberCard: React.FC<MemberCardProps> = ({
  member,
  overlay = false,
  onClose,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  // disable document scroll
  // React.useEffect(() => {
  //   document.body.style.overflow = "hidden";

  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, []);

  React.useEffect(() => {
    if (member) {
      setTimeout(() => {
        containerRef.current?.classList?.add("opacity-100");
      }, 100);
    }
  }, [member]);

  const handleClose = () => {
    containerRef.current?.classList?.remove("opacity-100");
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-1000 inset-0 opacity-0 transition-all duration-200 ease-in-out"
    >
      {/* overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black invisible opacity-30",
          overlay && "visible"
        )}
      />

      <div
        className={cn(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[300px] max-w-4/5 max-h-[80vh] p-2.5 lg:p-4 text-[#233259] bg-white rounded-2xl border border-[#233259] shadow-lg flex gap-12",
          className
        )}
      >
        <IoClose
          className="absolute top-2 right-2 w-6 h-6 cursor-pointer"
          onClick={handleClose}
        />
        <Image
          src={member.imageUrl || "/dummy-data/doctor.png"}
          alt={member.name}
          width={300}
          height={450}
          className="rounded-2xl w-80 h-auto object-cover flex-shrink-0"
          priority
        />
        <div className="flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div>
            <h3 className="text-3xl font-semibold">{member.name}</h3>
            <p className="text-lg">{member.designation}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <h4 className="font-(family-name:--font-roboto) font-semibold">
              About
            </h4>
            <p className="font-(family-name:--font-roboto)">
              {member.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TeamListProps {
  doctors: Member[];
  consultantSpecialists: Member[];
  alliedHealthAndSupportStaff: Member[];
  className?: string;
}
export default function TeamList({
  doctors,
  consultantSpecialists,
  alliedHealthAndSupportStaff,
  className,
}: TeamListProps) {
  const mobileScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamType>("DOCTORS");

  // Get members based on selected team
  const getFilteredMembers = () => {
    switch (selectedTeam) {
      case "DOCTORS":
        return doctors;
      case "CONSULTANT_SPECIALISTS":
        return consultantSpecialists;
      case "ALLIED_HEALTH_SUPPORT_STAFF":
        return alliedHealthAndSupportStaff;
      default:
        return doctors;
    }
  };

  const members = getFilteredMembers();

  const handleTeamChange = (team: TeamType) => {
    // Reset scroll position when team changes
    if (mobileScrollContainerRef.current) {
      mobileScrollContainerRef.current.scrollTo({
        left: 0,
        behavior: "instant",
      });
    }
    setSelectedTeam(team);
  };

  const handleLeftArrowClick = () => {
    if (mobileScrollContainerRef.current) {
      const cardWidth = (
        mobileScrollContainerRef.current.querySelector(
          ":first-child"
        ) as HTMLElement | null
      )?.offsetWidth;
      if (cardWidth) {
        mobileScrollContainerRef.current.scrollTo({
          left: mobileScrollContainerRef.current.scrollLeft - cardWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const handleRightArrowClick = () => {
    if (mobileScrollContainerRef.current) {
      const cardWidth = (
        mobileScrollContainerRef.current.querySelector(
          ":first-child"
        ) as HTMLElement | null
      )?.offsetWidth;
      if (cardWidth) {
        mobileScrollContainerRef.current.scrollTo({
          left: mobileScrollContainerRef.current.scrollLeft + cardWidth,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <TeamFilter onSelectTeam={handleTeamChange} />
      <div
        ref={mobileScrollContainerRef}
        className="flex overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {members && members.length >= 5 ? (
          members.map((member, index) => (
            <div
              key={`${member.id}-${index}`}
              className="group flex-shrink-0 max-lg:min-w-[300px] w-full lg:w-1/5 h-100 lg:h-120 bg-cover bg-center bg-no-repeat flex overflow-hidden"
              style={{
                backgroundImage: `url(${
                  member.imageUrl || "/dummy-data/doctor.png"
                })`,
              }}
            >
              {/* overlay */}
              {/* <div className="absolute w-[200%] inset-0 bg-black opacity-60"></div> */}

              <div className="min-w-[100%] h-full bg-black opacity-60 group-hover:-translate-x-full transition-all duration-500 ease-in-out"></div>
              <div className="min-w-[100%] h-full px-2.5 py-5 flex flex-col items-end justify-end group-hover:-translate-x-full transition-all duration-500 ease-in-out">
                <PrimaryBtn1 onClick={() => setSelectedMember(member)}>
                  View Details
                </PrimaryBtn1>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-10">
            <p className="text-xl text-gray-600">
              Our team is being assembled. Please check back soon!
            </p>
          </div>
        )}
      </div>
      {selectedMember && (
        <MemberCard
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Mobile Navigation Arrows */}
      <div className={cn("relative flex justify-center mb-8")}>
        <button
          onClick={handleLeftArrowClick}
          className="px-4 py-2 bg-white cursor-pointer rounded-l-2xl hover:shadow-xl transition-all duration-500 ease-in-out"
        >
          <FaArrowLeft className="text-[#545454]" />
        </button>
        <button
          onClick={handleRightArrowClick}
          className="px-4 py-2 bg-white cursor-pointer rounded-r-2xl hover:shadow-xl transition-all duration-500 ease-in-out"
        >
          <FaArrowRight className="text-[#545454]" />
        </button>
      </div>
    </div>
  );
}

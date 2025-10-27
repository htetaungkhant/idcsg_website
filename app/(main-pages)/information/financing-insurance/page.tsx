import React from "react";
import Image from "next/image";

import { CardCollectionStyle3 } from "@/components/CardCollection";
import { CustomCard1 } from "@/components/CustomCard";

const sponsors = [
  {
    id: 1,
    name: "Partner1",
    logoUrl: "/partner1.jpg",
  },
  {
    id: 2,
    name: "Partner2",
    logoUrl: "/partner2.png",
  },
  {
    id: 3,
    name: "Partner3",
    logoUrl: "/partner3.png",
  },
  {
    id: 4,
    name: "Partner4",
    logoUrl: "/partner4.jpg",
  },
  {
    id: 5,
    name: "Partner5",
    logoUrl: "/partner5.png",
  },
  {
    id: 6,
    name: "Partner6",
    logoUrl: "/partner6.png",
  },
];

// This is the individual logo component
const SponsorLogo = ({ logoUrl, name }: { logoUrl: string; name: string }) => (
  <div className="flex-shrink-0 mx-12">
    <Image
      src={logoUrl}
      alt={name}
      width={150}
      height={50}
      className="h-12 sm:h-16 w-auto object-contain filter transition-all duration-300 ease-in-out"
      priority
    />
  </div>
);

export default function FinancingInsurance() {
  return (
    <div className="mx-auto w-[90%] pb-10">
      <CardCollectionStyle3
        title="What is Dental Insurance?"
        imageTitle="Dental Insurance in Singapore"
        image="/3.png"
      >
        <p className="font-(family-name:--font-roboto)">
          Dental insurance is a specialized form of health coverage designed to
          support the cost of dental care. From routine check-ups and cleanings
          to advanced procedures like root canals and implants, it helps reduce
          the financial strain of maintaining good oral health.
          <br />
          <br />
          Most plans include monthly premiums, co-payments, and coverage limits,
          making essential dental services more accessible and affordable.Reach
          out to learn more and find the plan that fits your needs!
        </p>
      </CardCollectionStyle3>

      <section className="mt-32">
        <p className="text-center text-[#233259] text-3xl">
          We partner with respected insurance groups to deliver the best
          experience to you.
        </p>
        <div className="mt-16 relative group w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex w-max animate-scroll-ltr group-hover:[animation-play-state:paused]">
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <SponsorLogo
                key={`ltr-${sponsor.id}-${index}`}
                logoUrl={sponsor.logoUrl}
                name={sponsor.name}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-32 flex flex-col gap-y-8">
        <h1 className="text-[#233259] text-center text-5xl">
          Why is Dental Insurance Important?
        </h1>
        <div className="grid grid-cols-3 gap-x-4 mx-auto">
          <CustomCard1
            icon="/4.svg"
            title="Routine Check-ups & Cleanings"
            description="Dental insurance encourages preventive care by covering essential services like exams and cleanings—helping detect and treat issues early before they become serious."
          />
          <CustomCard1
            icon="/3.svg"
            title="Support for Costly Procedures"
            description="It provides financial coverage for more expensive treatments such as crowns, implants, and veneers, making advanced care more accessible when you need it most."
          />
          <CustomCard1
            icon="/5.svg"
            title="Peace of Mind"
            description="With dental insurance, you’re protected from unexpected dental expenses—allowing you to prioritize your oral health without added financial stress."
          />
        </div>
      </section>
    </div>
  );
}

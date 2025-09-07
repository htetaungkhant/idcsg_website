import React from "react";

import {
  CardCollectionStyle1,
  CardCollectionStyle2,
} from "@/components/CardCollection";

export default function Safe() {
  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">Safe</h1>

      <div className="flex flex-col mt-20">
        <CardCollectionStyle1
          image="/1.png"
          imageTitle="Safety Protocols"
          title="Committed to Your Safety"
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            At IDC, we prioritize your health through rigorous, science-backed
            safety protocols. Every surface in our clinic is cleaned regularly,
            with treatment areas sanitized thoroughly between each patient.
            Instruments undergo a stringent 3-step sterilization process, then
            sealed for individual use. Our air purification system includes
            industrial-grade HEPA and charcoal filters, UV sterilizers, and
            overnight ozone cleaning for clean, safe air. Water used in
            procedures is filtered through a multi-layer system to ensure
            maximum purity. Staff are fully equipped with PPE, and contactless
            check-ins, health declarations, and temperature checks are standard
            procedure. These efforts combine to create a safe, trusted
            environment—so you can focus on your care with complete peace of
            mind.
          </p>
        </CardCollectionStyle1>

        <CardCollectionStyle2
          title="Minimal Contact, Maximum Care"
          image="/2.png"
          imageTitle="Contactless Procedures"
          className="mt-20"
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            IDC embraces digital transformation to enhance patient safety and
            comfort. Our contactless process starts before you arrive—patients
            receive digital health declaration forms and pre-visit registration
            links online. On-site, check-ins are done via mobile devices or QR
            codes, eliminating paperwork and reducing face-to-face interactions.
            Payments are also handled digitally through secure online gateways,
            minimizing the need for physical transactions. All
            communication—from appointment reminders to follow-ups—is
            streamlined through SMS or WhatsApp. This efficient system not only
            saves time but also supports a cleaner, greener clinic. Designed
            with your safety and convenience in mind, our contactless protocols
            allow you to focus entirely on your treatment, knowing your
            well-being is protected from start to finish.
          </p>
        </CardCollectionStyle2>

        <CardCollectionStyle1
          image="/1.png"
          imageTitle="Sterilization Techniques"
          title="Sterilization at the Highest Standards"
          bgCardColor="bg-gradient-to-b from-[#B2966D] to-[#967253]"
          className="mt-40"
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            At IDC, sterilization isn’t just a protocol—it’s a philosophy of
            precision and responsibility. Every instrument used during your
            treatment goes through a meticulous 3-step sterilization process:
            cleaning, disinfection, and high-pressure autoclaving. This ensures
            all tools are completely germ-free before being individually
            packaged. Treatment rooms are cleaned after each patient, and
            non-clinical surfaces are sanitized multiple times a day. Our
            equipment is regularly maintained and tracked with sterilization
            indicators for safety assurance. Biohazard waste is disposed of
            separately following international standards. These practices are
            rooted in decades of experience, helping us maintain a pristine,
            secure clinical environment you can trust.
          </p>
        </CardCollectionStyle1>
      </div>
    </div>
  );
}

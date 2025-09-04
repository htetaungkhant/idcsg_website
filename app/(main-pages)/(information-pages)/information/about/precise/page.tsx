import React from "react";

import {
  CardCollectionStyle1,
  CardCollectionStyle2,
} from "@/components/CardCollection";

export default function Precise() {
  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">Precise</h1>

      <div className="flex flex-col mt-20">
        <CardCollectionStyle1
          image="/dummy-data/1.png"
          imageTitle="Advanced Diagnostics:"
          title={
            <h3 className="font-(family-name:--font-ubuntu) font-bold text-2xl text-center">
              Precision Begins with
              <br />
              Better Diagnostics
            </h3>
          }
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            At IDC, precision care starts with accurate, early diagnosis. Our
            state-of-the-art imaging suite includes low-radiation digital
            radiographs and 3D Cone Beam CT scans that offer detailed visuals of
            your teeth, jaws, and supporting structures. These diagnostic tools
            allow us to identify problems invisible to the naked eye and craft
            treatment plans tailored to your anatomy.
            <br />
            <br />
            Every radiograph is reviewed thoroughly by our experienced
            clinicians to ensure nothing is missed. Combined with thorough
            clinical exams and advanced software, we turn uncertainty into
            confidence—giving you clarity and control over your dental health
            from the start.
          </p>
        </CardCollectionStyle1>

        <CardCollectionStyle2
          title="Where Innovation Meets Care"
          image="/dummy-data/2.png"
          imageTitle="Technology in Treatment"
          className="mt-20"
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            At IDC, technology is not just an add-on—it’s integral to how we
            deliver exceptional care. We harness modern dental advancements to
            elevate every aspect of treatment. From 3D digital scans and
            computer-guided surgeries to laser-assisted procedures and in-house
            CAD/CAM restorations, our high-tech approach improves precision,
            safety, and comfort. Digital workflows eliminate messy impressions,
            shorten turnaround times, and ensure optimal fit and function.
            <br />
            <br />
            By integrating innovation with our expert team’s experience, we
            deliver personalized treatments that are accurate, minimally
            invasive, and tailored to your long-term oral health. Innovation
            here isn’t about machines—it’s about enhancing the human experience.
          </p>
        </CardCollectionStyle2>

        <CardCollectionStyle1
          image="/dummy-data/1.png"
          imageTitle="Experience & Expertise"
          title="Experience That Builds Trust"
          bgCardColor="bg-gradient-to-b from-[#B2966D] to-[#967253]"
          className="mt-40"
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            With decades of clinical experience and a passion for ongoing
            education, our team at IDC brings deep expertise to every patient
            interaction. Each diagnosis and treatment is guided by years of
            hands-on practice and continuous learning across dental disciplines.
            We believe precision is born from mastery—and that comes through
            patient dedication, collaborative care, and attention to the
            smallest detail.
            <br />
            <br />
            Our team includes specialists across fields who come together to
            develop effective, long-term treatment strategies tailored to your
            unique case. Whether it’s routine care or complex procedures, you
            can feel confident knowing your smile is in skilled, thoughtful
            hands.
          </p>
        </CardCollectionStyle1>
      </div>
    </div>
  );
}

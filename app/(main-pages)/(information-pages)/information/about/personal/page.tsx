import React from "react";

import {
  CardCollectionStyle1,
  CardCollectionStyle2,
} from "@/components/CardCollection";

export default function Personal() {
  return (
    <div className="mx-auto w-[90%] pb-10">
      <h1 className="text-6xl text-[#233259] font-semibold">Personal</h1>

      <div className="flex flex-col mt-20">
        <CardCollectionStyle1
          image="/1.png"
          imageTitle="Personalised Care Approach"
          title="Care Built Around You"
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            At IDC, dental care is deeply personal. We reject the
            one-size-fits-all model and craft every diagnosis and treatment plan
            around your individual health goals, concerns, and lifestyle. Our
            team takes time to listen and build trust, ensuring your voice is
            central in every step of the journey. Whether you need preventive
            care or complex treatment, we align your dental experience with a
            strategic, long-term outlook on your overall wellbeing.
            <br />
            <br />
            For us, it’s not just about teeth—it’s about the whole person behind
            the smile. Through empathy, respect, and personalised attention, we
            build relationships that support lasting oral health and peace of
            mind.
          </p>
        </CardCollectionStyle1>

        <CardCollectionStyle2
          title="Collaborative Specialist Team"
          image="/2.png"
          imageTitle="Collaborative Specialist Team"
          className="mt-20"
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            At IDC, we believe better outcomes come from shared expertise.
            That’s why we operate as a unified, multidisciplinary team of
            specialists—each with deep knowledge in their respective fields
            including orthodontics, prosthodontics, periodontics, surgery, and
            more. This collaborative model allows us to look at your case from
            multiple angles, ensuring that no detail is overlooked. Every
            treatment plan is reviewed collectively to align with your goals and
            deliver the best possible results. You benefit from comprehensive
            care, continuity, and coordinated treatment—all in one location,
            under the expert supervision of a team that works as one. This
            approach minimizes errors, improves efficiency, and ensures that
            even complex cases are managed with precision, foresight, and a deep
            understanding of your unique needs.
          </p>
        </CardCollectionStyle2>

        <CardCollectionStyle1
          image="/1.png"
          imageTitle="One-Stop Wellness Destination"
          title={
            <h3 className="font-(family-name:--font-ubuntu) font-bold text-2xl text-center">
              Comprehensive Services
              <br />
              Under One Roof
            </h3>
          }
          bgCardColor="bg-gradient-to-b from-[#B2966D] to-[#967253]"
          className="mt-40"
        >
          <p className="font-(family-name:--font-old-standard-tt)">
            At IDC, we aim to make your healthcare experience seamless and
            efficient. That’s why we offer a wide range of services under one
            roof—not just dental treatments, but also complementary care such as
            travel vaccinations, aesthetic procedures like fillers and lasers,
            on-site prescription dispensing, and more.
            <br />
            <br />
            This integrated setup minimizes the need for multiple appointments
            at different clinics, saving you time and hassle. Whether you need a
            routine checkup, advanced dental work, or additional health
            services, you’ll find them all here in one place. Our goal is to
            provide holistic, concierge-style care that’s personalised,
            convenient, and built around your schedule.
          </p>
        </CardCollectionStyle1>
      </div>
    </div>
  );
}

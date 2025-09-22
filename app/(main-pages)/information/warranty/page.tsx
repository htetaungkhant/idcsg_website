import React from "react";
import Image from "next/image";

import { CardCollectionStyle3 } from "@/components/CardCollection";
import { CustomCard1 } from "@/components/CustomCard";

export default function Warranty() {
  return (
    <div className="mx-auto w-[90%] pb-10">
      <CardCollectionStyle3
        title="Peace of Mind at IDC"
        imageTitle="Warranty"
        image="/3.png"
      >
        <p className="font-(family-name:--font-old-standard-tt)">
          Dental treatment is an investment in your long-term health. At IDC, we
          take that responsibility seriously by delivering care that’s not only
          high quality—but built to last.
          <br />
          <br />
          We stand by the treatments we provide with confidence in our
          techniques, materials, and standards. That’s why we’re proud to offer
          a dental warranty—a commitment to both your health and your peace of
          mind.
          <br />
          <br />
          Let us help you protect your smile, your wellbeing, and the care
          you’ve chosen to invest in.
        </p>
      </CardCollectionStyle3>

      <section className="mt-12 flex flex-col gap-y-8">
        <h1 className="text-[#233259] text-center text-5xl">
          Treatments Covered under our Dental Warranty
        </h1>
        <div className="flex gap-x-14">
          <div className="flex-1 px-4 py-4 rounded-2xl shadow-lg bg-white flex flex-col gap-y-4">
            <h2 className="font-(family-name:--font-poppins) font-bold text-xl">
              Bridge, Crown and Veneer Warranty
            </h2>
            <div className="flex gap-x-6">
              <div className="w-[32%]">
                <Image
                  src="/5year_warranty.png"
                  alt="5 Year Warranty"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <ul className="list-disc list-inside flex-1 font-(family-name:--font-old-standard-tt) flex flex-col gap-y-2 leading-5">
                <li>
                  5 year warranty applies if, under normal conditions, the
                  dental restoration breaks, loosens, cracks or dislodges.
                </li>
                <li>
                  Replacement with a similar or better material is covered
                </li>
                <li>
                  It does not cover the treatment cost of root canal treatments
                  (if needed thereafter) nor the breakage/fracture of the
                  natural tooth supporting it.
                </li>
                <li>
                  The warranty does not cover in cases whereby the dentist has
                  advised the patient beforehand that the restoration may not
                  last due to tooth/gum/bite factors.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-1 px-4 py-4 rounded-2xl shadow-lg bg-white flex flex-col gap-y-4">
            <h2 className="font-(family-name:--font-poppins) font-bold text-xl">
              Dental Implant Warranty Plan
            </h2>
            <div className="flex gap-x-6">
              <div className="w-[32%]">
                <Image
                  src="/10year_warranty.png"
                  alt="10 Year Warranty"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
              <ul className="list-disc list-inside flex-1 font-(family-name:--font-old-standard-tt) flex flex-col gap-y-2 leading-5">
                <li>
                  10 year warranty applies if the entire procedure was done at
                  our clinic, including the bone grafting, implant placement and
                  crown.
                </li>
                <li>
                  Replacement with a similar or better material is covered
                </li>
                <li>
                  It does not cover the treatment cost of root canal treatments
                  (if needed thereafter) nor the breakage/fracture of the
                  natural tooth supporting it.
                </li>
                <li>
                  The warranty does not cover in cases whereby the dentist has
                  advised the patient beforehand that the restoration may not
                  last due to tooth/gum/bite factors.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 flex flex-col gap-y-8">
        <h1 className="text-[#233259] text-center text-5xl">
          The Patient’s Commitment
        </h1>
        <div className="grid grid-cols-3 gap-x-4 mx-auto">
          <CustomCard1
            icon="/1.svg"
            title="Regular Checkup And Cleaning"
            description="Bacteria builds up on the teeth naturally after some time, which cannot be removed by just brushing. This can cause tooth decay and gum disease. Regular Checkup for decay and other issues at least once every 6 months."
          />
          <CustomCard1
            icon="/2.svg"
            title="Good Oral Hygiene"
            description="Maintain good oral hygiene by brushing and flossing your teeth twice a day, and following any special instructions your dentist or hygienist has given you to keep your teeth and gums clean and healthy."
          />
          <CustomCard1
            icon="/3.svg"
            title="Tell Us Immediately"
            description="Please notify us and come in for a check immediately if you encounter any problems after the treatment. Any delay may result in more damage to the condition and may void the warranty."
          />
        </div>
      </section>

      <section className="mt-12 flex gap-x-4 p-4 rounded-2xl shadow-lg bg-white">
        <div className="w-[30%] min-w-[300px] flex flex-col gap-y-8 bg-[#DADADA] rounded-2xl p-4">
          <h1 className="text-[#233259] text-5xl">
            Limited Dental Warranty: Terms & Conditions
          </h1>
          <div className="font-(family-name:--font-old-standard-tt)">
            <p className="text-[#ED1C24]">Please Note:</p>
            <p>
              This warranty does not cover travel, accommodation, or any
              indirect/consequential costs. Routine maintenance over the
              lifespan of the dental work is also not included.
            </p>
          </div>
        </div>
        <div className="flex-1 flex-col text-[#233259]">
          <h2 className="text-3xl">Warranty May Be Void If:</h2>
          <ul className="mt-5 list-disc list-inside flex-1 font-(family-name:--font-old-standard-tt) flex flex-col gap-y-2">
            <li>
              Routine dental check-ups are missed (every 6 months, or 3–4 months
              for gum disease).
            </li>
            <li>
              The treatment had a previously advised and accepted guarded
              prognosis.
            </li>
            <li>There is poor oral hygiene or neglect by the patient.</li>
            <li>
              Post-treatment care instructions from the dentist are not
              followed.
            </li>
            <li>Trauma or accidents impact the treated area.</li>
            <li>
              Medical conditions (e.g., smoking, diabetes, osteoporosis)
              contribute to failure.
            </li>
            <li>
              Damage occurs due to misuse (e.g., chewing hard items,
              self-adjustments).
            </li>
            <li>A required night guard/splint is not worn as advised.</li>
            <li>
              The dental work was altered elsewhere without prior notice or
              approval.
            </li>
            <li>
              Any unforeseeable circumstance beyond the dentist’s control.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

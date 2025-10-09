import React from "react";

import { ServiceService } from "@/lib/services/service-service";
import PaymentForm from "./(components)/PaymentForm";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export default async function Pay() {
  const services = await ServiceService.getServices();

  return (
    <div className="pb-10">
      <div className="relative flex justify-center py-8 lg:py-16">
        <div className="absolute w-[70%] min-w-[280px] inset-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#2E374E] to-[#314765]" />
        <PaymentForm className="w-[85%]" services={services} />
      </div>
    </div>
  );
}

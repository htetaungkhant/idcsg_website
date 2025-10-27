"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { paymentFormSchema, PaymentFormSchema } from "@/lib/schema";
import { ServiceWithSections } from "@/lib/services/service-service";

interface PaymentFormProps {
  services: ServiceWithSections[];
  className?: string;
}
export default function PaymentForm({ className, services }: PaymentFormProps) {
  const form = useForm<PaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name: "",
      emailId: "",
      mobileNumber: "",
      serviceType: "",
      paymentMethod: undefined,
      amount: 0,
    },
  });

  function onSubmit(values: PaymentFormSchema) {
    console.log(values);
    // Handle form submission here
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "min-w-[300px] min-[375px]:min-w-[330px] px-3 py-3 lg:px-6 lg:py-4 bg-gradient-to-r from-[#FFFFFF] to-[#CFDFFF] border border-[#A8A7A7] rounded-2xl shadow-xl relative",
          className
        )}
      >
        <div className="flex justify-between gap-5">
          <h1 className="text-3xl lg:text-4xl font-medium font-(family-name:--font-roboto)">
            Pay for Your Dental Service
          </h1>
          <div className="max-w-[40px] max-h-[40px] bg-white border border-[#ABABAB] rounded-full p-2.5 transition-all duration-300 rotate-45 text-8xl">
            <svg
              className="w-full h-full text-[#233259] transition-all duration-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3 lg:gap-y-4 mt-5">
          {/* Name and Email */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="whitespace-nowrap text-sm sm:text-base lg:text-lg">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    className="max-sm:text-xs bg-white border-[#8D8B8B] rounded-sm lg:h-10 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emailId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="whitespace-nowrap text-sm sm:text-base lg:text-lg">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    {...field}
                    className="max-sm:text-xs bg-white border-[#8D8B8B] rounded-sm lg:h-10 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />

          {/* Mobile Number and Service Type */}
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="whitespace-nowrap text-sm sm:text-base lg:text-lg">
                  Mobile Number
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="gb"
                    value={field.value}
                    onChange={field.onChange}
                    className="rounded-[3px] focus-within:border-gray-600 border border-[#8D8B8B] h-9 lg:h-10"
                    inputClassName="w-full h-full! border-none!"
                    countrySelectorStyleProps={{
                      buttonClassName: "h-full! border-none!",
                    }}
                  />
                </FormControl>
                <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="whitespace-nowrap text-sm sm:text-base lg:text-lg">
                  Service Type
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border border-[#8D8B8B] bg-white rounded-sm h-9 lg:h-10 focus-visible:outline-none"
                  >
                    <option value="" disabled>
                      Select service
                    </option>
                    {services?.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />

          {/* Payment method and Amount */}
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="whitespace-nowrap text-sm sm:text-base lg:text-lg">
                  Payment Method
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-y-1.5">
                    <label className="w-full bg-white h-8 lg:h-10 flex items-center gap-2 px-2 border border-[#8D8B8B] rounded-sm hover:border-gray-400 cursor-pointer">
                      <input
                        type="radio"
                        {...field}
                        value="credit_debit_card"
                        className=""
                      />
                      Credit/Debit Card
                    </label>
                    <label className="w-full bg-white h-8 lg:h-10 flex items-center gap-2 px-2 border border-[#8D8B8B] rounded-sm hover:border-gray-400 cursor-pointer">
                      <input
                        type="radio"
                        {...field}
                        value="paynow_upi"
                        className=""
                      />
                      PayNow UPI
                    </label>
                    <label className="w-full bg-white h-8 lg:h-10 flex items-center gap-2 px-2 border border-[#8D8B8B] rounded-sm hover:border-gray-400 cursor-pointer">
                      <input
                        type="radio"
                        {...field}
                        value="internet_banking"
                        className=""
                      />
                      Internet Banking
                    </label>
                    <label className="w-full bg-white h-8 lg:h-10 flex items-center gap-2 px-2 border border-[#8D8B8B] rounded-sm hover:border-gray-400 cursor-pointer">
                      <input
                        type="radio"
                        {...field}
                        value="paypal"
                        className=""
                      />
                      PayPal
                    </label>
                    <label className="w-full bg-white h-8 lg:h-10 flex items-center gap-2 px-2 border border-[#8D8B8B] rounded-sm hover:border-gray-400 cursor-pointer">
                      <input
                        type="radio"
                        {...field}
                        value="mobile_wallet"
                        className=""
                      />
                      Mobile Wallet
                    </label>
                  </div>
                </FormControl>
                <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-between">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="whitespace-nowrap text-sm sm:text-base lg:text-lg">
                    Amount (SGD)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount (SGD)"
                      {...field}
                      className="max-sm:text-xs bg-white border-[#8D8B8B] rounded-sm lg:h-10 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-4 bg-[#233259] text-white text-sm lg:text-base py-2 lg:py-3 px-4 rounded-2xl w-full lg:w-100 ml-auto"
            >
              <span>MAKE PAYMENT</span>
              <ArrowRight className="text-white h-6 w-6" />
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
}

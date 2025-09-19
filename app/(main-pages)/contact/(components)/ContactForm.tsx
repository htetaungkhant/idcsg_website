"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ContactFormSchema, contactFormSchema } from "@/lib/schema";

interface ContactFormProps {
  className?: string;
}
export default function ContactForm({ className }: ContactFormProps) {
  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      emailId: "",
      mobileNumber: "",
      message: "",
    },
  });

  function onSubmit(values: ContactFormSchema) {
    console.log(values);
    // Handle form submission here
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full", className)}
      >
        <div className="relative px-6 py-6 pr-0 flex flex-col gap-6">
          <div className="absolute w-[93%] inset-0 bg-gradient-to-r from-[#FFFFFF] to-[#CFDFFF] border border-[#A8A7A7] rounded-2xl shadow-xl" />

          <div className="flex justify-between w-[90%]">
            <h1 className="relative text-4xl font-medium font-(family-name:--font-ubuntu)">
              Write us a message
            </h1>
            <div className="w-12 h-12 bg-white border border-[#ABABAB] rounded-full p-2.5 transition-all duration-300 rotate-45 text-8xl">
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
          <div className="relative flex gap-8">
            <div className="flex-1">
              <div className="space-y-5">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="whitespace-nowrap text-lg">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            {...field}
                            className="max-sm:text-xs border-[#8D8B8B] rounded-sm h-10 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 focus-visible:ring-0"
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
                        <FormLabel className="whitespace-nowrap text-lg">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@gmail.com"
                            {...field}
                            className="max-sm:text-xs border-[#8D8B8B] rounded-sm h-10 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 focus-visible:ring-0"
                          />
                        </FormControl>
                        <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mobile Number and Email Row */}
                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="whitespace-nowrap text-lg">
                          Mobile Number
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            defaultCountry="gb"
                            value={field.value}
                            onChange={field.onChange}
                            className="rounded-[3px] focus-within:border-gray-600 border border-[#8D8B8B] h-10"
                            inputClassName="w-full h-full! bg-transparent! border-none!"
                            countrySelectorStyleProps={{
                              buttonClassName: "h-full! border-none!",
                            }}
                          />
                        </FormControl>
                        <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Message Row */}
                <div className="grid grid-cols-1">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message"
                            {...field}
                            className="border-[#8D8B8B] rounded-sm h-48 text-gray-800 md:text-xl placeholder:text-[#0C1725] focus:border-gray-400 focus:ring-0 focus-visible:ring-0"
                          />
                        </FormControl>
                        <FormMessage className="-mt-1 text-[10px] sm:text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <Link
              href="https://www.google.com/maps/place/International+Dental+Centre+Pte+Ltd/@1.282558,103.846992,14z/data=!4m6!3m5!1s0x31da190cfc9866a1:0x42565d78ea85c125!8m2!3d1.282558!4d103.846992!16s%2Fg%2F1wk7nd23?hl=en&entry=ttu&g_ep=EgoyMDI1MDgzMC4wIKXMDSoASAFQAw%3D%3D"
              className="flex-1 flex justify-center h-fit"
            >
              <Image
                src="/map.svg"
                alt="Map"
                width={500}
                height={300}
                className="w-full h-auto max-h-80 object-cover rounded-4xl shadow-lg"
              />
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-5 relative flex justify-end">
          <button
            type="submit"
            className="px-6 py-3.5 uppercase border border-black bg-white text-[#233259] text-xl font-sans font-medium rounded-xl flex gap-3 items-center justify-between hover:bg-gray-100 cursor-pointer"
          >
            <span>SEND MESSAGE</span>
            <ArrowRight className="text-[#233259] h-8 w-8" />
          </button>
        </div>
      </form>
    </Form>
  );
}

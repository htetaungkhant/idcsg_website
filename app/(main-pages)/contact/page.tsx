import React from "react";
import ContactForm from "./(components)/ContactForm";

export default function Contact() {
  return (
    <div className="relative flex justify-center pt-24 pb-4">
      <div className="absolute w-[70%] min-w-[280px] inset-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#2E374E] to-[#314765]" />
      <ContactForm className="w-[85%]" />
    </div>
  );
}

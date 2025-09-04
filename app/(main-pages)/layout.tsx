import Header from "@/components/Header";
import React from "react";

export default function MainPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header color="white" className="max-w-390" />
      <section className="mx-auto max-w-400 min-h-screen pt-24 lg:pt-40 bg-[#D1DBE3]">
        {children}
      </section>
    </>
  );
}

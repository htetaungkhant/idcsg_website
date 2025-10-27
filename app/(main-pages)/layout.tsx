import React from "react";
import Header from "@/components/Header";
import { HomepageSettingsService } from "@/lib/services/homepage-settings-service";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

// Revalidate this layout every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60; // instant updates (0 seconds delay), Dynamic rendering on every request

export default async function MainPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch homepage settings to get background color and opacity
  const homepageSettings = await HomepageSettingsService.getActiveSettings();
  const backgroundColor = homepageSettings?.backgroundColor || "#D1DBE3";
  const opacity = homepageSettings?.backgroundOpacity ?? 100;

  return (
    <>
      <Header color="white" className="max-w-390" />
      <section
        className="flex flex-col mx-auto max-w-400 min-h-screen pt-16 lg:pt-30"
        style={{ backgroundColor, opacity: opacity / 100 }}
      >
        <div className="px-4 py-2.5 lg:py-5 flex justify-center">
          <Breadcrumb />
        </div>
        <div className="flex-1">{children}</div>
        <Footer className="bg-white text-[#515050] border-[#B0B0B0]" />
      </section>
    </>
  );
}

import React from "react";
import Header from "@/components/Header";
import { HomepageSettingsService } from "@/lib/services/homepage-settings-service";

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
        className="mx-auto max-w-400 min-h-screen pt-24 lg:pt-40"
        style={{ backgroundColor, opacity: opacity / 100 }}
      >
        {children}
      </section>
    </>
  );
}

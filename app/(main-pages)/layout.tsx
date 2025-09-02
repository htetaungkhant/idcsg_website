import React from "react";

export default function MainPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="min-h-screen bg-[#D1DBE3]">{children}</section>;
}

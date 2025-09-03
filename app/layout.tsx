import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Oswald,
  Old_Standard_TT,
  Poppins,
  Ubuntu,
  Ubuntu_Condensed,
} from "next/font/google";
import "react-international-phone/style.css";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const oldStandardTT = Old_Standard_TT({
  variable: "--font-old-standard-tt",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const ubuntuCondensed = Ubuntu_Condensed({
  variable: "--font-ubuntu-condensed",
  subsets: ["latin"],
  weight: ["400"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "International Dental Centre",
  description: "Providing quality dental care services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${oldStandardTT.variable} ${poppins.variable} ${ubuntu.variable} ${ubuntuCondensed.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="font-(family-name:--font-oswald)">{children}</main>
      </body>
    </html>
  );
}

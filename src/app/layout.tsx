import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Pacôme Pertant ✲ Portfolio",
  description:
    "I'm Pacome Pertant, motion and sound designer based in Paris. I move shapes and sound to create emotional content. Always playing with rhythm, sound and visual narrative on a 2D and/or 3D canvas. Clean at times, experimental at others.",
  keywords: [
    "motion designer",
    "sound designer",
    "freelance",
    "Paris",
    "France",
    "after effects",
    "cinema 4d",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0A0A0A] text-[#FAFAFA] font-sans">
        {children}
      </body>
    </html>
  );
}

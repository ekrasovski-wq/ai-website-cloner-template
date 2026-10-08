import type { Metadata } from "next";
import "./globals.css";
import GradualBlur from "@/components/GradualBlur";
import { ThemeToggle } from "@/components/ThemeToggle";

// Apply the saved theme before first paint so there's no light/dark flash.
// Dark is the default (no attribute); only "light" is set explicitly.
const themeScript = `try{if(localStorage.getItem('theme')==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}`;

export const metadata: Metadata = {
  title: "Elene Krasowski",
  description: "visual & UI/UX designer based in Tbilisi",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Variable font for the VariableProximity effect on /about */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ThemeToggle />
        {/* Soft blur strip behind the fixed header (logo + menu). target=page
            keeps it fixed to the top; zIndex sits below the logo (z-20) and
            menu (z-30/40) but above page content. */}
        <GradualBlur
          position="top"
          height="7rem"
          strength={2}
          divCount={6}
          curve="bezier"
          target="page"
          zIndex={-90}
        />
      </body>
    </html>
  );
}

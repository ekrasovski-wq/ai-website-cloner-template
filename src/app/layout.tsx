import type { Metadata } from "next";
import "./globals.css";
import GradualBlur from "@/components/GradualBlur";

export const metadata: Metadata = {
  title: "Pacôme Pertant ✲ Portfolio",
  description: "motion & sound designer based in paris",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Variable font for the VariableProximity effect on /about */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
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

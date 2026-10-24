import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haven — Immediate Calming, Somatic Grounding & Crisis Lifeline",
  description:
    "Free, confidential, zero-friction crisis support. Interactive breathing orb, 5-4-3-2-1 grounding exercises, and instant 1-tap connection to 988 and international crisis lines.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#090d16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

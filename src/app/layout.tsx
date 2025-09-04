import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DnD Viewer - Character Manager für Dungeons & Dragons",
  description:
    "Der ultimative Character-Viewer für Dungeons & Dragons. Verwalte deine Helden, plane deine Abenteuer und erlebe epische Geschichten wie nie zuvor.",
  keywords: [
    "D&D",
    "Dungeons and Dragons",
    "Character Manager",
    "RPG",
    "Tabletop",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

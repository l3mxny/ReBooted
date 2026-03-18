import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import PanicButton from "@/components/PanicButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReBooted - Never too late to reboot",
  description: "A learning platform for seniors to master digital skills",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <ProgressProvider>
            {children}
            <PanicButton />
          </ProgressProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

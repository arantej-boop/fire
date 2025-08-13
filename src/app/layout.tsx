import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forest Fire Monitor Spain - Real-time Wildfire Tracking",
  description: "Real-time visualization of forest fires in Spain using NASA FIRMS data. Monitor active wildfires, view statistics, and track fire hotspots across Spain.",
  keywords: ["forest fires", "wildfires", "Spain", "NASA FIRMS", "fire monitoring", "real-time", "visualization"],
  authors: [{ name: "Forest Fire Monitor" }],
  openGraph: {
    title: "Forest Fire Monitor Spain - Real-time Wildfire Tracking",
    description: "Real-time visualization of forest fires in Spain using NASA FIRMS data",
    url: "https://chat.z.ai",
    siteName: "Forest Fire Monitor Spain",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forest Fire Monitor Spain",
    description: "Real-time visualization of forest fires in Spain using NASA FIRMS data",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

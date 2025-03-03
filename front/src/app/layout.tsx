"use client";

import { Kodchasan, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BeePatern from "@/components/BeePatern";
import Providers from "./Providers";
import { Toaster } from "react-hot-toast";
import { AuthAwareLayout } from "@/components/AuthAwareLayout";

const kodchasan = Kodchasan({
  variable: "--font-kodchasan",
  weight: "400",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>

      <body className={`${geistSans.variable} ${geistMono.variable} ${kodchasan.variable} antialiased`}>
        <Toaster />
        <Providers>
          <AuthAwareLayout
         
            navbar={
              <header>
                <Navbar />
              </header>
            }
            beePattern={<BeePatern />}
            publicPaths={["/", "/login", "/register"]}
          >
            {children}
          </AuthAwareLayout>
        </Providers>
      </body>
    </html>
  );
}
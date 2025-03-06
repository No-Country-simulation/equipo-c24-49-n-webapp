"use client";

import { Kodchasan, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BeePatern from "@/components/BeePatern";
import Providers from "./Providers";
import { Toaster } from "react-hot-toast";
// import { AuthAwareLayout } from "@/components/AuthAwareLayout";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  // 🛑 Excluir el layout global en `/api-doc`
  if (pathname.startsWith("/api-doc")) {
    return <>{children}</>;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Panal - Gestor de Tareas</title>
        <meta name="description" content="Gestor de Tareas Colaborativo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kodchasan.variable} antialiased`}
      >
        <Toaster />
        <Providers>
          <header>
            <Navbar />
          </header>
          <BeePatern />
          {/* <AuthAwareLayout
            navbar={
          <header>
            <Navbar />
          </header>
            }
            beePattern={<BeePatern />}
            publicPaths={["/", "/login", "/register"]}
          > */}
          {children}
          {/* </AuthAwareLayout> */}
        </Providers>
      </body>
    </html>
  );
}

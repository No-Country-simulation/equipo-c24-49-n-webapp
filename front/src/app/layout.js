import { Kodchasan, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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

export const metadata = {
  title: "Gestor de Tareas",
  description: "Gestor de Tareas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="fixed max-w-7xl mx-auto top-[26px] left-0 right-0 backdrop-blur-sm z-50">
          <Navbar />
        </header>

        {children}
        <div className="absolute w-full bottom-0 -z-10 overflow-hidden pointer-events-none">
          <img src="/bee-pattern.svg" className="w-full object-cover" />
        </div>
      </body>
    </html>
  );
}

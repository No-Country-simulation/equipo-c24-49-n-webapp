"use client"

import NavBarDashboard from "@/components/NavBarDashboard"
import Sidebar from "@/components/Sidebar"
import { Geist, Geist_Mono, Kodchasan } from "next/font/google";


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

export default function Layout({ children }) {
  return (

    <main className={`${geistSans.variable} ${geistMono.variable} ${kodchasan.variable}  relative flex flex-row w-full min-h-screen`}>
      <Sidebar />
      <div className="flex-1">
        <header className="w-full">
          <NavBarDashboard />
        </header>
        {children}
      </div>
    </main>

  )
}
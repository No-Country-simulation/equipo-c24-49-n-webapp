"use client"

import NavBarDashboard from "@/components/NavBarDashboard"
import Sidebar from "@/components/Sidebar"


export default function Layout({ children }) {
  return (

    <main className="relative flex flex-row w-full min-h-screen">
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
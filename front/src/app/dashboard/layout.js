"use client"

import Sidebar from "@/components/Sidebar"


export default function Layout({ children }) {
  return (
      <main className="relative flex flex-row w-full min-h-screen">
        <Sidebar/>
        <div className="flex-1">
          {children}
        </div>
      </main>
  )
}
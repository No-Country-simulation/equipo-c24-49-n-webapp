"use client"

import Sidebar from "@/components/Sidebar"


export default function Layout({ children }) {
  return (
      <main className="flex flex-row">
        <Sidebar/>
        {children}
      </main>
  )
}
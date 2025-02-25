"use client"

import Sidebar from "@/components/Sidebar"


export default function Layout({ children }) {
  return (
      <main>
        <Sidebar/>
        {children}
      </main>
  )
}
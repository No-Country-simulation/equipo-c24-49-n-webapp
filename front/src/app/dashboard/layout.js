"use client"

import Sidebar from "@/components/SideBar"

export default function Layout({ children }) {
  return (
      <main>
        <Sidebar/>
          {children}
      </main>
  )
}
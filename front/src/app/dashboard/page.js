"use client"

import NavBarDashboard from "@/components/NavBarDashboard";
import { kodchasan } from "@/components/ui/fonts";
import DashboardCard from "@/components/UserCard";

export default function Page() {
  return (
    <div className="flex flex-col item-center text-secondary-content">
      <header className="w-full">
        <NavBarDashboard/>
      </header>
      
      <section className={`${kodchasan.className}`}>
        <h1 className={`${kodchasan.className} ml-28 text-[24px]`}>
          Escritorio
        </h1>
        <DashboardCard/>
      </section>

      <section className="flex flex-row justify-between ml-16 mt-10 mr-14 mb-10">
        <img src="./ejemplo-progreso.svg" alt="Imagen ejemplo progreso"/>
        <img src="./ejemplo-calendario.svg" alt="Imagen ejemplo calendario"/>
      </section>
    </div>
  )
}

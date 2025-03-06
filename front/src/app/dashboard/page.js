"use client"

import { kodchasan } from "@/components/ui/fonts";
import DashboardCard from "@/components/UserCard";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col item-center text-secondary-content">
            
      <section className={`${kodchasan.className}`}>
        <h1 className={`${kodchasan.className} ml-28 text-[24px]`}>
          Escritorio
        </h1>
        <DashboardCard/>
      </section>

      <section className="flex flex-row justify-between ml-16 mt-10 mr-14 mb-10">
        <Image src="./ejemplo-progreso.svg" alt="Imagen ejemplo progreso"/>
        <Image src="./ejemplo-calendario.svg" alt="Imagen ejemplo calendario"/>
      </section>
    </div>
  )
}

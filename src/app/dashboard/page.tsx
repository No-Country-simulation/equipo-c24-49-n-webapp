"use client"

import Loader from "@/components/Loader";
import { kodchasan } from "@/components/ui/fonts";
import DashboardCard from "@/components/UserCard";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader/>;
  }


  return (
    <div className="flex flex-col item-center text-secondary-content">
      <section className={`${kodchasan.className}`}>
        <h1 className={`${kodchasan.className} ml-[78px] text-[24px] mb-3`}>
          Escritorio
        </h1>
        <DashboardCard/>
      </section>

      <section className="flex flex-row justify-between ml-[45px] mt-[55px] mr-14  ">
        <img src="/ejemplo-progreso.svg" alt="Imagen ejemplo progreso" className="w-fit"/>
        <img src="/ejemplo-calendario.svg" alt="Imagen ejemplo calendario" className="w-fit"/>
      </section>
    </div>
  )
}

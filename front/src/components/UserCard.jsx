import { useSession } from "next-auth/react";
import Image from "next/image";
import Shortcut from "./Shortcut"; // Componente reutilizable

const DashboardCard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center">Cargando...</p>;
  }

  if (!session) {
    return <p>No has iniciado sesión.</p>;
  }

  const fullName = session.user?.name || session.user?.fullname || "Invitado";
  const firstName = fullName.split(" ")[0]; // Obtiene el primer nombre

  return (
    <section className="relative bg-white shadow-md drop-shadow-md rounded-2xl ml-16 mr-14 mt-4 pt-14 pr-24 p-5 pl-7 flex flex-col">
      <div className="flex flex-col gap-8 mb-[45px]">
        <h2 className="text-[40px] font-medium">Hola, {firstName}!</h2>
        <p className="text-[20px]">¿Qué vas a hacer hoy?</p>
      </div>

      <div className="grid grid-cols-2 w-[38rem] gap-7">
        <Shortcut icon="/new-project.svg" text="Crear un nuevo proyecto" />
        <Shortcut icon="/my-projects.svg" text="Ver mis proyectos" />
        <Shortcut icon="/add-member.svg" text="Añadir un nuevo miembro" />
        <Shortcut icon="/team-tasks.svg" text="Ver las tareas de equipo" />
      </div>

      <div className="relative">
        <Image
          src="/abejita.svg"
          alt="Abeja Panal"
          width={420}
          height={420}
          className="absolute right-48 -bottom-4 translate-x-1/2"
        />
      </div>
    </section>
  );
};

export default DashboardCard;

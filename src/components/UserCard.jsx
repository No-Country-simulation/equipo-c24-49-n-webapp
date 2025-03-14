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
    <section className="flex relative shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]  rounded-2xl ml-[50px] mr-14  pt-[40px] pr-24 p-5 pl-7 min-h-[309px] min-w-[913]">
      <div className="">
        <div className="flex flex-col gap-[42px] mb-[40px] w-fit">
          <h2 className="text-[40px] font-medium w-fit">Hola, {firstName}!</h2>
          <p className="text-[20px]">¿Qué vas a hacer hoy?</p>
        </div>

        <div className="grid grid-cols-2 w-[500px] gap-7">
          <Shortcut icon="/new-project.svg" text="Crear un nuevo proyecto" />
          <Shortcut icon="/my-projects.svg" text="Ver mis proyectos" />
          <Shortcut icon="/add-member.svg" text="Añadir un nuevo miembro" />
          <Shortcut icon="/team-tasks.svg" text="Ver las tareas de equipo" />
        </div>
      </div>

      <div className="absolute -top-12 right-0">
        <div>
          <Image
            src="/abejita.svg"
            alt="Abeja Panal"
            width={317}
            height={362}
            className=""
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardCard;

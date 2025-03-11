"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const IconoInteractivo = ({ tipo }) => {
  const [activo, setActivo] = useState(false);
  const { data: session } = useSession(); // Acceder a la sesión del usuario

  const iconos = {
    notificaciones: {
      inactivo: "/notificacion-inactiva.svg",
      activo: "/notificacion-activa.svg",
      alt: "Notificaciones",
    },
    mensajes: {
      inactivo: "/mensaje-inactivo.svg",
      activo: "/mensaje-activo.svg",
      alt: "Mensajes",
    },
    fotoPerfil: {
      inactivo: "/perfil-inactivo.svg",
      activo: "/perfil-activo.svg",
      alt: "Foto de perfil",
    },
  };

  const handleCerrarSesion = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="relative">
      {tipo === "fotoPerfil" ? (
        // Mostrar la imagen de perfil del usuario si está disponible
        <img
          src={session?.user?.avatar || iconos[tipo].inactivo} // Usar la imagen de perfil del usuario
          alt={iconos[tipo].alt}
          onClick={() => setActivo(!activo)}
          className="cursor-pointer w-10 h-10 rounded-full object-cover"
        />
      ) : (
        // Mostrar el ícono predeterminado para otros tipos
        <img
          src={activo ? iconos[tipo].activo : iconos[tipo].inactivo}
          alt={iconos[tipo].alt}
          onClick={() => setActivo(!activo)}
          className="cursor-pointer"
        />
      )}
      {tipo === "fotoPerfil" && activo && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
          <Link href="/dashboard/profile">
            <div
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setActivo(false)} 
            >
              Ver perfil
            </div>
          </Link>
          <button
            onClick={handleCerrarSesion}
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default IconoInteractivo;
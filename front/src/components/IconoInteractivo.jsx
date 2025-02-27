"use client";

import { useState } from "react";

const IconoInteractivo = ({ tipo }) => {
  const [activo, setActivo] = useState(false);

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
    }
  };

  return (
    <button
      className="relative cursor-pointer focus:outline-none"
      onClick={() => setActivo(!activo)}
    >
      <img
        src={activo ? iconos[tipo].activo : iconos[tipo].inactivo}
        alt={iconos[tipo].alt}
        className="transition-all duration-300 transform scale-100 hover:scale-105"
      />
    </button>
  );
};

export default IconoInteractivo;

const FechaActual = () => {
  const fechaCompleta = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const fechaMobile = new Date().toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
  });

  // Extraer la primera letra del día para móviles
  const primeraLetraDia = fechaMobile.split(" ")[0].charAt(0);

  return (
    <div className="flex flex-row items-center gap-2 md:gap-4 cursor-pointer">
      {/* Ícono de fecha */}
      <img
        src="/fecha-icon.svg"
        alt="Ícono Fecha"
        className="w-5 h-5 md:w-6 md:h-6"
      />
      {/* Texto de la fecha */}
      <p className="text-sm md:text-base font-medium">
        {/* Mostrar solo el número del día y la primera letra en móviles */}
        <span className="md:hidden">
          {fechaMobile.split(" ")[1]} {primeraLetraDia}
        </span>
        {/* Mostrar la fecha completa en pantallas grandes */}
        <span className="hidden md:inline">{fechaCompleta}</span>
      </p>
    </div>
  );
};

export default FechaActual;
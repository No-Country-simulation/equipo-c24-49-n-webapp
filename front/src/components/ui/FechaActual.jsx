import Image from "next/image";

const FechaActual = () => {
    const fecha = new Date()
      .toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
      .replace(/\b\w/g, (c) => c.toUpperCase()); //Mayúscula en la primera letra del día y mes
  
    return (
      <div className="flex flex-row items-center gap-4 cursor-pointer">
        <Image src="/fecha-icon.svg" alt="Ícono Fecha" className="w-5 h-5" />
        <p className="text-[14px] font-medium">{fecha}</p>
      </div>
    );
  };
  
  export default FechaActual;
  
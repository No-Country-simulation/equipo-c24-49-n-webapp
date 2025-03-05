"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center relative px-4">
      <main className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-10 w-full">
          
          {/* Sección de Texto */}
          <div className="space-y-4 sm:space-y-6 md:col-span-5 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-gray-900 leading-tight md:leading-[71.04px] tracking-wide">
              ¡Bienvenido <br /> al Panal Colaborativo!
            </h1>
            <p className="text-base sm:text-lg md:text-[18px] text-gray-600 max-w-md mx-auto md:mx-0">
              En Panal Co. entendemos que el verdadero éxito se construye cuando trabajamos juntos. 
              Cada miembro aporta su esfuerzo y creatividad para alcanzar una meta común, 
              mientras que las tareas fluyen de forma ordenada y eficiente.
            </p>

            <div className="flex justify-center md:justify-start">
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>

          {/* Sección de Imagen */}
          <div className="relative flex justify-center items-center md:col-span-7">
            {/* Fondo decorativo detrás de la imagen */}
            <div className="absolute w-[85%] sm:w-[400px] md:w-[685px] h-[250px] sm:h-[350px] md:h-[471px] bg-pink-50 rounded-3xl shadow-lg -z-10"></div>

            <img 
              src="/images/dashboard.webp" 
              alt="Panal" 
              className="w-full max-w-[620px] object-contain relative z-30"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

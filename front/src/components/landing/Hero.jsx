import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className="h-screen flex items-center justify-center relative ">
      <div className="max-w-7xl px-4 md:px-10 mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 grid-cols-reverse md:grid-cols-12    items-center gap-6 md:gap-10  w-full">

          {/* Sección de texto (5/12 en pantallas grandes) */}
          <div className="space-y-4 sm:space-y-6 md:col-span-5 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] text-gray-900 leading-tight md:leading-[71.04px] tracking-[2px]">
              ¡Bienvenido <br /> al Panal Colaborativo!
            </h1>
            <p className="hidden md:block text-base sm:text-lg md:text-[18px] text-gray-600">
              En Panal Co. entendemos que el verdadero éxito se construye cuando trabajamos juntos. Imagina a tu equipo
              como una colmena: cada miembro aporta su esfuerzo y creatividad para alcanzar una meta común, mientras que
              las tareas fluyen de forma ordenada y eficiente.
            </p>

            <Link href="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>

          {/* Sección de imagen (7/12 en pantallas grandes) */}
          <div className="relative flex justify-center mt-10 md:mt-0 items-center md:col-span-7 right-0">
            <div className="absolute w-[85%] sm:w-[400px] md:w-[685px] h-[250px] sm:h-[350px] md:h-[471px] bg-pink-50 rounded-3xl shadow-lg -z-20"></div>
            <Image src="/images/dashboard.webp" alt="Panal" className="w-[90%] sm:w-[350px] md:w-[620px] object-contain relative z-30" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
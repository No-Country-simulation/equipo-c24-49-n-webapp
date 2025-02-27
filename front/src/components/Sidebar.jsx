
import Image from "next/image";

const Sidebar = () => {
    return(
        <aside className="flex flex-col bg-secondary w-64 min-h-screen rounded-tr-[3rem] rounded-br-[3rem]">
            <ul className="flex flex-col flex-grow gap-12 font-normal text-base">
                <li className="flex flex-row items-center gap-3 pt-[3.4375rem] pl-[2.9375rem]">
                    <Image 
                        src="/logo.svg"
                        alt="Isologo Panal"
                        width={38.88}
                        height={37.88}
                        className="cursor-pointer"
                    />
                    <div className="cursor-pointer">
                        <Image 
                            src="/panal.svg"
                            alt="Tipografía Panal"
                            width={68}
                            height={26}
                        />
                    </div>
                </li>
                <li className="flex flex-row items-center gap-3 pl-[3.1875rem] ">
                    <Image 
                        src="/home-icon.svg"
                        alt="Ícono Home"
                        width={24}
                        height={24}
                    />
                    <a className="cursor-pointer">
                        Home
                    </a>
                </li>
                <li className="flex flex-row items-center gap-3 pl-[3.1875rem]">
                    <Image 
                        src="/tareas-icon.svg"
                        alt="Ícono Tareas"
                        width={24}
                        height={24}
                    />
                    <a className="cursor-pointer">
                        Tareas
                    </a>
                </li>
                <li className="flex flex-row items-center gap-3 pl-[3.1875rem]">
                    <Image 
                        src="/equipos-icon.svg"
                        alt="Ícono Equipos"
                        width={24}
                        height={24}
                    />
                    <a className="cursor-pointer">
                        Equipos
                    </a>
                </li>
            </ul>
            <div className="mt-auto flex flex-row items-center gap-3 pl-[3.1875rem] mb-[2.42875rem]">
                    <Image 
                        src="/config-icon.svg"
                        alt="Ícono Equipos"
                        width={24}
                        height={24}
                    />
                    <a className="cursor-pointer">
                        Configuración
                    </a>
            </div>
        </aside>
    )
} 

export default Sidebar
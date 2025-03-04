
import Image from "next/image";

const Sidebar = () => {
    return (
        <aside className="flex flex-col bg-secondary w-64 min-h-screen rounded-tr-[3rem] rounded-br-[3rem]">
            <ul className="flex flex-col flex-grow gap-12 font-normal text-base">
                <li className="flex flex-row items-center gap-3 pt-[3.4375rem] pl-[1.8rem]">
                    <a
                        href="/dashboard/"
                        className="btn btn-link flex items-center text-gray-900 gap-2 no-underline hover:no-underline active:no-underline"
                    >
                        <img src="/logo.svg" alt="Logo" className="w-12 h-12 object-contain" />
                        <span className="text-[24px] font-bold">PANAL</span>
                    </a>
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
                <li className="flex flex-row items-center gap-3 pl-[1.8rem]">
                    <a
                        href="/dashboard/projects" className="btn btn-link flex items-center text-gray-900 gap-2 no-underline hover:no-underline active:no-underline" >
                        <Image
                            src="/tareas-icon.svg"
                            alt="Ícono Tareas"
                            width={24}
                            height={24}
                        />
                        Proyectos
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
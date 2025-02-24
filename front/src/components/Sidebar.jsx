
import Image from "next/image";
import { useState } from "react";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return(
            <aside 
                className={`fixed top-0 left-0 h-full bg-secondary text-secondary-content transition-all duration-300 
                    ${isExpanded ? "w-56" : "w-16"}`} 
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                <ul>
                    <li className="flex flex-row items-center gap-2">
                        <Image 
                            src="/logo.svg"
                            alt="Isologo Panal"
                            width={38.88}
                            height={37.88}
                        />
                        <div className={`transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 overflow-hidden w-0"}`}>
                            <Image 
                                src="/panal.svg"
                                alt="Tipografía Panal"
                                width={68}
                                height={26}
                            />
                        </div>
                    </li>
                    <li className="flex flex-row items-center gap-2">
                        <Image 
                            src="/home-icon.svg"
                            alt="Ícono Home"
                            width={24}
                            height={24}
                        />
                        <a 
                        className={`transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 overflow-hidden w-0"}`}>
                            Home
                        </a>
                    </li>
                    <li className="flex flex-row items-center gap-2">
                        <Image 
                            src="/tareas-icon.svg"
                            alt="Ícono Tareas"
                            width={24}
                            height={24}
                        />
                        <a 
                        className={`transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 overflow-hidden w-0"}`}>
                            Tareas
                        </a>
                    </li>
                    <li className="flex flex-row items-center gap-2">
                        <Image 
                            src="/equipos-icon.svg"
                            alt="Ícono Equipos"
                            width={24}
                            height={24}
                        />
                        <a 
                        className={`transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 overflow-hidden w-0"}`}>
                            Equipos
                        </a>
                    </li>
                </ul>
            </aside>
    )
} 

export default Sidebar
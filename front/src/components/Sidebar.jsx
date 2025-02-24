import Image from "next/image";

const Sidebar = () => {
    return(
        <div>
            <aside>
                <ul>
                    <li className="flex flex-row items-center gap-2">
                        <Image 
                            src="/logo.svg"
                            alt="Ícono Home"
                            width={9.72}
                            height={auto}
                        />
                        <Image 
                            src="/panal.svg"
                            alt="Ícono Home"
                            width={24}
                            height={24}
                        />
                    </li>
                    <li className="flex flex-row items-center gap-2">
                        <Image 
                            src="/home-icon.svg"
                            alt="Ícono Home"
                            width={24}
                            height={24}
                        />
                        <a>Home</a>
                    </li>
                    <li className="flex flex-row items-center gap-2">
                        <Image 
                            src="/home-icon.svg"
                            alt="Ícono Home"
                            width={24}
                            height={24}
                        />
                        <a>Home</a>
                    </li>
                    <li className="flex flex-row items-center gap-2">
                        <Image 
                            src="/home-icon.svg"
                            alt="Ícono Home"
                            width={24}
                            height={24}
                        />
                        <a>Home</a>
                    </li>
                </ul>
            </aside>
        </div>
    )
} 

export default Sidebar
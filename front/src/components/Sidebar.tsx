"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [recentProjects, setRecentProjects] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const response = await fetch("/api/projects?limit=3");
        if (!response.ok) {
          throw new Error("Error fetching recent projects");
        }
        const data = await response.json();
        if (Array.isArray(data.projects)) {
          setRecentProjects(data.projects);
        } else {
          setRecentProjects([]);
        }
      } catch (error) {
        console.error("Error fetching recent projects:", error);
        setRecentProjects([]);
      }
    };

    fetchRecentProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };
  const expandSidebar = () => {
    setIsExpanded(true);
  };

  const menuItems = [
    { name: "Home", href: "/dashboard", icon: "/home-icon.svg" },
    { name: "Proyectos", href: "/dashboard/projects", icon: "/tareas-icon.svg" },
    { name: "Equipos", href: "/dashboard/teams", icon: "/equipos-icon.svg" },
    { name: "Configuración", href: "/dashboard/settings", icon: "/config-icon.svg", bottom: true },
  ];

  return (
    <aside
    onClick={expandSidebar}
      ref={sidebarRef}
      className={`flex flex-col min-h-screen bg-yellow-200 backdrop-blur-md rounded-tr-[3rem] rounded-br-[3rem] transition-all duration-300 ${
        isExpanded ? "max-w-60 min-w-60" : "max-w-20 min-w-20"
      }`}
    >
      <ul className="flex flex-col flex-grow gap-8 font-normal text-base relative">
        {/* Logo / Botón para expandir */}
        <li className="flex items-center justify-center gap-3 pt-14  cursor-pointer" onClick={toggleSidebar}>
          <Image src="/logo.svg" alt="Logo" width={48} height={48} />
          {isExpanded && <span className="text-2xl font-bold">PANAL</span>}
        </li>

        {/* Menú */}
        {menuItems.map(({ name, href, icon, bottom }) => {
          const isActive = pathname === href;

          return (
            <li key={name} className={`relative pl-4 flex flex-col gap-3 ${bottom ? "mt-auto mb-10" : ""}`}>
              {isActive && (
                <div className="absolute right-0 top-3 -translate-y-10 w-[70px] h-[135px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 135" fill="black">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M49 93.0645C71.6437 93.0645 90 111.421 90 134.065V0.437314C90 23.081 71.6437 41.4373 49 41.4373H25.8136C11.5572 41.4373 0 52.9944 0 67.2509C0 81.5074 11.5571 93.0645 25.8136 93.0645H49Z"
                      fill="white"
                    />
                  </svg>
                </div>
              )}

              <Link
                href={href}
                className={`flex items-center gap-2 px-3 py-2 transition-all relative ${
                  isActive ? "bg-white rounded-full h-12 " : " w-32 hover:bg-opacity-50 hover:bg-white hover:rounded-full"
                }`}
              >
                <Image src={icon} alt={`Ícono ${name}`} width={24} height={24} />
                {isExpanded && <span>{name}</span>}
              </Link>

              {/* Submenú de proyectos recientes */}
              {isExpanded && name === "Proyectos" && (
                <ul className="pl-8 mt-2">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <li key={project._id} className="mb-2">
                        <Link
                          href={`/dashboard/projects/${project._id}`}
                          className={`flex items-center gap-2 px-3 py-2 rounded-l-xl transition-all ${
                            pathname.includes(`/dashboard/projects/${project._id}`) ? "bg-white" : "hover:bg-white"
                          }`}
                        >
                          <span>{project.name}</span>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No hay proyectos recientes</li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;

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
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
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
    {
      name: "Proyectos",
      href: "/dashboard/projects",
      icon: "/tareas-icon.svg",
    },
    { name: "Equipos", href: "/dashboard/teams", icon: "/equipos-icon.svg" },
    {
      name: "Configuración",
      href: "/dashboard/settings",
      icon: "/config-icon.svg",
      bottom: true,
    },
  ];

  return (
    <aside
      onClick={expandSidebar}
      ref={sidebarRef}
      className={`flex flex-col  bg-secondary backdrop-blur-md rounded-tr-[41px] rounded-br-[41px] transition-all duration-300 ${
        isExpanded
          ? "max-w-[257px] min-w-[257px] mr-6"
          : "max-w-20 min-w-20 mr-20"
      }`}
    >
      <ul className="flex flex-col flex-grow gap-[40px] font-normal text-base relative pl-[51px]">
        {/* Logo / Botón para expandir */}
        <li
          className="flex  gap-1 pt-14  cursor-pointer"
          onClick={toggleSidebar}
        >
          <Image src="/logo.svg" alt="Logo" width={38} height={38} />
          {isExpanded && (
            <span
              className="text-xl font-medium font-['Kodchasan']
leading-loose text-[#3d2c00]"
            >
              PANAL
            </span>
          )}
        </li>

        {/* Menú */}
        {menuItems.map(({ name, href, icon, bottom }) => {
          const isActive = pathname === href;

          return (
            <li
              key={name}
              className={`relative  flex flex-col ${
                bottom ? "mt-auto mb-10 " : ""
              }`}
            >
              {isActive && (
                <div className="absolute -right-0 top-3 -translate-y-1/2 w-[229px] h-[133px]">
                  <svg
                    width="229"
                    height="134"
                    viewBox="0 0 229 134"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M229 133.229C228.892 110.677 210.577 92.4281 188 92.4281H25.8136C11.5571 92.4281 0 80.871 0 66.6145C0 52.3581 11.5571 40.8009 25.8136 40.8009H188C210.577 40.8009 228.892 22.5521 229 0V133.229Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
              )}

              <Link
                href={href}
                className={`flex items-center gap-2 pr-3 mb-2 py-0 transition-all relative ${
                  isActive
                    ? "  "
                    : " w-32 hover:bg-opacity-50 hover:bg-white hover:rounded-full"
                }`}
              >
                <Image
                  src={icon}
                  alt={`Ícono ${name}`}
                  width={24}
                  height={24}
                />
                {isExpanded && <span>{name}</span>}
              </Link>

              {/* Submenú de proyectos recientes */}
              {/* {isExpanded && name === "Proyectos" && (
                <ul className="pl-8 mt-2">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <li key={project._id} className="mb-2">
                        <Link
                          href={`/dashboard/projects/${project._id}`}
                          className={`flex items-center gap-2  pl-0 py-2 rounded-l-xl transition-all ${
                            pathname.includes(`/dashboard/projects/${project._id}`) ? "bg-white" : "hover:bg-white"
                          }`}
                        >
                          <span>{project.name}</span>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <span className="loading loading-ring loading-lg"></span>
                  )}
                </ul>
              )} */}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;

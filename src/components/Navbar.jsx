"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div className="fixed max-w-7xl mx-auto top-[26px] left-0 right-0 backdrop-blur-sm z-50">
      <div className="navbar bg-base-100 flex justify-between px-4 md:px-8 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <div>
          <Link
            href="/"
            className="btn btn-link flex items-center text-gray-900 gap-2 no-underline hover:no-underline active:no-underline"
          >
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-[24px] font-medium text-accent">PANAL</span>
          </Link>
        </div>

        {/* Menú de navegación */}
        <div className="gap-2 flex items-center">
          {pathname !== "/register" && (
            <ul className=" text-accent menu menu-horizontal gap-2 text-sm font-medium flex-nowrap hidden md:flex">
              <li className="">
                <a className="hover:bg-gray-100 " href="#features">
                  Recursos
                </a>
              </li>
              <li>
                <a className="hover:bg-gray-100 " href="#pricing">
                  Equipos
                </a>
              </li>
              <li>
                <a className="hover:bg-gray-100 " href="/about">
                  Sobre el proyecto
                </a>
              </li>
            </ul>
          )}

          <div className="flex flex-nowrap gap-2">
            {pathname !== "/register" && (
              <Link
                href="/login"
                className="btn  hover:bg-gray-100 bg-white border-0 shadow-none font-medium text-accent"
              >
                Iniciar Sesión
              </Link>
            )}
            {pathname !== "/register" && (
              <Link href="/register" className="hidden md:flex btn btn-primary">
                Registrarse
              </Link>
            )}
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a href="#features">Recursos</a>
              </li>
              <li>
                <a href="#pricing">Equipos</a>
              </li>
              <li>
                <a href="/about">Sobre el proyecto</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="navbar bg-base-100  px-4 md:px-8 max-w-screen-2xl mx-auto">
      <div className="navbar-start">
        <a href="/" className="btn btn-link flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
          <img
            src="/panal.svg"
            alt="Logo"
            className="w-24 h-12 object-contain"
          />
        </a>
      </div>

      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-2">
          <li>
            <a href="#features" className="px-2">
              Recursos
            </a>
          </li>
          <li>
            <a href="#pricing" className="px-2">
              Equipos
            </a>
          </li>
          <li>
            <a href="#contact" className="px-2">
              Sobre el proyecto
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {pathname !== "/login" && (
          <Link href="/login" className="btn ">
            Iniciar Sesión
          </Link>
        )}

        {pathname !== "/register" && (
          <Link href="/register" className="btn btn-primary ">
            Registrarse
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;

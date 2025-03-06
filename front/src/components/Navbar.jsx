"use client";

import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

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
            <Image src="/logo.svg" alt="Logo" className="w-12 h-12 object-contain" />
            <span className="text-[24px] font-bold">PANAL</span>
          </Link>
        </div>

        {/* Menú de navegación */}
        <div className="gap-2 flex items-center">
          <ul className="menu menu-horizontal gap-2 text-sm font-semibold flex-nowrap hidden md:flex">
            <li><a href="#features">Recursos</a></li>
            <li><a href="#pricing">Equipos</a></li>
            <li><a href="/about">Sobre el proyecto</a></li>
          </ul>

          {/* Si hay sesión, muestra el avatar; si no, botones de login/register */}
          {session?.user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-14 rounded-full">
                  <Image
                    alt="User Avatar"
                    src={session.user.avatar || "/default-avatar.png"}
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow gap-2">
                <li><a href="/dashboard/profile">Perfil</a></li>
                {/* <li><a href="/settings">Configuración</a></li> */}
                <li><button onClick={() => signOut()}>Cerrar Sesión</button></li>
              </ul>
            </div>
          ) : (
            <div className="flex flex-nowrap gap-2">
              {pathname !== "/login" && <Link href="/login" className="btn">Iniciar Sesión</Link>}
              {pathname !== "/register" && <Link href="/register" className="hidden md:flex btn btn-primary">Registrarse</Link>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthAwareLayout({ children, navbar, beePattern, publicPaths = ["/", "/login", "/register"] }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Determinar si la ruta actual es pública
  const isPublicPath = publicPaths.includes(pathname);
  
  useEffect(() => {
    // Marcar que ya pasamos el renderizado inicial
    if (isInitialRender && status !== "loading") {
      setIsInitialRender(false);
    }
    
    // Solo ejecutar si el estado de autenticación ya está determinado
    if (status !== "loading") {
      // Caso 1: Usuario autenticado en ruta pública -> dashboard
      if (status === "authenticated" && isPublicPath) {
        console.log("Redirigiendo: autenticado en ruta pública -> dashboard");
        setIsRedirecting(true);
        router.replace("/dashboard");
      } 
      // Caso 2: Usuario NO autenticado en ruta privada -> login
      else if (status === "unauthenticated" && !isPublicPath) {
        console.log("Redirigiendo: no autenticado en ruta privada -> login");
        setIsRedirecting(true);
        router.replace("/login");
      }
      // Caso 3: Condición normal, no se requiere redirección
      else {
        setIsRedirecting(false);
      }
    }
  }, [status, isPublicPath, pathname, router, isInitialRender]);

  // Nuevo efecto para resetear isRedirecting cuando cambie la ruta
  useEffect(() => {
    if (status === "loading") return; // Esperar hasta que se determine la sesión
  
    if (status === "authenticated" && isPublicPath) {
      setIsRedirecting(true);
      router.replace("/dashboard");
    } else if (status === "unauthenticated" && !isPublicPath) {
      setIsRedirecting(true);
      router.replace("/login");
    }
  }, [status, isPublicPath, pathname, router]);
  

  // Depuración
  console.log(`Path: ${pathname}, Public: ${isPublicPath}, Status: ${status}, Redirecting: ${isRedirecting}, Initial: ${isInitialRender}`);
  
  // Mostrar spinner durante carga, redirección o renderizado inicial
  if (status === "loading" || isRedirecting || isInitialRender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-primary">
            {status === "loading" ? "Verificando sesión..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  // Renderizado normal para casos correctos:
  // 1. Autenticado en ruta privada
  // 2. No autenticado en ruta pública
  return (
    <>
      {navbar}
      {children}
      {beePattern}
    </>
  );
}
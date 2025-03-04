"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthCache } from "./auth-cache";

export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null
});

export function AuthAwareLayout({ 
  children, 
  navbar, 
  beePattern, 
  publicPaths = ["/", "/login", "/register"] 
}) {
  const { data: session, status } = useSession({
    required: false
  });
  
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [cachedState, setCachedState] = useState(null);
  
  // Determinar si la ruta actual es pública
  const isPublicPath = publicPaths.includes(pathname);
  
  // Inicialización: Intentar cargar del caché primero
  useEffect(() => {
    const cached = AuthCache.getAuthState();
    if (cached) {
      setCachedState(cached);
    }
  }, []);
  
  // Cuando la sesión cambia, actualizar el caché
  useEffect(() => {
    if (status === "authenticated") {
      AuthCache.setAuthState(true, session?.user || null);
    } else if (status === "unauthenticated") {
      AuthCache.setAuthState(false, null);
    }
    
    // Solo actualizar el estado de caché si session ha cambiado y no está en estado loading
    if (status !== "loading") {
      const authState = {
        isAuthenticated: status === "authenticated",
        user: session?.user || null
      };
      setCachedState(authState);
    }
  }, [session, status]);
  
  // Lógica de redirección usando preferentemente el caché
  useEffect(() => {
    // Usar caché si está disponible o la sesión si no hay caché
    const authState = cachedState || 
      (status !== "loading" ? { 
        isAuthenticated: status === "authenticated",
        user: session?.user
      } : null);
    
    if (authState) {
      if (authState.isAuthenticated && isPublicPath) {
        setIsRedirecting(true);
        router.replace("/dashboard");
      } else if (!authState.isAuthenticated && !isPublicPath) {
        setIsRedirecting(true);
        router.replace("/login");
      } else {
        setIsRedirecting(false);
      }
    }
  }, [cachedState, status, isPublicPath, pathname, router, session]);
  
  // Usar datos de caché para renderizado inicial si están disponibles
  const isLoading = !cachedState && status === "loading";
  
  // Mostrar spinner solo cuando sea absolutamente necesario
  if (isLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-primary">
            {isRedirecting ? "Redirigiendo..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }
  
  // Usar caché si está disponible, de lo contrario usar datos de sesión
  const authState = cachedState || { 
    isAuthenticated: status === "authenticated", 
    user: session?.user 
  };
  
  const authContextValue = {
    isAuthenticated: authState.isAuthenticated,
    isLoading: isLoading,
    user: authState.user || null
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {navbar}
      {children}
      {beePattern}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}
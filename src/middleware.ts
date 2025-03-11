import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // 🟢 Permitir archivos estáticos y API
  if (
    pathname.startsWith("/_next/") || // Archivos internos de Next.js
    pathname.startsWith("/static/") || // Carpeta estática
    pathname.startsWith("/images/") || // Ruta de imágenes
    pathname.startsWith("/favicon.ico") || // Favicon
    pathname.startsWith("/api/") // Excluir API
  ) {
    return NextResponse.next();
  }

  const publicRoutes = ["/", "/login", "/register", "/about", "/api-doc"];

  // 🟢 Si la ruta es pública, permitir el acceso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 🔴 Si el usuario no está autenticado y quiere entrar a una ruta privada, redirigir a /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🟢 Permitir el acceso a rutas privadas si el usuario está autenticado
  return NextResponse.next();
}

// ⏩ Definir a qué rutas se aplica el middleware
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Solo protege estas rutas
};

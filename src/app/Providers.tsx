"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider 
      refetchInterval={60 * 60}  // Refresca cada hora en vez de cada navegación
      refetchOnWindowFocus={false}  // No refresca al volver a la ventana
    >
      {children}
    </SessionProvider>
  );
}
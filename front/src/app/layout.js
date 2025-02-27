import Navbar from "@/components/Navbar";
import "./globals.css";
import { kodchasan } from "@/components/ui/fonts";

export const metadata = {
  title: "Gestor de Tareas",
  description: "Gestor de Tareas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

      </head>
      <body
        className={`${kodchasan.className} antialiased`}
      >

        {children}
      </body>
    </html>
  );
}

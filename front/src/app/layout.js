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
        <header className="fixed max-w-7xl mx-auto top-[26px] left-0 right-0 backdrop-blur-sm z-50">

        </header>

        {children}
      </body>
    </html>
  );
}

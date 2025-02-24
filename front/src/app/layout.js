import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { kodchasan } from "@/components/ui/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gestor de Tareas",
  description: "Gestor de Tareas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${kodchasan.className} antialiased`}
      >

            {children}
      </body>
    </html>
  );
}

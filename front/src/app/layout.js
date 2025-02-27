import Navbar from "@/components/Navbar";
import BeePatern from "@/components/BeePatern";

const kodchasan = Kodchasan({
  variable: "--font-kodchasan",
  weight: "400",
  subsets: ["latin"],
});

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
      <head></head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <Navbar />
        </header>

        {children}
        <BeePatern />

      </body>
    </html>
  );
}

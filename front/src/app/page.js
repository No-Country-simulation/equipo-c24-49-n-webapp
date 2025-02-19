import Rocket from "../assets/rocket.svg";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pb-20 min-h-screen">
      <h2 className="text-xl font-bold text-center">Bienvenido a:</h2>
      <h1 className="text-3xl font-bold text-center">
        Gestor de Tareas Colaborativo
      </h1>

      <Rocket className="w-24 h-24 text-blue-500" />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal, Plus } from "lucide-react";
import AddProjectPopup from "@/components/AddProjectPopup";

// Tipos para los proyectos
interface Project {
  _id: string;
  name: string;
  backgroundType?: string;
  backgroundColor?: string;
}

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los proyectos
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("No se pudieron cargar los proyectos");
      }
      const data = await response.json();
      console.log("proyectos", data);
      setProjects(data.projects);
      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Función para actualizar la lista de proyectos
  const handleProjectCreated = () => {
    fetchProjects(); // Vuelve a cargar los proyectos
  };
  
  // Función para obtener el estilo de fondo radial del proyecto
  const getProjectBackground = (project: Project) => {
    const color = project.backgroundColor || "#FFFFFF";
    return {
      background: `radial-gradient(circle, #FFFFFF 30%, ${color} 100%)`,
    };
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-medium text-[#5a3d2b] mb-8">Proyectos</h1>
        <div className="skeleton h-8 w-28 my-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="skeleton h-44 "></div>
          <div className="skeleton h-44 "></div>
          <div className="skeleton  h-44 "></div>
          <div className="skeleton h-44 "></div>
          <div className="skeleton h-44 "></div>
          <div className="skeleton  h-44 "></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-medium text-[#5a3d2b] mb-8">Proyectos</h1>
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-medium text-[#5a3d2b] mb-8 ml-6">Proyectos</h1>

      <AddProjectPopup onProjectCreated={handleProjectCreated} />

      <div className="flex justify-start items-start gap-[21px] flex-wrap content-start">
        {projects.map((project) => (
          <div key={project._id} className="relative group w-[292px] h-[189px]">
            <Link href={`/dashboard/projects/${project._id}`}>
              <div
                className="rounded-2xl h-44 flex items-center justify-center shadow-sm"
                style={getProjectBackground(project)}
              >
                <h2 className="text-xl font-medium text-center text-[#5a3d2b]">
                  {project.name}
                </h2>
              </div>
            </Link>
            <button className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        ))}

        {/* Añadir proyecto (alternativo) */}
        <div className="rounded-2xl p-8 w-[292px] h-[189px] flex items-center justify-center bg-white border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
          <Plus className="h-10 w-10 text-red-400" />
        </div>
      </div>
    </main>
  );
}
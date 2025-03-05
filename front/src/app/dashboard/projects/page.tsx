'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link"
import { MoreHorizontal, Plus } from "lucide-react"
import AddProjectPopup from "@/components/AddProjectPopup"

// Tipos para los proyectos
interface Project {
  _id: string;
  name: string;
  backgroundType?: string;
  backgroundColor?: string;
  backgroundGradient?: {
    color1: string;
    color2: string;
  };
}

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('No se pudieron cargar los proyectos');
        }
        const data = await response.json();
        setProjects(data.projects);
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Función para generar un gradiente de fondo
  const getBackgroundGradient = (project: Project) => {
    // Valores por defecto si no hay gradiente
    const color1 = project.backgroundGradient?.color1 || '#F0F0F0';
    const color2 = project.backgroundGradient?.color2 || '#FFFFFF';
    
    return `bg-gradient-to-br from-[${color1}] to-[${color2}]`;
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-medium text-[#5a3d2b] mb-8">Proyectos</h1>
        <p>Cargando proyectos...</p>
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
      <h1 className="text-3xl font-medium text-[#5a3d2b] mb-8">Proyectos</h1>

      <AddProjectPopup />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="relative group">
            <Link href={`/dashboard/projects/${project._id}`}>
              <div className={`rounded-2xl p-8 h-44 flex items-center justify-center ${getBackgroundGradient(project)} hover:shadow-sm transition-shadow`}>
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
        <div className="rounded-2xl p-8 h-44 flex items-center justify-center bg-white border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
          <Plus className="h-10 w-10 text-red-400" />
        </div>
      </div>
    </main>
  );
}
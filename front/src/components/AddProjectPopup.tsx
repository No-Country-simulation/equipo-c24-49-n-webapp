'use client';

import React, { useState } from 'react';
import { X, PlusSquare } from 'lucide-react';

// Tipos de fondos inspirados en abejas/panales
const backgroundOptions = [
  { value: 'miel', label: 'Miel Dorada', color: 'from-yellow-100 to-yellow-200' },
  { value: 'panal', label: 'Panal de Abeja', color: 'from-amber-100 to-amber-200' },
  { value: 'nectar', label: 'Néctar Suave', color: 'from-orange-50 to-orange-100' },
  { value: 'polen', label: 'Polen Fresco', color: 'from-yellow-50 to-yellow-100' },
  { value: 'cera', label: 'Cera Natural', color: 'from-amber-50 to-amber-100' }
];

// Opciones de visibilidad
const visibilityOptions = [
  { value: 'privado', label: 'Privado' },
  { value: 'publico', label: 'Público' },
  { value: 'equipo', label: 'Equipo' }
];

export default function AddProjectPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [background, setBackground] = useState('');
  const [visibility, setVisibility] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          background,
          visibility
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el proyecto');
      }
  
      const newProject = await response.json();
      console.log('Proyecto creado:', newProject);
      
      // Resetear el formulario y cerrar el popup
      setProjectName('');
      setBackground('');
      setVisibility('');
      setIsOpen(false);
  
      // Opcional: actualizar lista de proyectos o mostrar notificación
    } catch (error) {
      console.error('Error:', error);
      // Manejar el error (mostrar mensaje al usuario, etc.)
    }
  };
  
  return (
    <>
      {/* Botón para abrir el popup */}
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-[#5a3d2b] mb-10 hover:bg-gray-50 transition-colors"
      >
        <PlusSquare className="h-5 w-5 text-red-400" />
        Añadir proyecto
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 relative shadow-xl">
            {/* Botón de cierre */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Título */}
            <h2 className="text-2xl font-semibold text-[#5a3d2b] mb-6">
              Añadir proyecto
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input de Nombre de Proyecto */}
              <div>
                <label 
                  htmlFor="projectName" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre del Proyecto
                </label>
                <input 
                  type="text" 
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Escribe el nombre de tu proyecto"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              {/* Dropdown de Fondo */}
              <div>
                <label 
                  htmlFor="background" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fondo del Proyecto
                </label>
                <select 
                  id="background"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="">Selecciona un fondo</option>
                  {backgroundOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown de Visibilidad */}
              <div>
                <label 
                  htmlFor="visibility" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Visibilidad del Proyecto
                </label>
                <select 
                  id="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="">Selecciona visibilidad</option>
                  {visibilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón de Crear Proyecto */}
              <button 
                type="submit" 
                className="w-full bg-red-400 text-white py-2 rounded-md hover:bg-red-500 transition-colors"
              >
                Crear Proyecto
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
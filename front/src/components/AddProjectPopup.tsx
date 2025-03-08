"use client";

import React, { useState } from "react";
import { X, PlusSquare } from "lucide-react";

// Opciones de imágenes de fondo
const backgroundOptions = [
  { value: "miel", label: "Miel", image: "/covers/miel.svg" },
  { value: "nube", label: "Nube", image: "/covers/nube.svg" },
  { value: "rosa", label: "Rosa", image: "/covers/rosa.svg" },
  { value: "verde", label: "Verde", image: "/covers/verde.svg" },
  { value: "patron-1", label: "Patrón 1", image: "/covers/patron-1.svg" },
  { value: "patron-2", label: "Patrón 2", image: "/covers/patron-2.svg" },
  { value: "patron-3", label: "Patrón 3", image: "/covers/patron-3.svg" },
  { value: "patron-4", label: "Patrón 4", image: "/covers/patron-4.svg" },
];

// Opciones de visibilidad
const visibilityOptions = [
  { value: "privado", label: "Privado" },
  { value: "publico", label: "Público" },
  { value: "equipo", label: "Equipo" },
];

export default function AddProjectPopup({ onProjectCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [background, setBackground] = useState("");
  const [visibility, setVisibility] = useState("privado");
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          backgroundType:
            background.includes("patron") ||
            background.includes("miel") ||
            background.includes("nube") ||
            background.includes("rosa") ||
            background.includes("verde")
              ? "image"
              : "color",
          backgroundImage:
            background.includes("patron") ||
            background.includes("miel") ||
            background.includes("nube") ||
            background.includes("rosa") ||
            background.includes("verde")
              ? `/covers/${background}.svg`
              : null,
          backgroundColor:
            !background.includes("patron") &&
            !background.includes("miel") &&
            !background.includes("nube") &&
            !background.includes("rosa") &&
            !background.includes("verde")
              ? background
              : null,
          visibility,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el proyecto");
      }

      const newProject = await response.json();
      console.log("Proyecto creado:", newProject);

      // Resetear el formulario y cerrar el popup
      setProjectName("");
      setBackground("");
      setVisibility("");
      setIsOpen(false);

      // Llamar a la función de actualización
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error) {
      console.error("Error:", error);
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
            <h2 className="text-2xl font-semibold text-accent mb-2">
              Añadir proyecto
            </h2>
            <div className="divider"></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input de Nombre de Proyecto */}
              <div>
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-accent mb-2"
                >
                  Nombre
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fondo
                </label>
                <div className="relative">
                  {/* Botón para desplegar la lista */}
                  <button
                    type="button"
                    onClick={() => setIsBackgroundOpen(!isBackgroundOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-between"
                  >
                    <span>
                      {background
                        ? backgroundOptions.find(
                            (opt) => opt.value === background
                          )?.label
                        : "Selecciona un fondo"}
                    </span>
                    <svg
                      className={`h-5 w-5 transform transition-transform ${
                        isBackgroundOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Lista desplegable de fondos */}
                  {isBackgroundOpen && (
                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {backgroundOptions.map((option) => (
                        <li
                          key={option.value}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                          onClick={() => {
                            setBackground(option.value);
                            setIsBackgroundOpen(false);
                          }}
                        >
                          {/* Círculo de previsualización */}
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{
                              background:
                                option.value.includes("patron") ||
                                option.value.includes("miel") ||
                                option.value.includes("nube") ||
                                option.value.includes("rosa") ||
                                option.value.includes("verde")
                                  ? `url(${option.image}) center/cover`
                                  : option.image,
                            }}
                          ></div>
                          <span>{option.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* Dropdown de Visibilidad */}
              <div>
                <label
                  htmlFor="visibility"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Visibilidad
                </label>
                <select
                  id="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                >
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

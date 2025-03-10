"use client";

import { useState } from "react";
import { X, PlusSquare } from "lucide-react";

// Opciones de colores de fondo
const backgroundOptions = [
  { value: "miel", label: "Miel", color: "#FDEFAE" },
  { value: "nube", label: "Nube", color: "#D7EDF2" },
  { value: "rosa", label: "Rosa", color: "#FFE7E3" },
  { value: "verde", label: "Verde", color: "#E1F1D5" },
  { value: "patron-1", label: "Patrón 1", color: "#FFF7D2" },
  { value: "patron-2", label: "Patrón 2", color: "#FFFFFF" },
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
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);

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
          background,
          visibility,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el proyecto");
      }

      const newProject = await response.json();
      console.log("Proyecto creado:", newProject);

      // Reset
      setProjectName("");
      setBackground("");
      setVisibility("privado");
      setIsOpen(false);

      // Actualizar
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Colores de fondo
  const getRadialPreview = (colorValue) => {
    const bgColor = backgroundOptions.find(opt => opt.value === colorValue)?.color || "#FFFFFF";
    return {
      background: `radial-gradient(circle, ${bgColor} 30%, ${bgColor} 100%)`,
    };
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-[10px] w-[426px] max-w-md mx-4  relative shadow-xl">
            {/* Botón de cierre */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-10 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Título */}
            <h2 className="text-[16px] font-semibold text-[#3D2C00] text-accent mb-0 font-kodchasan w-[354px] mx-auto pt-10">
              Añadir proyecto
            </h2>
            <div className="divider "></div>
            <form onSubmit={handleSubmit} className="space-y-4 text-[13px] w-[354px] mx-auto py-4 ">
              {/* Input de Nombre de Proyecto */}
              <div>
                <label
                  htmlFor="projectName"
                  className="block  font-semibold text-accent mb-4"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block  font-bold text-gray-700 mt-6 mb-4">
                  Fondo
                </label>
                <div className="relative">
                  {/* Botón para desplegar la lista */}
                  <button
                    type="button"
                    onClick={() => setIsBackgroundOpen(!isBackgroundOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {background && (
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={getRadialPreview(background)}
                        ></div>
                      )}
                      <span>
                        {background
                          ? backgroundOptions.find(
                            (opt) => opt.value === background
                          )?.label
                          : "Selecciona un color"}
                      </span>
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-500 transform transition-transform ${isBackgroundOpen ? "rotate-180" : ""
                        }`}
                      viewBox="0 0 20 20"
                      fill="#3D2C00"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Fondos */}
                  {isBackgroundOpen && (
                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {backgroundOptions.map((option) => {
                        const isSelected = background === option.value;
                        return (
                          <li
                            key={option.value}
                            className={`px-4 py-2 ${isSelected ? "bg-gray-100" : "hover:bg-gray-100"
                              } cursor-pointer flex items-center justify-between`}
                            onClick={() => {
                              setBackground(option.value);
                              setIsBackgroundOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-6 h-6 rounded-full border border-gray-300"
                                style={{
                                  background: `radial-gradient(circle, ${option.color} 50%, ${option.color} 100%)`,
                                }}
                              ></div>
                              <span>{option.label}</span>
                            </div>
                            {isSelected && (
                              <svg
                                className="h-5 w-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
              {/* Visibilidad */}
              <div>
                <label
                  htmlFor="visibility"
                  className="block  font-bold text-gray-700  mt-6 mb-4"
                >
                  Visibilidad
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsVisibilityOpen(!isVisibilityOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-between"
                  >
                    {visibilityOptions.find(opt => opt.value === visibility)?.label}
                    <svg
                      className={`h-5 w-5 transform transition-transform ${isVisibilityOpen ? "rotate-180" : ""
                        }`}
                      viewBox="0 0 20 20"
                      fill="#3D2C00"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isVisibilityOpen && (
                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
                      {visibilityOptions.map((option) => {
                        const isSelected = visibility === option.value;
                        return (
                          <li
                            key={option.value}
                            className={`px-4 py-2 ${isSelected ? "bg-gray-100" : "hover:bg-gray-100"
                              } cursor-pointer flex items-center justify-between`}
                            onClick={() => {
                              setVisibility(option.value);
                              setIsVisibilityOpen(false);
                            }}
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <svg
                                className="h-5 w-5 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Botón de Crear Proyecto */}
              <div className="w-full flex items-center justify-center gap-2 pt-14 pb-4">
                <button
                  type="submit"
                  className="w-[138px] text-[14px] font-bold self-center bg-red-400 text-white py-2 rounded-xl hover:bg-red-500 transition-colors"
                >
                  Crear Proyecto
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
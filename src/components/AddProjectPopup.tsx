"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

// Opciones de colores de fondo
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

// Define la interfaz de las props con tipos correctos
interface AddProjectPopupProps {
  onProjectCreated: () => void;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function AddProjectPopup({
  onProjectCreated,
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}: AddProjectPopupProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [background, setBackground] = useState("");
  const [visibility, setVisibility] = useState("privado");
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);

  // Use either the external state (if provided) or the internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Obtener la ruta completa de la imagen seleccionada
      const selectedBackground = backgroundOptions.find(
        (opt) => opt.value === background
      );
      const backgroundImage = selectedBackground ? selectedBackground.image : "";
  
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          backgroundImage, // Envía la ruta completa de la imagen
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="active:scale-95 transition-all inline-flex items-center gap-2 border border-gray-200 rounded-xl px-5 py-2.5 text-sm font-medium text-[#5a3d2b] mb-10 hover:bg-gray-50 "
      >
        <img src="/icons/square-plus-border.svg" alt="Añadir proyecto" />
        Añadir proyecto
      </button>

      {/* Modal/Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-[10px] w-[426px] max-w-md mx-4 relative shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-10 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-[16px] font-semibold text-accent mb-0 font-kodchasan w-[354px] mx-auto pt-10">
              Añadir proyecto
            </h2>
            <div className="divider"></div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-[13px] w-[354px] mx-auto py-4"
            >
              <div>
                <label
                  htmlFor="projectName"
                  className="block font-semibold text-accent mb-4"
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
                <label className="block font-bold text-gray-700 mt-6 mb-4">
                  Fondo
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsBackgroundOpen(!isBackgroundOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {background && (
                        <img
                          src={
                            backgroundOptions.find(
                              (opt) => opt.value === background
                            )?.image
                          }
                          className="w-6 h-6 object-cover rounded-full border border-gray-300"
                        ></img>
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
                      className={`h-5 w-5 text-gray-500 transform transition-transform ${
                        isBackgroundOpen ? "rotate-180" : ""
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
                            className={`px-4 py-2 ${
                              isSelected ? "bg-gray-100" : "hover:bg-gray-100"
                            } cursor-pointer flex items-center justify-between`}
                            onClick={() => {
                              setBackground(option.value);
                              setIsBackgroundOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={option.image}
                                className=" w-6 h-6 object-cover overflow-hidden rounded-full border border-gray-300 "
                                alt={option.label}
                              />

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
                  className="block font-bold text-gray-700 mt-6 mb-4"
                >
                  Visibilidad
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsVisibilityOpen(!isVisibilityOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-between"
                  >
                    {
                      visibilityOptions.find((opt) => opt.value === visibility)
                        ?.label
                    }
                    <svg
                      className={`h-5 w-5 transform transition-transform ${
                        isVisibilityOpen ? "rotate-180" : ""
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
                            className={`px-4 py-2 ${
                              isSelected ? "bg-gray-100" : "hover:bg-gray-100"
                            } cursor-pointer flex items-center justify-between`}
                            onClick={() => {
                              setVisibility(option.value);
                              setIsVisibilityOpen(false);
                            }}
                          >
                            <span>{option.label}</span>
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

//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-[10px] w-[426px] max-w-md mx-4 relative shadow-xl">
//             <button
//               onClick={() => setIsOpen(false)}
//               className="absolute top-10 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <X className="h-6 w-6" />
//             </button>

//             <h2 className="text-[16px] font-semibold text-[#3D2C00] text-accent mb-0 font-kodchasan w-[354px] mx-auto pt-10">
//               Añadir proyecto
//             </h2>
//             <div className="divider"></div>
//             <form onSubmit={handleSubmit} className="space-y-4 text-[13px] w-[354px] mx-auto py-4">
//               <div>
//                 <label className="block font-semibold text-accent mb-4">Nombre</label>
//                 <input
//                   type="text"
//                   value={projectName}
//                   onChange={(e) => setProjectName(e.target.value)}
//                   placeholder="Escribe el nombre de tu proyecto"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-xl"
//                 />
//               </div>

//               <div>
//                 <label className="block font-bold text-gray-700 mt-6 mb-4">Fondo</label>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-300 rounded-xl"
//                   value={background}
//                   onChange={(e) => setBackground(e.target.value)}
//                 >
//                   {backgroundOptions.map((option) => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-bold text-gray-700 mt-6 mb-4">Visibilidad</label>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-300 rounded-xl"
//                   value={visibility}
//                   onChange={(e) => setVisibility(e.target.value)}
//                 >
//                   {visibilityOptions.map((option) => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="w-full flex items-center justify-center gap-2 pt-14 pb-4">
//                 <button
//                   type="submit"
//                   className="w-[138px] text-[14px] font-bold bg-red-400 text-white py-2 rounded-xl hover:bg-red-500"
//                 >
//                   Crear Proyecto
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

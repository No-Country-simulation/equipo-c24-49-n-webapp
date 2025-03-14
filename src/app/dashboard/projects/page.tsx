"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MoreHorizontal, Plus } from "lucide-react";
import AddProjectPopup from "@/components/AddProjectPopup";

interface Project {
  _id: string;
  name: string;
  backgroundType?: string;
  backgroundColor?: string;
  backgroundGradient?: {
    color1: string;
    color2: string;
    angle: number;
  };
  backgroundImage?: string;
  description?: string;
}

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

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dropdown y edición
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isBackgroundOpen, setIsBackgroundOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");

  // Modal de eliminación
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const editProjectRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectToDelete && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [projectToDelete]);

  useEffect(() => {
    const handleClickOutsideEdit = (event: MouseEvent) => {
      if (
        editingProjectId &&
        editProjectRef.current &&
        !editProjectRef.current.contains(event.target as Node)
      ) {
        updateProjectName(editingProjectId, newProjectName);
        setEditingProjectId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideEdit);
    return () => document.removeEventListener("mousedown", handleClickOutsideEdit);
  }, [editingProjectId, newProjectName]);

  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsBackgroundOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("No se pudieron cargar los proyectos");
      const data = await response.json();
      setProjects(data.projects);
      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const handleProjectCreated = () => {
    fetchProjects();
  };

  const getProjectBackground = (project: Project) => {
    if (project.backgroundType === "color" && project.backgroundColor) {
      return { backgroundColor: project.backgroundColor };
    } else if (project.backgroundType === "gradient" && project.backgroundGradient) {
      return {
        background: `linear-gradient(to bottom right, ${project.backgroundGradient.color1}, ${project.backgroundGradient.color2})`,
      };
    } else if (project.backgroundType === "image" && project.backgroundImage) {
      return {
        backgroundImage: `url(${project.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else {
      return { backgroundColor: "#F0F0F0" };
    }
  };

  // Acciones
  const handleRenameProject = (projectId: string) => {
    const proj = projects.find((p) => p._id === projectId);
    if (proj) {
      setEditingProjectId(projectId);
      setNewProjectName(proj.name);
    }
    setActiveDropdown(null);
  };

  const updateProjectName = async (projectId: string, newName: string) => {
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: projectId,
          name: newName,
          backgroundType: "image",
        }),
      });
      if (!response.ok) throw new Error("Error al renombrar el proyecto");
      fetchProjects();
    } catch (err) {
      console.error("Error renombrando proyecto:", err);
    }
  };

  const handleChangeBackground = async (projectId: string, newBg: string) => {
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: projectId,
          backgroundType: "image",
          backgroundImage: newBg,
        }),
      });
      if (!response.ok) throw new Error("Error al cambiar el fondo del proyecto");
      fetchProjects();
      setIsBackgroundOpen(false);
      setActiveDropdown(null);
    } catch (err) {
      console.error("Error cambiando el fondo del proyecto:", err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: projectId }),
      });
      if (!response.ok) throw new Error("Error al eliminar el proyecto");
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      setProjectToDelete(null);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-medium text-accent mb-8 ml-6">Proyectos</h1>
        <div className="skeleton h-8 w-28 my-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="skeleton h-44"></div>
          <div className="skeleton h-44"></div>
          <div className="skeleton h-44"></div>
          <div className="skeleton h-44"></div>
          <div className="skeleton h-44"></div>
          <div className="skeleton h-44"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-medium text-[#5a3d2b] mb-8">Proyectos</h1>
        <AddProjectPopup onProjectCreated={handleProjectCreated} />
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-medium text-accent mb-8 ml-6">Proyectos</h1>
      <AddProjectPopup onProjectCreated={handleProjectCreated} />
      <div className="flex flex-wrap gap-[21px]">
        {projects.map((project) => (
          <div key={project._id} className="relative group w-[292px] min-h-[189px]">
            {editingProjectId === project._id ? (
              <div
                className="overflow-hidden rounded-[10px] h-[189px] flex items-center justify-center"
                style={getProjectBackground(project)}
              >
                <input
                  autoFocus
                  ref={editProjectRef}
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateProjectName(project._id, newProjectName);
                      setEditingProjectId(null);
                    }
                    e.stopPropagation();
                  }}
                  className="text-base input font-medium text-center text-accent bg-transparent border-b border-gray-300 focus:outline-none"
                />
              </div>
            ) : (
              <>
                <Link href={`/dashboard/projects/${project._id}`}>
                  <div
                    className="overflow-hidden rounded-[10px] h-[189px] flex items-center justify-center"
                    style={getProjectBackground(project)}
                  >
                    <h2 className="text-base font-medium text-center text-accent">
                      {project.name}
                    </h2>
                  </div>
                </Link>
                <div className="dropdown dropdown-end absolute top-2 right-2">
                  <button tabIndex={0} className="btn btn-ghost">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
                  >
                    <li>
                      <a onClick={() => handleRenameProject(project._id)}>
                        Renombrar proyecto
                      </a>
                    </li>
                    <li className="relative">
                      <div className="dropdown dropdown-end">
                        <a
                          tabIndex={0}
                          onClick={() => setIsBackgroundOpen((prev) => !prev)}
                        >
                          Cambiar el fondo
                        </a>
                        {isBackgroundOpen && (
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm"
                          >
                            {backgroundOptions.map((option) => (
                              <li
                                key={option.value}
                                onClick={() => {
                                  handleChangeBackground(project._id, option.image);
                                }}
                              >
                                <a>
                                  <img
                                    src={option.image}
                                    alt={option.label}
                                    className="w-6 h-6 object-cover rounded-full border mr-2"
                                  />
                                  {option.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                    <li>
                      <a onClick={() => setProjectToDelete(project)}>
                        Eliminar proyecto
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        ))}
        <div className="active:scale-95 transition-all cursor-pointer rounded-2xl p-8 w-[292px] h-[189px] flex items-center justify-center bg-white border-2 border-dashed border-gray-200 hover:border-gray-300">
          <Plus className="h-10 w-10 text-red-400" />
        </div>
      </div>

      <dialog
        ref={modalRef}
        id="deleteProjectModal"
        className="modal bg-gray-50/5 backdrop-blur-[2px]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            modalRef.current?.close();
            setProjectToDelete(null);
          }
        }}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">¿Estás seguro?</h3>
          <p className="py-4">
            El proyecto <span className="text-accent">{projectToDelete?.name}</span> se eliminará permanentemente.
          </p>
          {projectToDelete?.description && (
            <p className="text-sm text-gray-600">{projectToDelete.description}</p>
          )}
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                modalRef.current?.close();
                setProjectToDelete(null);
              }}
            >
              Cancelar
            </button>
            <button
              className="btn btn-error"
              onClick={async () => {
                if (projectToDelete) {
                  await handleDeleteProject(projectToDelete._id);
                  modalRef.current?.close();
                }
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
}

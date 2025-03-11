"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, UserPlus, MoreHorizontal, Heart, Edit2, Trash2 } from "lucide-react";
import Loader from "@/components/Loader";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "En curso" | "En pausa" | "Finalizada";
  priority: "Alta" | "Media" | "Baja";
  dueDate: string;
  category: string;
  like?: boolean;
}

interface Category {
  _id: string;
  name: string;
  tasks: Task[];
}

interface Project {
  _id: string;
  name: string;
  categories: Category[];
  tasks: Task[];
}

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [showAddTaskInput, setShowAddTaskInput] = useState<string | null>(null);

  // Estados para el formulario de nueva tarea
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Alta" | "Media" | "Baja">("Baja");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) throw new Error("Error al cargar el proyecto");

        const projectData = await response.json();
        setProject(projectData);
        console.log(projectData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleAddTask = async (categoryId: string) => {
    if (!newTaskTitle.trim() || !newTaskDueDate) return;

    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          category: categoryId,
          priority: newTaskPriority,
          projectId: project?._id,
          dueDate: newTaskDueDate,
          like: false
        }),
      });

      if (!response.ok) throw new Error("Error al crear tarea");

      const newTaskData = await response.json();

      setProject((prev) =>
        prev
          ? {
              ...prev,
              categories: prev.categories.map((cat) =>
                cat._id === categoryId
                  ? { ...cat, tasks: [...cat.tasks, newTaskData] }
                  : cat
              ),
            }
          : null
      );

      // Limpiar el formulario y cerrar el input
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("Baja");
      setNewTaskDueDate("");
      setShowAddTaskInput(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al crear la tarea");
    }
  };

  const handleLikeTask = async (taskId: string, currentLike: boolean) => {
    try {
      const response = await fetch(`/api/task/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: taskId, like: !currentLike }),
      });
      if (!response.ok) throw new Error("Error al dar like");
      const updatedTask = await response.json();
      setProject((prev) =>
        prev
          ? {
              ...prev,
              categories: prev.categories.map((cat) => ({
                ...cat,
                tasks: cat.tasks.map((task) =>
                  task._id === taskId ? updatedTask : task
                ),
              })),
            }
          : null
      );
    } catch (err) {
      console.error("Error in handleLikeTask:", err);
    }
  };
  

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/task`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: taskId }),
      });
      if (!response.ok) throw new Error("Error al eliminar la tarea");
      setProject((prev) =>
        prev
          ? {
              ...prev,
              categories: prev.categories.map((cat) => ({
                ...cat,
                tasks: cat.tasks.filter((task) => task._id !== taskId),
              })),
            }
          : null
      );
    } catch (err) {
      console.error("Error in handleDeleteTask:", err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-[#5a3d2b] text-white px-4 py-2 rounded-lg hover:bg-[#4a3527]"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl text-accent">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{project?.name}</h1>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
          <UserPlus className="text-red-400" size={18} />
          <span className="text-sm">Añadir miembro</span>
        </button>
      </div>

      <div className="flex gap-6 mx-auto justify-center">
        {project?.categories.map((category) => {
          const tasksForCategory = category.tasks || [];

          return (
            <section key={category._id} className="gap-2 mx-2 w-80 h-fit">
              <div className="flex justify-between items-center mb-4 pr-3 pl-1">
                <h2 className="font-normal text-lg">{category.name}</h2>
                <button className="text-accent">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {tasksForCategory.length > 0 ? (
                  tasksForCategory.map((task) => {

                    let priorityBadgeClass = "badge-info";
                    if (task.priority === "Media") {
                      priorityBadgeClass = "badge-warning";
                    } else if (task.priority === "Alta") {
                      priorityBadgeClass = "badge-error";
                    }

                    let statusBadgeClass = "badge-warning";
                    if (task.status === "Finalizada") {
                      statusBadgeClass = "badge-success";
                    }

                    return (
                      <div
                        key={task._id}
                        className="relative group bg-white min-w-80 min-h-36 p-4 rounded-xl shadow-md border-2 border-accent/5 flex flex-col gap-5 justify-between"
                      >
                        {/* Dropdown de edición (aparece al hover en la esquina superior derecha) */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-xs">
                              <Edit2 size={16} className="text-accent" />
                            </label>
                            <ul
                              tabIndex={0}
                              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                            >
                              <li>
                                <a onClick={() => console.log("Editar tarea", task._id)}>
                                  Editar
                                </a>
                              </li>
                              <li>
                                <a onClick={() => handleDeleteTask(task._id)}>
                                  Eliminar <Trash2 size={16} className="ml-1" />
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-start w-full gap-2">
                          <img src="/hexagon-icon.svg" className="w-5 h-5" />
                          <h3 className="text-accent font-medium">{task.title}</h3>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <div className={`badge ${priorityBadgeClass} gap-1 text-accent`}>
                              {task.priority}
                            </div>
                            <div className={`badge ${statusBadgeClass} gap-1 text-accent`}>
                              {task.status}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-end">
                          {task.dueDate && (
                            <span className="text-accent text-sm">
                              {new Date(task.dueDate).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                        </div>
                        {/* Botón de like (corazón) en la esquina inferior derecha */}
                        <button
                          onClick={() => handleLikeTask(task._id, task.like || false)}
                          className="absolute bottom-2 right-2 "
                        >
                          <Heart
                            size={20}
                            className={task.like ? " text-primary " : " text-accent "}
                          />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No hay tareas en esta categoría.</p>
                )}

                {showAddTaskInput === category._id && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="text-accent font-medium w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Título de la tarea"
                    />
                    <textarea
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="text-accent font-medium w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Descripción de la tarea"
                    />
                    <select
                      value={newTaskPriority}
                      onChange={(e) =>
                        setNewTaskPriority(e.target.value as "Alta" | "Media" | "Baja")
                      }
                      className="text-accent font-medium w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="text-accent font-medium w-full p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => handleAddTask(category._id)}
                      className="bg-[#5a3d2b] text-white px-4 py-2 rounded-lg hover:bg-[#4a3527]"
                    >
                      Crear tarea
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-5 opacity-70 justify-center cursor-pointer">
                <button
                  onClick={() => {
                    setShowAddTaskInput(category._id);
                    setNewTaskTitle("");
                    setNewTaskDescription("");
                    setNewTaskPriority("Baja");
                    setNewTaskDueDate("");
                  }}
                  className="text-accent opacity-60"
                >
                  <Plus size={20} />
                </button>
                <p className="text-accent">Añadir tarea</p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

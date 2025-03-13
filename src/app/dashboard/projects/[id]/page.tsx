"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus,
  UserPlus,
  MoreHorizontal,
  Heart,
  Edit2,
  Trash2,
} from "lucide-react";
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
  const dateInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [showAddTaskInput, setShowAddTaskInput] = useState<string | null>(null);
  const [newTaskLike, setNewTaskLike] = useState(false);
  // Estados para el formulario de nueva tarea
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"Alta" | "Media" | "Baja">("Baja");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para edición
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<"Alta" | "Media" | "Baja">("Baja");

  // Estado para menú contextual (click derecho)
  const [contextMenuTask, setContextMenuTask] = useState<{ taskId: string; x: number; y: number } | null>(null);
  // Estado para modal de detalles
  const [modalTask, setModalTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) throw new Error("Error al cargar el proyecto");
        const projectData = await response.json();
        setProject(projectData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleAddTask = async (categoryId: string) => {
    if (!newTaskTitle.trim()) return;
    // Si no se ingresa fecha, se usa la de hoy
    const dueDateToUse = newTaskDueDate.trim() ? newTaskDueDate : new Date().toISOString();
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
          dueDate: dueDateToUse,
          like: newTaskLike,
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
      // Limpiar formulario
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("Baja");
      setNewTaskLike(false);
      setNewTaskDueDate("");
      setShowAddTaskInput(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al crear la tarea");
    }
  };

  const handleUpdateTask = async (taskId: string) => {
    if (!editTitle.trim()) return;
    try {
      const response = await fetch("/api/task", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: taskId,
          title: editTitle,
          priority: editPriority,
        }),
      });
      if (!response.ok) throw new Error("Error al actualizar tarea");
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
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error updating task:", err);
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

  // Duplicar tarea: se toma la tarea y se envía una petición POST con los mismos datos
  const handleDuplicateTask = async (task: Task) => {
    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title + " (Duplicado)",
          description: task.description,
          category: task.category,
          priority: task.priority,
          projectId: project?._id,
          dueDate: task.dueDate,
          like: task.like || false,
        }),
      });
      if (!response.ok) throw new Error("Error al duplicar tarea");
      const duplicatedTask = await response.json();
      setProject((prev) =>
        prev
          ? {
              ...prev,
              categories: prev.categories.map((cat) =>
                cat._id === task.category
                  ? { ...cat, tasks: [...cat.tasks, duplicatedTask] }
                  : cat
              ),
            }
          : null
      );
    } catch (err) {
      console.error("Error duplicating task:", err);
    }
  };

  // Marcar como finalizada: se actualiza la tarea y se cambia su estado a "Finalizada"
  // y se actualiza su categoría a la del proyecto que tenga nombre "Finalizada"
  const handleMarkAsFinished = async (task: Task) => {
    try {
      // Buscar en el proyecto la categoría "Finalizada"
      const finalCat = project?.categories.find(cat => cat.name === "Finalizada");
      if (!finalCat) {
        console.error("No se encontró la categoría 'Finalizada'");
        return;
      }
      const response = await fetch("/api/task", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: task._id,
          status: "Finalizada",
          category: finalCat._id,
        }),
      });
      if (!response.ok) throw new Error("Error al marcar tarea como finalizada");
      const updatedTask = await response.json();
      // Actualizamos el proyecto: removemos la tarea de su categoría original y la agregamos a "Finalizada"
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.map((cat) => {
            if (cat._id === task.category) {
              return { ...cat, tasks: cat.tasks.filter(t => t._id !== task._id) };
            } else if (cat._id === finalCat._id) {
              return { ...cat, tasks: [...cat.tasks, updatedTask] };
            }
            return cat;
          }),
        };
      });
    } catch (err) {
      console.error("Error in handleMarkAsFinished:", err);
    }
  };

  // Ver detalles: abre un modal (aquí usamos un estado modalTask)
  const handleViewDetails = (task: Task) => {
    setModalTask(task);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalTask(null);
  };

  // Manejo del menú contextual (click derecho)
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenuTask) setContextMenuTask(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [contextMenuTask]);

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
    <div className="max-w-5xl text-accent relative">
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
                {/* Listado de tareas */}
                {tasksForCategory.length > 0 ? (
                  tasksForCategory.map((task) => {
                    // Si la tarea está en modo edición (por click en el lápiz), mostramos el área de edición
                    if (editingTaskId === task._id) {
                      return (
                        <div
                          key={task._id}
                          className="relative bg-white min-w-80 min-h-36 p-4 rounded-xl shadow-md border-2 border-accent/5 flex flex-col gap-5 justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <img src="/hexagon-icon.svg" className="w-5 h-5" />
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() => handleUpdateTask(task._id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleUpdateTask(task._id);
                              }}
                              className="text-accent font-medium flex-1 focus:outline-none"
                            />
                          </div>
                        </div>
                      );
                    }
                    // Modo visual (card de tarea)
                    return (
                      <div
                        key={task._id}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenuTask({
                            taskId: task._id,
                            x: e.clientX,
                            y: e.clientY,
                          });
                        }}
                        className="relative group bg-white min-w-80 min-h-36 p-4 rounded-xl shadow-md border-2 border-accent/5 flex flex-col gap-5 justify-between"
                      >
                        <div className="flex items-start w-full gap-2">
                          <img src="/hexagon-icon.svg" className="w-5 h-5" />
                          <h3 className="text-accent font-medium">
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <div
                              className={`badge ${
                                task.priority === "Media"
                                  ? "badge-warning"
                                  : task.priority === "Alta"
                                  ? "badge-error"
                                  : "badge-info"
                              } gap-1 text-accent`}
                            >
                              {task.priority}
                            </div>
                            <div
                              className={`badge ${
                                task.status === "Finalizada"
                                  ? "badge-success"
                                  : "badge-warning"
                              } gap-1 text-accent`}
                            >
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
                        <button
                          onClick={() =>
                            handleLikeTask(task._id, task.like || false)
                          }
                          className="absolute bottom-2 right-2"
                        >
                          <Heart
                            size={20}
                            className={task.like ? "text-primary" : "text-accent"}
                          />
                        </button>
                        {/* Ícono de lápiz para editar (al hacer click se activa la edición) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTaskId(task._id);
                            setEditTitle(task.title);
                            setEditPriority(task.priority);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 size={16} className="text-accent" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No hay tareas en esta categoría.</p>
                )}

                {/* Área de "Añadir tarea" */}
                {showAddTaskInput === category._id && (
                  <div className="relative bg-white min-w-80 min-h-36 p-4 rounded-xl shadow-md border-2 border-dotted border-gray-200 flex flex-col gap-5 justify-between">
                    <div className="flex items-center gap-2">
                      <img src="/hexagon-icon.svg" className="w-5 h-5" />
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onBlur={() => {
                          if (newTaskTitle.trim()) {
                            handleAddTask(category._id);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newTaskTitle.trim()) {
                            handleAddTask(category._id);
                          }
                        }}
                        className="text-accent font-medium flex-1 focus:outline-none"
                        placeholder="Título de la tarea"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="dropdown">
                        <button tabIndex={0} className="badge badge-lg bg-gray-300 text-accent">
                          {newTaskPriority}
                        </button>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
                        >
                          <li>
                            <a onClick={() => setNewTaskPriority("Alta")}>Alta</a>
                          </li>
                          <li>
                            <a onClick={() => setNewTaskPriority("Media")}>Media</a>
                          </li>
                          <li>
                            <a onClick={() => setNewTaskPriority("Baja")}>Baja</a>
                          </li>
                        </ul>
                      </div>
                      <button
                        onClick={() => dateInputRef.current?.showPicker()}
                        className="btn btn-ghost"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <input
                        type="date"
                        ref={dateInputRef}
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="hidden"
                      />
                      <button onClick={() => setNewTaskLike((prev) => !prev)}>
                        <Heart size={20} className={newTaskLike ? "text-primary" : "text-accent"} />
                      </button>
                    </div>
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
      {/* Menú contextual (click derecho) */}
      {contextMenuTask && (
        <div
          style={{
            position: "fixed",
            top: contextMenuTask.y,
            left: contextMenuTask.x,
            transform:
              contextMenuTask.x > window.innerWidth - 150
                ? "translateX(-100%)"
                : "none",
            zIndex: 1000,
          }}
          className="bg-base-100 shadow p-2 rounded"
        >
          <ul className="menu">
            <li>
              <a
                onClick={() => {
                  // Al hacer click en "Duplicar tarea"
                  const cat = project?.categories.find((cat) =>
                    cat.tasks.some((t) => t._id === contextMenuTask.taskId)
                  );
                  const task = cat?.tasks.find((t) => t._id === contextMenuTask.taskId);
                  if (task) {
                    handleDuplicateTask(task);
                  }
                  setContextMenuTask(null);
                }}
              >
                Duplicar tarea
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  // Marcar como finalizada
                  const cat = project?.categories.find((cat) =>
                    cat.tasks.some((t) => t._id === contextMenuTask.taskId)
                  );
                  const task = cat?.tasks.find((t) => t._id === contextMenuTask.taskId);
                  if (task) {
                    handleMarkAsFinished(task);
                  }
                  setContextMenuTask(null);
                }}
              >
                Marcar como finalizada
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  // Ver detalles
                  const cat = project?.categories.find((cat) =>
                    cat.tasks.some((t) => t._id === contextMenuTask.taskId)
                  );
                  const task = cat?.tasks.find((t) => t._id === contextMenuTask.taskId);
                  if (task) {
                    handleViewDetails(task);
                  }
                  setContextMenuTask(null);
                }}
              >
                Ver detalles
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  handleDeleteTask(contextMenuTask.taskId);
                  setContextMenuTask(null);
                }}
              >
                Eliminar <Trash2 size={16} className="ml-1" />
              </a>
            </li>
          </ul>
        </div>
      )}
      {/* Modal para ver detalles de la tarea */}
      {modalTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-accent"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">Detalles de la tarea</h2>
            <p><strong>Título:</strong> {modalTask.title}</p>
            <p><strong>Descripción:</strong> {modalTask.description}</p>
            <p><strong>Prioridad:</strong> {modalTask.priority}</p>
            <p><strong>Estado:</strong> {modalTask.status}</p>
            <p><strong>Fecha de vencimiento:</strong> {new Date(modalTask.dueDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Funciones auxiliares para menú contextual

async function handleDuplicateTask(task: Task) {
  try {
    const response = await fetch("/api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title + " (Duplicado)",
        description: task.description,
        category: task.category,
        priority: task.priority,
        projectId: task.category, // Se asume que se duplica en la misma categoría
        dueDate: task.dueDate,
        like: task.like || false,
      }),
    });
    if (!response.ok) throw new Error("Error al duplicar tarea");
    // Puedes actualizar el estado global si lo deseas
  } catch (err) {
    console.error("Error duplicating task:", err);
  }
}

async function handleMarkAsFinished(task: Task) {
  try {
    // Buscar en el proyecto la categoría "Finalizada" (se espera que exista)
    // Aquí, para simplicidad, se asume que el PUT actualiza el status y la categoría.
    const response = await fetch("/api/task", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: task._id,
        status: "Finalizada",
        // Aquí se podría enviar también la nueva categoría, si el backend lo admite.
      }),
    });
    if (!response.ok) throw new Error("Error al marcar como finalizada");
    // Puedes actualizar el estado global según la respuesta
  } catch (err) {
    console.error("Error marking task as finished:", err);
  }
}

function handleViewDetails(task: Task) {
  // Se delega a setModalTask en el componente principal (ya se hizo en el onClick)
}

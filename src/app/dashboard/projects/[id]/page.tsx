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
  FlagIcon,
  Flag,
  FlagTriangleRight,
  Calendar,
  UserRoundPlus,
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
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [showAddTaskInput, setShowAddTaskInput] = useState<string | null>(null);

  // Refs
  const dateInputRef = useRef<HTMLInputElement>(null);
  const editCardRef = useRef<HTMLDivElement>(null);
  const addCardRef = useRef<HTMLDivElement>(null);

  // Estados para el formulario de nueva tarea
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "Alta" | "Media" | "Baja"
  >("Baja");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskLike, setNewTaskLike] = useState(false);

  // Estados para edición
  const [editDueDate, setEditDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<"Alta" | "Media" | "Baja">(
    "Baja"
  );
  //
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para menú contextual (click derecho)
  const [contextMenuTask, setContextMenuTask] = useState<{
    taskId: string;
    x: number;
    y: number;
  } | null>(null);
  // Estado para modal de detalles
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // 3. Hook para detectar clicks fuera
  const useOnClickOutside = (
    ref: React.RefObject<HTMLElement>,
    handler: (e: Event) => void
  ) => {
    useEffect(() => {
      const listener = (event: Event) => {
        if (!ref.current || ref.current.contains(event.target as Node)) return;
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      return () => document.removeEventListener("mousedown", listener);
    }, [ref, handler]);
  };

  // Función para formatear la fecha correctamente
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00"); // Asegura la zona horaria local
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

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

    // Si el usuario no seleccionó fecha, se usa la actual en formato 'YYYY-MM-DD'
    const today = new Date();
    const formattedToday = today.toLocaleDateString("fr-CA"); // 'YYYY-MM-DD' en hora local (sin UTC)

    const dueDateToUse = newTaskDueDate.trim()
      ? newTaskDueDate // Si el usuario seleccionó fecha, se usa directamente
      : formattedToday; // Si no, usamos la fecha de hoy correctamente formateada

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
          dueDate: dueDateToUse, // Se envía en formato 'YYYY-MM-DD'
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

  // Modifica la función handleUpdateTask
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
          dueDate: editDueDate, // 👈 Añadir fecha
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
                  task._id === taskId ? { ...task, ...updatedTask } : task
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
  async function handleDuplicateTask(task: Task) {
    try {
      let newCategoryId = task.category;
      // Si la tarea está marcada como finalizada, buscamos la categoría "Finalizada" en el proyecto
      if (task.status === "Finalizada") {
        const finalCat = project?.categories.find(
          (cat) => cat.name === "Finalizada"
        );
        if (finalCat) {
          newCategoryId = finalCat._id;
        }
      }
      console.log(task);
      const formattedDueDate = new Date(task.dueDate)
        .toISOString()
        .split("T")[0];

      const response = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title + " (Duplicado)",
          description: task.description,
          category: newCategoryId, // Categoría final si corresponde
          priority: task.priority,
          projectId: project?._id,
          dueDate: formattedDueDate, // ✅ Convertida a YYYY-MM-DD
          like: task.like || false,
          status: task.status, // Mantener el mismo status
        }),
      });

      if (!response.ok) throw new Error("Error al duplicar tarea");
      const duplicatedTask = await response.json();
      // Actualizamos el estado local: agregamos el duplicado en la categoría correspondiente
      setProject((prev) =>
        prev
          ? {
              ...prev,
              categories: prev.categories.map((cat) =>
                cat._id === newCategoryId
                  ? { ...cat, tasks: [...cat.tasks, duplicatedTask] }
                  : cat
              ),
            }
          : null
      );
    } catch (err) {
      console.error("Error duplicating task:", err);
    }
  }

  // Marcar como finalizada: se actualiza la tarea y se cambia su estado a "Finalizada"
  // y se actualiza su categoría a la del proyecto que tenga nombre "Finalizada"
  const handleMarkAsFinished = async (task: Task) => {
    try {
      // Buscar la categoría "Finalizada" en el proyecto
      const finalCat = project?.categories.find(
        (cat) => cat.name === "Finalizada"
      );
      if (!finalCat) {
        console.error("No se encontró la categoría 'Finalizada'");
        return;
      }

      // 1. Actualizamos la tarea: cambiamos su status a "Finalizada"
      const responseTask = await fetch("/api/task", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: task._id,
          status: "Finalizada",
        }),
      });
      if (!responseTask.ok) throw new Error("Error al actualizar tarea");
      const updatedTask = await responseTask.json();

      // 2. Actualizamos la categoría antigua: removemos la tarea usando la API de Category
      const responseOldCat = await fetch("/api/category", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: task.category, // Se envía el id de la categoría antigua
          taskIdPull: task._id, // Indica que se debe remover la tarea
        }),
      });
      if (!responseOldCat.ok)
        throw new Error("Error al actualizar categoría antigua");

      // 3. Actualizamos la categoría "Finalizada": agregamos la tarea usando la API de Category
      const responseNewCat = await fetch("/api/category", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: finalCat._id, // ID de la categoría "Finalizada"
          taskId: task._id, // Indica que se debe agregar la tarea
        }),
      });
      if (!responseNewCat.ok)
        throw new Error("Error al actualizar categoría final");

      // 4. Actualizamos el estado local: removemos la tarea de la categoría antigua y la agregamos a la "Finalizada"
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.map((cat) => {
            if (cat._id === task.category) {
              return {
                ...cat,
                tasks: cat.tasks.filter((t) => t._id !== task._id),
              };
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

  const handleMarkAsInProgress = async (task: Task) => {
    try {
      // Buscamos la categoría "En curso" en el proyecto
      const inProgressCat = project?.categories.find(
        (cat) => cat.name === "En curso"
      );
      if (!inProgressCat) {
        console.error("No se encontró la categoría 'En curso'");
        return;
      }
      // Si la tarea ya está finalizada, la categoría actual es "Finalizada"
      const finishedCat = project?.categories.find(
        (cat) => cat.name === "Finalizada"
      );
      const oldCategoryId =
        task.status === "Finalizada" && finishedCat
          ? finishedCat._id.toString()
          : typeof task.category === "string"
          ? task.category
          : // @ts-ignore
            task.category._id?.toString();
      if (!oldCategoryId) {
        console.error("No se pudo determinar la categoría actual de la tarea");
        return;
      }
      // 1. Actualizamos la tarea: cambiamos su status a "En curso" y asignamos la categoría "En curso"
      const responseTask = await fetch("/api/task", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: task._id,
          status: "En curso",
          category: inProgressCat._id.toString(),
        }),
      });
      if (!responseTask.ok) throw new Error("Error al actualizar tarea");
      const updatedTask = await responseTask.json();

      // 2. Remover la tarea de la categoría antigua (que puede ser "Finalizada")
      const responseOldCat = await fetch("/api/category", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: oldCategoryId, // ID de la categoría actual (si la tarea estaba finalizada, es el id de "Finalizada")
          taskIdPull: task._id,
        }),
      });
      if (!responseOldCat.ok)
        throw new Error("Error al actualizar categoría antigua");

      // 3. Agregar la tarea a la categoría "En curso"
      const responseNewCat = await fetch("/api/category", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: inProgressCat._id.toString(), // ID de la categoría "En curso"
          taskId: task._id,
        }),
      });
      if (!responseNewCat.ok)
        throw new Error("Error al actualizar categoría en curso");

      // 4. Actualizamos el estado local:
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.categories.map((cat) => {
            if (String(cat._id) === oldCategoryId) {
              // Remover la tarea de la categoría antigua
              return {
                ...cat,
                tasks: cat.tasks.filter((t) => t._id !== task._id),
              };
            } else if (String(cat._id) === inProgressCat._id.toString()) {
              // Agregar la tarea a "En curso" solo si aún no existe
              const exists = cat.tasks.some((t) => t._id === task._id);
              return exists
                ? cat
                : { ...cat, tasks: [...cat.tasks, updatedTask] };
            }
            return cat;
          }),
        };
      });
    } catch (err) {
      console.error("Error in handleMarkAsInProgress:", err);
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
        <h1 className="text-2xl font-medium">{project?.name}</h1>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
          <UserRoundPlus className="text-red-400" size={18} />
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
                          ref={editCardRef}
                          className="relative bg-white min-w-80 min-h-36 p-4 rounded-xl shadow-md border-2 border-dotted border-gray-200 flex flex-col gap-5 justify-between"
                          // Se puede agregar onBlur en el contenedor si se desea detectar click fuera de toda la card
                          onBlur={(e) => {
                            // Se comprueba que el focus no se mueva dentro de la tarjeta
                            if (
                              !editCardRef.current?.contains(
                                e.relatedTarget as Node
                              )
                            ) {
                              handleUpdateTask(task._id);
                            }
                          }}
                          tabIndex={0} // Permite que el div reciba focus para detectar blur
                        >
                          {/* Primera línea: Título */}
                          <div className="flex items-center gap-2">
                            <img src="/hexagon-icon.svg" className="w-5 h-5" />
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleUpdateTask(task._id);
                              }}
                              className="text-accent font-medium flex-1 focus:outline-none"
                              placeholder="Título de la tarea"
                            />
                          </div>

                          {/* Segunda línea: Dropdown para prioridad y selector de fecha */}
                          <div className="flex justify-between">
                            {/* Dropdown de prioridad similar al de agregar tarea */}
                            <div className="dropdown z-50">
                              <button
                                tabIndex={0}
                                className="badge badge-lg text-accent"
                              >
                                {editPriority}
                              </button>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
                              >
                                <p className="flex items-center px-3 text-accent font-normal">
                                  <FlagTriangleRight size={20} /> Prioridad
                                </p>
                                <div className="divider mt-0"></div>
                                <div className="flex flex-col gap-3 pb-2 pl-1">
                                  <li className="bg-transparent hover:bg-transparent active:bg-transparent">
                                    <a
                                      className="badge badge-error cursor-pointer p-0 px-2 !bg-error hover:!bg-error/90 active:!bg-error focus:!bg-error !text-accent"
                                      onClick={() => setEditPriority("Alta")}
                                    >
                                      Alta
                                    </a>
                                  </li>
                                  <li className="bg-transparent hover:bg-transparent active:bg-transparent">
                                    <a
                                      className="badge badge-warning cursor-pointer p-0 px-2 !bg-warning hover:!bg-warning/90 active:!bg-warning focus:!bg-warning !text-accent"
                                      onClick={() => setEditPriority("Media")}
                                    >
                                      Media
                                    </a>
                                  </li>
                                  <li className="bg-transparent hover:bg-transparent active:bg-transparent">
                                    <a
                                      className="badge badge-info cursor-pointer p-0 px-2 !bg-info hover:!bg-info/90 active:!bg-info focus:!bg-info !text-accent"
                                      onClick={() => setEditPriority("Baja")}
                                    >
                                      Baja
                                    </a>
                                  </li>
                                </div>
                              </ul>
                            </div>
                            {/* Selector de fecha: se muestra la fecha formateada o el icono si no se ha seleccionado */}
                            <div className="flex justify-between">
                              {editDueDate ? (
                                <span
                                  className="text-accent cursor-pointer hover:text-slate-700"
                                  onClick={() =>
                                    dateInputRef.current?.showPicker()
                                  }
                                >
                                  {formatDate(editDueDate)}
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    dateInputRef.current?.showPicker()
                                  }
                                  className="hover:text-slate-700"
                                >
                                  <Calendar />
                                </button>
                              )}

                              <input
                                type="date"
                                ref={dateInputRef}
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className=" opacity-0 cursor-pointer"
                              />
                            </div>
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
                              {new Date(task.dueDate).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
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
                            className={
                              task.like ? "text-primary" : "text-accent"
                            }
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
                  <p className="text-gray-500">
                    No hay tareas en esta categoría.
                  </p>
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
                    <div className="z-50 flex justify-between items-center">
                      <div className="dropdown">
                        <button
                          tabIndex={0}
                          className="badge badge-lg  text-accent"
                        >
                          {newTaskPriority}
                        </button>
                        <ul
                          tabIndex={0}
                          className=" dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32"
                        >
                          {/* Ítem de explicación */}
                          <p className="flex items-center px-3 text-accent font-normal text-left">
                            <FlagTriangleRight size={20} />
                            Prioridad
                          </p>
                          <div className="divider mt-0"></div>
                          {/* Opciones de prioridad con la clase badge */}
                          <div className="flex flex-col gap-3 pb-2 pl-1">
                            <li className="bg-transparent hover:bg-transparent active:bg-transparent">
                              <a
                                className="badge badge-error cursor-pointer p-0 px-2 !bg-error hover:!bg-error/90 active:!bg-error focus:!bg-error !text-accent hover:!text-accent active:!text-accent focus:!text-accent"
                                onClick={() => setNewTaskPriority("Alta")}
                              >
                                Alta
                              </a>
                            </li>

                            <li className="bg-transparent hover:bg-transparent active:bg-transparent">
                              <a
                                className="badge badge-warning cursor-pointer p-0 px-2 !bg-warning hover:!bg-warning/90 active:!bg-warning focus:!bg-warning !text-accent hover:!text-accent active:!text-accent focus:!text-accent"
                                onClick={() => setNewTaskPriority("Media")}
                              >
                                Media
                              </a>
                            </li>

                            <li className="bg-transparent hover:bg-transparent active:bg-transparent">
                              <a
                                className="badge badge-info cursor-pointer p-0 px-2 !bg-info hover:!bg-info/90 active:!bg-info focus:!bg-info !text-accent hover:!text-accent active:!text-accent focus:!text-accent"
                                onClick={() => setNewTaskPriority("Baja")}
                              >
                                Baja
                              </a>
                            </li>
                          </div>
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-between w-full">
                      {newTaskDueDate ? (
                        <span
                          className="text-accent cursor-pointer hover:text-slate-700"
                          onClick={() => dateInputRef.current?.showPicker()}
                        >
                          {formatDate(newTaskDueDate)}
                        </span>
                      ) : (
                        <button
                          onClick={() => dateInputRef.current?.showPicker()}
                          className="hover:text-slate-700"
                        >
                          <Calendar />
                        </button>
                      )}

                      <input
                        type="date"
                        ref={dateInputRef}
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="-z-50"
                      />

                      <button onClick={() => setNewTaskLike((prev) => !prev)}>
                        <Heart
                          size={20}
                          className={
                            newTaskLike ? "text-primary" : "text-accent"
                          }
                        />
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
                  const task = cat?.tasks.find(
                    (t) => t._id === contextMenuTask.taskId
                  );
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
                  const cat = project?.categories.find((cat) =>
                    cat.tasks.some((t) => t._id === contextMenuTask!.taskId)
                  );
                  const task = cat?.tasks.find(
                    (t) => t._id === contextMenuTask!.taskId
                  );
                  if (task) {
                    if (task.status === "Finalizada") {
                      // Si ya está finalizada, se cambia a en curso
                      handleMarkAsInProgress(task);
                    } else {
                      // Sino, se marca como finalizada
                      handleMarkAsFinished(task);
                    }
                  }
                  setContextMenuTask(null);
                }}
              >
                {(() => {
                  const cat = project?.categories.find((cat) =>
                    cat.tasks.some((t) => t._id === contextMenuTask!.taskId)
                  );
                  const task = cat?.tasks.find(
                    (t) => t._id === contextMenuTask!.taskId
                  );
                  return task?.status === "Finalizada"
                    ? "Marcar como en curso"
                    : "Marcar como finalizada";
                })()}
              </a>
            </li>

            <li>
              <a
                onClick={() => {
                  const cat = project?.categories.find((cat) =>
                    cat.tasks.some((t) => t._id === contextMenuTask.taskId)
                  );
                  const task = cat?.tasks.find(
                    (t) => t._id === contextMenuTask.taskId
                  );
                  if (task) {
                    setModalTask(task);
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
                  const cat = project?.categories.find((cat) =>
                    cat.tasks.some((t) => t._id === contextMenuTask!.taskId)
                  );
                  const task = cat?.tasks.find(
                    (t) => t._id === contextMenuTask!.taskId
                  );
                  if (task) {
                    setTaskToDelete(task);
                  }
                  setContextMenuTask(null);
                }}
              >
                Eliminar <Trash2 size={16} className="ml-1" />
              </a>
            </li>
          </ul>
        </div>
      )}

      {modalTask && (
        <dialog
          open
          className="modal bg-black/30 backdrop-blur-sm"
          onClick={(e) => {
            // Si se hace click en el backdrop (no en el contenido), se cierra el modal
            if (e.target === e.currentTarget) {
              setModalTask(null);
            }
          }}
        >
          <div className="modal-box relative">
            <button
              onClick={() => setModalTask(null)}
              className="btn btn-ghost absolute top-2 right-2"
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">Detalles de la tarea</h2>
            <p>
              <strong>Título:</strong> {modalTask.title}
            </p>
            <p>
              <strong>Descripción:</strong> {modalTask.description}
            </p>
            <p>
              <strong>Prioridad:</strong> {modalTask.priority}
            </p>
            <p>
              <strong>Estado:</strong> {modalTask.status}
            </p>
            <p>
              <strong>Fecha de vencimiento:</strong>{" "}
              {new Date(modalTask.dueDate).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <div className="modal-action">
              <button onClick={() => setModalTask(null)} className="btn">
                Cerrar
              </button>
            </div>
          </div>
        </dialog>
      )}

      {taskToDelete && (
        <dialog
          open
          className="modal bg-black/30 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setTaskToDelete(null);
            }
          }}
        >
          <div className="modal-box relative">
            <h3 className="font-bold text-lg">¿Estás seguro?</h3>
            <p className="py-4">
              La tarea <span className="text-accent">{taskToDelete.title}</span>{" "}
              se eliminará permanentemente.
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setTaskToDelete(null)}>
                Cancelar
              </button>
              <button
                className="btn btn-error"
                onClick={async () => {
                  await handleDeleteTask(taskToDelete._id);
                  setTaskToDelete(null);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

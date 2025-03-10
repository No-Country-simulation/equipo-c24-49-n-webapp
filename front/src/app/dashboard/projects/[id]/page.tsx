"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, UserPlus, MoreHorizontal } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  status: "En curso" | "En pausa" | "Finalizada";
  priority: "Alta" | "Media" | "Baja";
  dueDate?: string;
  category: string; // 👈 La tarea pertenece a una categoría específica
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
  tasks: Task[]; // 👈 Las tareas están en el proyecto, no en las categorías
}

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [showAddTaskInput, setShowAddTaskInput] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          category: categoryId, // 👈 La tarea pertenece a una categoría
          priority: "Baja",
          projectId: project?._id, // 👈 Asegurar que la tarea se vincula al proyecto
        }),
      });

      if (!response.ok) throw new Error("Error al crear tarea");

      const newTaskData = await response.json();

      // Agregar la nueva tarea al estado del proyecto
      setProject((prev) =>
        prev ? { ...prev, tasks: [...prev.tasks, newTaskData] } : null
      );

      setNewTaskTitle("");
      setShowAddTaskInput(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al crear la tarea");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-2">
              {[1, 2].map((j) => (
                <div key={j} className="h-12 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
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
    // Obtener tareas desde la categoría
    const tasksForCategory = category.tasks || [];
    console.log("testtttttt")
    console.log(tasksForCategory)
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
            tasksForCategory.map((task) => (
              <div
                key={task._id}
                className="bg-white min-w-80 min-h-36 p-4 rounded-xl shadow-md border-2 border-accent/5 flex flex-col gap-5 justify-between"
              >
                <div className="flex items-start w-full gap-2">
                  <img src="/hexagon-icon.svg" className="w-5 h-5" />
                  <h3 className="text-accent font-medium">{task.title}</h3>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="badge badge-info gap-1 text-accent">
                      {task.priority}
                    </div>
                    <div className="badge badge-info gap-1 text-accent">
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
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay tareas en esta categoría.</p>
          )}

          {showAddTaskInput === category._id && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="text-accent font-medium w-full p-1 border border-gray-300 rounded-md"
                placeholder="Escribe el nombre de la tarea"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAddTask(category._id)
                }
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-5 opacity-70 justify-center cursor-pointer">
          <button
            onClick={() => {
              setShowAddTaskInput(category._id);
              setNewTaskTitle("");
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

import Project from "@/models/project";
import Task from "@/models/task";
import Category from "@/models/category";
import { Types } from "mongoose";

export const createDefaultProjects = async (userId: Types.ObjectId) => {
  try {
    // Verificar si el usuario ya tiene proyectos
    const existingProjects = await Project.find({ creator: userId });
    if (existingProjects.length > 0) return;

    // Lista de proyectos por defecto
    const defaultProjects = [
      {
        name: "Planificación del Sitio Web",
        description: "Organización y planificación de un nuevo sitio web corporativo.",
        creator: userId,
        backgroundType: "image",
        backgroundImage: "/covers/miel.svg",
      },
      {
        name: "Desarrollo de Aplicación Móvil",
        description: "Proyecto para crear una aplicación móvil para el control de inventario.",
        creator: userId,
        backgroundType: "image",
        backgroundImage: "/covers/rosa.svg",
      },
      {
        name: "Automatización de Procesos",
        description: "Implementación de automatización en los procesos internos de la empresa.",
        creator: userId,
        backgroundType: "image",
        backgroundImage: "/covers/nube.svg",
      },
    ];

    // Insertar proyectos y obtener sus IDs
    const createdProjects = await Project.insertMany(defaultProjects);

    for (const project of createdProjects) {
      // Crear categorías fijas asociadas al proyecto
      const categories = await Category.insertMany([
        { name: "En Proceso", project: project._id },
        { name: "Finalizada", project: project._id },
        { name: "En Pausa", project: project._id },
      ]);

      // Verificar si las categorías se crearon correctamente
      if (!categories || categories.length !== 3) {
        console.error("❌ Error: No se crearon correctamente todas las categorías.");
        return;
      }

      // Obtener los IDs de las categorías creadas
      const categoryIds = categories.map((category) => category._id);

      // Actualizar el proyecto para incluir las categorías creadas
      await Project.findByIdAndUpdate(project._id, {
        $set: { categories: categoryIds },
      });

      // Crear mapa de categorías para asignarlas a las tareas
      const categoryMap: { [key: string]: Types.ObjectId } = {};
      categories.forEach((category) => {
        categoryMap[category.name] = category._id as Types.ObjectId;
      });

      // Crear tareas asegurando el uso correcto de los ObjectId
      const tasks = [
        {
          title: "Definir estructura de la página",
          description: "Planificar la estructura del sitio web antes del desarrollo.",
          category: categoryMap["En Proceso"],
          priority: "Alta",
          status: "En curso",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          project: project._id,
        },
        {
          title: "Revisión de requisitos",
          description: "Revisar y validar los requisitos del proyecto con el equipo.",
          category: categoryMap["En Pausa"],
          priority: "Media",
          status: "En pausa",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          project: project._id,
        },
        {
          title: "Diseño final aprobado",
          description: "Aprobación final del diseño antes de pasar al desarrollo.",
          category: categoryMap["Finalizada"],
          priority: "Baja",
          status: "Finalizada",
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          project: project._id,
        },
      ];

      // Insertar tareas en la base de datos
      const tasksToCreate = tasks.map(taskData => new Task(taskData));
      const createdTasks = await Task.insertMany(tasksToCreate);

      // Agrupar tareas por categoría
      const tasksByCategory: { [key: string]: Types.ObjectId[] } = {};
      for (const task of createdTasks) {
        const categoryId = task.category.toString();
        if (!tasksByCategory[categoryId]) {
          tasksByCategory[categoryId] = [];
        }
        tasksByCategory[categoryId].push(task._id);
      }

      // Actualizar todas las categorías de una sola vez
      for (const [categoryId, taskIds] of Object.entries(tasksByCategory)) {
        await Category.findByIdAndUpdate(categoryId, {
          $push: { tasks: { $each: taskIds } },
        });
      }
    }
  } catch (error) {
    console.error("❌ Error al crear los proyectos por defecto:", error);
  }
};
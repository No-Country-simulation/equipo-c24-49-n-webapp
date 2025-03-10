import Project from "@/models/project";
import Task from "@/models/task";
import Category from "@/models/category";
import User from "@/models/user";
import { Types } from "mongoose";

export const createDefaultProjects = async (userId: Types.ObjectId) => {
  try {
    // Verificar si el usuario ya tiene proyectos por defecto creados
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      console.error("❌ Usuario no encontrado.");
      return;
    }
    if (existingUser.hasDefaultProjects) return;

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
    if (!createdProjects || createdProjects.length === 0) {
      console.error("❌ No se pudieron crear los proyectos por defecto.");
      return;
    }

    for (const project of createdProjects) {
      // Crear categorías fijas asociadas al proyecto
      const categories = await Category.insertMany([
        { name: "En Proceso", project: project._id },
        { name: "Hecho", project: project._id },
        { name: "En Pausa", project: project._id },
      ]);

      if (!categories || categories.length !== 3) {
        console.error("❌ Error: No se crearon correctamente todas las categorías.");
        return;
      }

      const categoryMap: { [key: string]: Types.ObjectId } = {};
      categories.forEach((category) => {
        categoryMap[category.name] = category._id as Types.ObjectId;
      });

      // Crear tareas asociadas a las categorías
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
          category: categoryMap["Hecho"],
          priority: "Baja",
          status: "Finalizada",
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          project: project._id,
        },
      ];

      const tasksToCreate = tasks.map(taskData => new Task(taskData));
      const createdTasks = await Task.insertMany(tasksToCreate);
      if (!createdTasks || createdTasks.length === 0) {
        console.error("❌ No se pudieron crear las tareas por defecto.");
        return;
      }

      // Agrupar tareas por categoría y actualizar las categorías en paralelo
      const tasksByCategory: { [key: string]: Types.ObjectId[] } = {};
      for (const task of createdTasks) {
        const categoryId = task.category.toString();
        if (!tasksByCategory[categoryId]) {
          tasksByCategory[categoryId] = [];
        }
        tasksByCategory[categoryId].push(task._id);
      }

      await Promise.all(
        Object.entries(tasksByCategory).map(([categoryId, taskIds]) =>
          Category.findByIdAndUpdate(categoryId, {
            $push: { tasks: { $each: taskIds } },
          })
        )
      );
    }

    // Marcar que el usuario ya tiene los proyectos creados
    existingUser.hasDefaultProjects = true;
    await existingUser.save();

    console.log("✅ Proyectos, categorías y tareas por defecto creados con éxito.");
  } catch (error) {
    console.error("❌ Error al crear los proyectos por defecto:", error);
  }
};

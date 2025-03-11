import Project from "@/models/project";
import Task from "@/models/task";
import Category from "@/models/category";
import { Schema, Types } from "mongoose";

export const createDefaultProjects = async (userId: Types.ObjectId) => {
  try {
    // Verificar si el usuario ya tiene proyectos
    const existingProjects = await Project.find({ creator: userId });
    if (existingProjects.length > 0) return;

    // Crear proyectos por defecto
    const project1 = await Project.create({
      name: "Planificación del Sitio Web",
      description:
        "Organización y planificación de un nuevo sitio web corporativo.",
      creator: userId,
      backgroundType: "image",
      backgroundImage: "/covers/miel.svg",
    });

    const project2 = await Project.create({
      name: "Desarrollo de Aplicación Móvil",
      description:
        "Proyecto para crear una aplicación móvil para el control de inventario.",
      creator: userId,
      backgroundType: "image",
      backgroundImage: "/covers/rosa.svg",
    });

    const project3 = await Project.create({
      name: "Automatización de Procesos",
      description:
        "Implementación de automatización en los procesos internos de la empresa.",
      creator: userId,
      backgroundType: "image",
      backgroundImage: "/covers/nube.svg",
    });

    // Crear categorías para cada proyecto
    const categoriesProject1 = await Category.insertMany([
      { name: "En Proceso", project: project1._id },
      { name: "En Pausa", project: project1._id },
      { name: "Finalizada", project: project1._id },
    ]);

    const categoriesProject2 = await Category.insertMany([
      { name: "En Proceso", project: project2._id },
      { name: "En Pausa", project: project2._id },
      { name: "Finalizada", project: project2._id },
    ]);

    const categoriesProject3 = await Category.insertMany([
      { name: "En Proceso", project: project3._id },
      { name: "En Pausa", project: project3._id },
      { name: "Finalizada", project: project3._id },
    ]);

    // Actualizar proyectos con las categorías creadas
    await Project.findByIdAndUpdate(project1._id, {
      $set: { categories: categoriesProject1.map((cat) => cat._id) },
    });

    await Project.findByIdAndUpdate(project2._id, {
      $set: { categories: categoriesProject2.map((cat) => cat._id) },
    });

    await Project.findByIdAndUpdate(project3._id, {
      $set: { categories: categoriesProject3.map((cat) => cat._id) },
    });

    // Crear tareas para el proyecto 1: Planificación del Sitio Web
    const tasksProject1 = await Task.insertMany([
      // Tareas para la categoría "En Proceso"
      //@ts-ignore
      {
        title: "Definir estructura de la página",
        description:
          "Planificar la estructura del sitio web antes del desarrollo.",
        category: categoriesProject1[0]._id as Schema.Types.ObjectId, // Casteo explícito
        priority: "Alta",
        status: "En curso",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
        project: project1._id as Schema.Types.ObjectId, // Casteo explícito
      },
      //@ts-ignore
      {
        title: "Crear wireframes",
        description:
          "Diseñar wireframes para las principales páginas del sitio web.",
        category: categoriesProject1[0]._id as Schema.Types.ObjectId,
        priority: "Media",
        status: "En curso",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días desde ahora
        project: project1._id as Schema.Types.ObjectId,
      },
      // Tareas para la categoría "En Pausa"
      //@ts-ignore
      {
        title: "Revisión de requisitos",
        description:
          "Revisar y validar los requisitos del proyecto con el equipo.",
        category: categoriesProject1[2]._id as Schema.Types.ObjectId,
        priority: "Media",
        status: "En pausa",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días desde ahora
        project: project1._id as Schema.Types.ObjectId,
      },
      // Tareas para la categoría "Finalizada"
      //@ts-ignore
      {
        title: "Diseño final aprobado",
        description:
          "Aprobación final del diseño antes de pasar al desarrollo.",
        category: categoriesProject1[1]._id as Schema.Types.ObjectId,
        priority: "Baja",
        status: "Finalizada",
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
        project: project1._id as Schema.Types.ObjectId,
      },
      //@ts-ignore
      {
        title: "Seleccionar paleta de colores",
        description:
          "Definir la paleta de colores que se usará en el sitio web.",
        category: categoriesProject1[1]._id as Schema.Types.ObjectId,
        priority: "Baja",
        status: "Finalizada",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
        project: project1._id as Schema.Types.ObjectId,
      },
    ]);

    // Actualizar categorías con las tareas creadas
    await Category.findByIdAndUpdate(categoriesProject1[0]._id, {
      $push: {
        tasks: { $each: [tasksProject1[0]._id, tasksProject1[1]._id] }, // Agregar tareas a "En Proceso"
      },
    });

    await Category.findByIdAndUpdate(categoriesProject1[1]._id, {
      $push: { tasks: tasksProject1[2]._id }, // Agregar tarea a "En Pausa"
    });

    await Category.findByIdAndUpdate(categoriesProject1[2]._id, {
      $push: {
        tasks: { $each: [tasksProject1[3]._id, tasksProject1[4]._id] }, // Agregar tareas a "Finalizada"
      },
    });

    // Crear tareas para el proyecto 2: Desarrollo de Aplicación Móvil
    const tasksProject2 = await Task.insertMany([
      // Tareas para la categoría "En Proceso"
      //@ts-ignore
      {
        title: "Definir funcionalidades principales",
        description: "Listar las funcionalidades clave de la aplicación móvil.",
        category: categoriesProject2[0]._id as Schema.Types.ObjectId,
        priority: "Alta",
        status: "En curso",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
        project: project2._id as Schema.Types.ObjectId,
      },
      //@ts-ignore
      {
        title: "Diseñar interfaz de usuario",
        description: "Crear los diseños de la interfaz de usuario.",
        category: categoriesProject2[0]._id as Schema.Types.ObjectId,
        priority: "Media",
        status: "En curso",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días desde ahora
        project: project2._id as Schema.Types.ObjectId,
      },
      // Tareas para la categoría "Finalizada"
      //@ts-ignore
      {
        title: "Configurar entorno de desarrollo",
        description: "Preparar el entorno para el desarrollo de la aplicación.",
        category: categoriesProject2[1]._id as Schema.Types.ObjectId,
        priority: "Baja",
        status: "Finalizada",
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
        project: project2._id as Schema.Types.ObjectId,
      },
      //@ts-ignore
      {
        title: "Revisar documentación técnica",
        description:
          "Revisar y actualizar la documentación técnica del proyecto.",
        category: categoriesProject2[1]._id as Schema.Types.ObjectId,
        priority: "Baja",
        status: "Finalizada",
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 días atrás
        project: project2._id as Schema.Types.ObjectId,
      },
    ]);

    // Actualizar categorías con las tareas creadas
    await Category.findByIdAndUpdate(categoriesProject2[0]._id, {
      $push: {
        tasks: { $each: [tasksProject2[0]._id, tasksProject2[1]._id] }, // Agregar tareas a "En Proceso"
      },
    });

    await Category.findByIdAndUpdate(categoriesProject2[2]._id, {
      $push: {
        tasks: { $each: [tasksProject2[2]._id, tasksProject2[3]._id] }, // Agregar tareas a "Finalizada"
      },
    });

    // Crear tareas para el proyecto 3: Automatización de Procesos
    const tasksProject3 = await Task.insertMany([
      // Tareas para la categoría "En Proceso"
      //@ts-ignore
      {
        title: "Identificar procesos a automatizar",
        description: "Listar los procesos que se pueden automatizar.",
        category: categoriesProject3[0]._id as Schema.Types.ObjectId,
        priority: "Alta",
        status: "En curso",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
        project: project3._id as Schema.Types.ObjectId,
      },
      //@ts-ignore
      {
        title: "Seleccionar herramientas de automatización",
        description:
          "Elegir las herramientas adecuadas para la automatización.",
        category: categoriesProject3[0]._id as Schema.Types.ObjectId,
        priority: "Media",
        status: "En curso",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días desde ahora
        project: project3._id as Schema.Types.ObjectId,
      },
      // Tareas para la categoría "Finalizada"
      //@ts-ignore
      {
        title: "Implementar automatización de facturación",
        description: "Automatizar el proceso de facturación.",
        category: categoriesProject3[1]._id as Schema.Types.ObjectId,
        priority: "Alta",
        status: "Finalizada",
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 días atrás
        project: project3._id as Schema.Types.ObjectId,
      },
      //@ts-ignore
      {
        title: "Capacitar al equipo",
        description:
          "Capacitar al equipo en el uso de las nuevas herramientas.",
        category: categoriesProject3[1]._id as Schema.Types.ObjectId,
        priority: "Baja",
        status: "Finalizada",
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
        project: project3._id as Schema.Types.ObjectId,
      },
    ]);

    // Actualizar categorías con las tareas creadas
    await Category.findByIdAndUpdate(categoriesProject3[0]._id, {
      $push: {
        tasks: { $each: [tasksProject3[0]._id, tasksProject3[1]._id] }, // Agregar tareas a "En Proceso"
      },
    });

    await Category.findByIdAndUpdate(categoriesProject3[2]._id, {
      $push: {
        tasks: { $each: [tasksProject3[2]._id, tasksProject3[3]._id] }, // Agregar tareas a "Finalizada"
      },
    });

    console.log("Proyectos y tareas por defecto creados exitosamente.");
  } catch (error) {
    console.error("❌ Error al crear los proyectos por defecto:", error);
  }
};

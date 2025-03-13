import { NextResponse } from "next/server";
import Task, { ITask } from "@/models/task";
import Category from "@/models/category";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Se requiere categoryId" },
        { status: 400 }
      );
    }

    // Verificar acceso a la categoría
    const category = await Category.findById(categoryId).populate({
      path: "project",
      select: "creator collaborators",
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }
    const project = category.project as any;
    const hasAccess =
      project.creator.toString() === session.user._id ||
      project.collaborators.some(
        (c: any) => c.user.toString() === session.user._id
      );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Acceso no autorizado" },
        { status: 403 }
      );
    }

    const query = {
      category: categoryId,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
      ...(status && { status }),
    };

    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limit);

    const TaskModel = mongoose.model('Task');
    const tasks = await TaskModel.find(query)
      .populate("category", "name")
      .populate("assignedTo", "fullname email avatar")
      .lean()
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      tasks,
      currentPage: page,
      totalPages,
      totalTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      {
        error: "Error al recuperar tareas",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const {
      title,
      description,
      category: categoryId,
      status,
      priority,
      dueDate,
      assignedTo,
      like
    } = await request.json();

    if (!title || !categoryId || !dueDate) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Buscar la categoría y poblar el proyecto
    const fetchedCategory = await Category.findById(categoryId).populate({
      path: "project",
      select: "creator collaborators name",
    });
    if (!fetchedCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    }
    const project = fetchedCategory.project as any;

    const isAllowed =
      project.creator.toString() === session.user._id ||
      project.collaborators.some(
        (c: any) =>
          c.user.toString() === session.user._id &&
          ["admin", "editor"].includes(c.role)
      );
    if (!isAllowed) {
      return NextResponse.json(
        { error: "No tienes permiso para crear tareas" },
        { status: 403 }
      );
    }

    const newTask = new Task({
      title,
      description,
      project: project._id,
      category: categoryId,
      status: status || fetchedCategory.name, // Ahora usamos fetchedCategory.name
      priority: priority,
      dueDate: new Date(dueDate),
      like: like,
      assignedTo: assignedTo || null,
    });

    await newTask.save();

    await Category.findByIdAndUpdate(categoryId, {
      $push: { tasks: newTask._id },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Error al crear la tarea" },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { _id, ...data } = await request.json();

    // Obtener tarea y verificar permisos
    const TaskModel = mongoose.model("Task");
    const task = await TaskModel.findById(_id).populate({
      path: "category",
      populate: {
        path: "project",
        select: "creator collaborators",
      },
    });
    if (!task) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }
    const project = (task.category as any).project;
    const isCreator = project.creator.toString() === session.user._id;
    const isAdmin = project.collaborators.some(
      (c: any) => c.user.toString() === session.user._id && c.role === "admin"
    );
    const isEditor = project.collaborators.some(
      (c: any) => c.user.toString() === session.user._id && c.role === "editor"
    );
    const isAssignedUser = task.assignedTo?.toString() === session.user._id;
    // Solo admin/editor pueden editar todos los campos
    const canEditAll = isCreator || isAdmin || isEditor;
    // Usuario asignado solo puede cambiar el estado
    if (
      !canEditAll &&
      isAssignedUser &&
      Object.keys(data).every((k) => k === "status")
    ) {
      const updatedTask = await TaskModel.findByIdAndUpdate(
        _id,
        { status: data.status },
        { new: true }
      );
      return NextResponse.json(updatedTask);
    }
    if (!canEditAll) {
      return NextResponse.json(
        { error: "No tienes permiso para editar esta tarea" },
        { status: 403 }
      );
    }

    // Si se está marcando como finalizada, se espera que se envíe data.category
    // que corresponde al ID de la categoría "Finalizada"
    if (data.status === "Finalizada" && data.category) {
      const oldCategoryId =
        typeof task.category === "string"
          ? task.category
          : task.category._id?.toString();
      const newCategoryId = data.category.toString();
      const oldCatObjId = new mongoose.Types.ObjectId(oldCategoryId);
      const newCatObjId = new mongoose.Types.ObjectId(newCategoryId);
      // Actualizamos la tarea con los nuevos datos
      const updatedTask = await TaskModel.findByIdAndUpdate(
        _id,
        data,
        { new: true, runValidators: true }
      );
      if (oldCategoryId !== newCategoryId) {
        await Category.findByIdAndUpdate(oldCatObjId, {
          $pull: { tasks: _id },
        });
        await Category.findByIdAndUpdate(newCatObjId, {
          $push: { tasks: _id },
        });
      }
      return NextResponse.json(updatedTask);
    }

    // Para el resto de las actualizaciones (como marcar como "En curso")
    // Si data.category existe, forzamos la conversión a ObjectId
    if (data.category) {
      data.category = new mongoose.Types.ObjectId(data.category);
    }
    const updatedTask = await TaskModel.findByIdAndUpdate(_id, data, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Error al actualizar la tarea", details: error.message },
      { status: 500 }
    );
  }
}



export async function DELETE(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { _id } = await request.json();

    // Verificar permisos
    const TaskModel = mongoose.model('Task');
    const task = await TaskModel.findById(_id).populate({
      path: "category",
      populate: {
        path: "project",
        select: "creator collaborators",
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 }
      );
    }
    const project = (task.category as any).project;
    const isAllowed =
      project.creator.toString() === session.user._id ||
      project.collaborators.some(
        (c: any) =>
          c.user.toString() === session.user._id &&
          ["admin", "editor"].includes(c.role)
      );

    if (!isAllowed) {
      return NextResponse.json(
        {
          error: "No tienes permiso para eliminar esta tarea",
        },
        { status: 403 }
      );
    }

    // Eliminar tarea y su referencia en la categoría
    await Promise.all([
      TaskModel.findByIdAndDelete(_id),
      Category.findByIdAndUpdate(task.category, {
        $pull: { tasks: _id },
      }),
    ]);

    return NextResponse.json({ message: "Tarea eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar la tarea",
      },
      { status: 500 }
    );
  }
}

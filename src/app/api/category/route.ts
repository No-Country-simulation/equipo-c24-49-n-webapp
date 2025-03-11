import { NextResponse } from "next/server";
import Category, { ICategory } from "@/models/category";
import Project from "@/models/project";
import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./../auth/[...nextauth]/options";

export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const projectId = searchParams.get("projectId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!projectId) {
      return NextResponse.json(
        { error: "Se requiere projectId" },
        { status: 400 }
      );
    }

    // Verificar acceso al proyecto
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { creator: session.user._id },
        { collaborators: { $elemMatch: { user: session.user._id } } },
      ],
    });

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado o sin acceso" },
        { status: 404 }
      );
    }

    const query = {
      project: projectId,
      name: { $regex: search, $options: "i" },
    };

    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);

    const categories = (await Category.find(query)
      .populate("tasks", "title status")
      .lean()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)) as ICategory[];

    return NextResponse.json({
      categories,
      currentPage: page,
      totalPages,
      totalCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Error al recuperar categorías",
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

    const { projectId, name } = await request.json();

    // Verificar si el projectId es válido
    if (!projectId || !projectId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: "ID de proyecto no válido" },
        { status: 400 }
      );
    }

    // Verificar permisos en el proyecto
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { creator: session.user._id },
        {
          collaborators: {
            $elemMatch: {
              user: session.user._id,
              role: { $in: ["admin", "editor"] },
            },
          },
        },
      ],
    });

    if (!project) {
      return NextResponse.json(
        {
          error: "Proyecto no encontrado o sin permisos suficientes",
        },
        { status: 403 }
      );
    }

    // Crear la nueva categoría asegurando que tasks sea un array vacío
    const newCategory = new Category({
      name,
      project: projectId,
      tasks: [], // Asegurar que inicia vacío
    });

    await newCategory.save();

    // Actualizar proyecto con la nueva categoría
    await Project.findByIdAndUpdate(projectId, {
      $push: { categories: newCategory._id },
    });

    // Verificar si se guardó correctamente y retornar los datos populados
    const categoryWithTasks = await Category.findById(newCategory._id)
      .populate("tasks", "title status")
      .lean();

    return NextResponse.json(categoryWithTasks, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        error: "Error al crear la categoría",
      },
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

    // Verificar permisos
    const category = await Category.findById(_id).populate({
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
    const hasPermission =
      project.creator.toString() === session.user._id ||
      project.collaborators.some(
        (c: any) =>
          c.user.toString() === session.user._id &&
          ["admin", "editor"].includes(c.role)
      );

    if (!hasPermission) {
      return NextResponse.json(
        {
          error: "No tienes permiso para editar esta categoría",
        },
        { status: 403 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar la categoría",
      },
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
    const category = await Category.findById(_id).populate({
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
    const hasPermission =
      project.creator.toString() === session.user._id ||
      project.collaborators.some(
        (c: any) =>
          c.user.toString() === session.user._id && ["admin"].includes(c.role)
      );

    if (!hasPermission) {
      return NextResponse.json(
        {
          error: "No tienes permiso para eliminar esta categoría",
        },
        { status: 403 }
      );
    }

    // Eliminar categoría y sus referencias
    await Promise.all([
      Category.findByIdAndDelete(_id),
      Project.findByIdAndUpdate(project._id, {
        $pull: { categories: _id },
      }),
      // Opcional: Eliminar tareas relacionadas
      // Task.deleteMany({ category: _id })
    ]);

    return NextResponse.json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar la categoría",
      },
      { status: 500 }
    );
  }
}
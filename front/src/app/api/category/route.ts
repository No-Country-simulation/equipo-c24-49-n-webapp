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

    const newCategory = new Category({
      name,
      project: projectId,
    });

    await newCategory.save();

    // Actualizar proyecto con la nueva categoría
    await Project.findByIdAndUpdate(projectId, {
      $push: { categories: newCategory._id },
    });

    return NextResponse.json(newCategory, { status: 201 });
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
      { name: data.name },
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
/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Obtiene las categorías de un proyecto
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto de búsqueda para filtrar categorías por nombre
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del proyecto al que pertenecen las categorías
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de categorías por página
 *     responses:
 *       200:
 *         description: Lista de categorías recuperada exitosamente
 *       400:
 *         description: Se requiere projectId
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado o sin acceso
 *       500:
 *         description: Error al recuperar categorías
 *
 *   post:
 *     summary: Crea una nueva categoría en un proyecto
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID del proyecto donde se creará la categoría
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Proyecto no encontrado o sin permisos suficientes
 *       500:
 *         description: Error al crear la categoría
 *
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID de la categoría a actualizar
 *               name:
 *                 type: string
 *                 description: Nuevo nombre de la categoría
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para editar esta categoría
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al actualizar la categoría
 *
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID de la categoría a eliminar
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar esta categoría
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error al eliminar la categoría
 */

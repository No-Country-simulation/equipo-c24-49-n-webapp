import { NextResponse } from "next/server";
import ProjectCollaborator from "@/models/projectCollaborator";
import Project from "@/models/project";
import User from "@/models/user";
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
    const projectId = searchParams.get("projectId");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!projectId) {
      return NextResponse.json(
        { error: "Se requiere projectId" },
        { status: 400 }
      );
    }

    // Verificar permisos en el proyecto
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
      ...(search && {
        $or: [
          { "user.email": { $regex: search, $options: "i" } },
          { "user.fullname": { $regex: search, $options: "i" } },
        ],
      }),
    };

    const totalCollaborators = await ProjectCollaborator.countDocuments(query);
    const totalPages = Math.ceil(totalCollaborators / limit);

    const collaborators = await ProjectCollaborator.find(query)
      .populate({
        path: "user",
        select: "fullname email avatar",
      })
      .lean()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      collaborators,
      currentPage: page,
      totalPages,
      totalCollaborators,
    });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json(
      {
        error: "Error al recuperar colaboradores",
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/collaborators:
 *   get:
 *     summary: Obtiene la lista de colaboradores de un proyecto
 *     tags: [Collaborator]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del proyecto
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtra colaboradores por nombre o email
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de colaboradores por página
 *     responses:
 *       200:
 *         description: Lista de colaboradores obtenida correctamente
 *       400:
 *         description: Se requiere projectId
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Proyecto no encontrado o sin acceso
 *       500:
 *         description: Error al recuperar colaboradores
 */

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { projectId, userId, role } = await request.json();

    // Verificar si el usuario existe
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar permisos del solicitante
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    const isCreator = project.creator.toString() === session.user._id;
    const isAdmin = project.collaborators.some(
      (c: any) => c.user.toString() === session.user._id && c.role === "admin"
    );

    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        {
          error: "No tienes permiso para agregar colaboradores",
        },
        { status: 403 }
      );
    }

    // Evitar duplicados
    const existingCollaborator = await ProjectCollaborator.findOne({
      project: projectId,
      user: userId,
    });

    if (existingCollaborator) {
      return NextResponse.json(
        {
          error: "El usuario ya es colaborador del proyecto",
        },
        { status: 400 }
      );
    }

    const newCollaborator = new ProjectCollaborator({
      project: projectId,
      user: userId,
      role: role || "viewer",
    });

    await newCollaborator.save();

    // Actualizar proyecto con el nuevo colaborador
    await Project.findByIdAndUpdate(projectId, {
      $push: { collaborators: newCollaborator._id },
    });

    return NextResponse.json(newCollaborator, { status: 201 });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return NextResponse.json(
      {
        error: "Error al agregar colaborador",
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/collaborators:
 *   post:
 *     summary: Agrega un colaborador a un proyecto
 *     tags: [Collaborator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID del proyecto
 *               userId:
 *                 type: string
 *                 description: ID del usuario a agregar
 *               role:
 *                 type: string
 *                 enum: [admin, editor, viewer]
 *                 default: viewer
 *                 description: Rol del colaborador en el proyecto
 *     responses:
 *       201:
 *         description: Colaborador agregado exitosamente
 *       400:
 *         description: El usuario ya es colaborador del proyecto
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para agregar colaboradores
 *       404:
 *         description: Usuario o proyecto no encontrado
 *       500:
 *         description: Error al agregar colaborador
 */
export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { _id, role } = await request.json();

    // Obtener colaboración
    const collaboration = await ProjectCollaborator.findById(_id).populate({
      path: "project",
      select: "creator collaborators",
    });

    if (!collaboration) {
      return NextResponse.json(
        { error: "Colaboración no encontrada" },
        { status: 404 }
      );
    }

    // Verificar permisos
    const project = collaboration.project as any;
    const isCreator = project.creator.toString() === session.user._id;
    const isAdmin = project.collaborators.some(
      (c: any) => c.user.toString() === session.user._id && c.role === "admin"
    );

    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        {
          error: "No tienes permiso para modificar roles",
        },
        { status: 403 }
      );
    }

    // Prevenir auto-despromoción del último admin
    if (role !== "admin" && collaboration.role === "admin") {
      const adminCount = await ProjectCollaborator.countDocuments({
        project: project._id,
        role: "admin",
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            error: "Debe haber al menos un administrador en el proyecto",
          },
          { status: 400 }
        );
      }
    }

    const updatedCollaborator = await ProjectCollaborator.findByIdAndUpdate(
      _id,
      { role },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedCollaborator);
  } catch (error) {
    console.error("Error updating collaborator:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar colaborador",
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/collaborators:
 *   put:
 *     summary: Actualiza el rol de un colaborador en un proyecto
 *     tags: [Collaborator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID del colaborador
 *               role:
 *                 type: string
 *                 enum: [admin, editor, viewer]
 *                 description: Nuevo rol del colaborador
 *     responses:
 *       200:
 *         description: Colaborador actualizado exitosamente
 *       400:
 *         description: Debe haber al menos un administrador en el proyecto
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para modificar roles
 *       404:
 *         description: Colaborador no encontrado
 *       500:
 *         description: Error al actualizar colaborador
 */

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { _id } = await request.json();

    // Obtener colaboración
    const collaboration = await ProjectCollaborator.findById(_id).populate({
      path: "project",
      select: "creator collaborators",
    });

    if (!collaboration) {
      return NextResponse.json(
        { error: "Colaboración no encontrada" },
        { status: 404 }
      );
    }
    const project = collaboration.project as any;
    const isCreator = project.creator.toString() === session.user._id;
    const isAdmin = project.collaborators.some(
      (c: any) => c.user.toString() === session.user._id && c.role === "admin"
    );

    // Validar permisos
    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        {
          error: "No tienes permiso para eliminar colaboradores",
        },
        { status: 403 }
      );
    }

    // Prevenir eliminación del creador
    if (collaboration.user.toString() === project.creator.toString()) {
      return NextResponse.json(
        {
          error: "No se puede eliminar al creador del proyecto",
        },
        { status: 400 }
      );
    }

    // Prevenir eliminación de último admin
    if (collaboration.role === "admin") {
      const adminCount = await ProjectCollaborator.countDocuments({
        project: project._id,
        role: "admin",
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            error: "Debe haber al menos un administrador en el proyecto",
          },
          { status: 400 }
        );
      }
    }

    // Eliminar colaboración
    await Promise.all([
      ProjectCollaborator.findByIdAndDelete(_id),
      Project.findByIdAndUpdate(project._id, {
        $pull: { collaborators: _id },
      }),
    ]);

    return NextResponse.json({ message: "Colaborador eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting collaborator:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar colaborador",
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/collaborators:
 *   delete:
 *     summary: Elimina un colaborador de un proyecto
 *     tags: [Collaborator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID del colaborador a eliminar
 *     responses:
 *       200:
 *         description: Colaborador eliminado exitosamente
 *       400:
 *         description: No se puede eliminar al creador del proyecto o debe haber al menos un administrador
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar colaboradores
 *       404:
 *         description: Colaborador no encontrado
 *       500:
 *         description: Error al eliminar colaborador
 */

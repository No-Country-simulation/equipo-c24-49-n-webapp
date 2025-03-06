import { NextResponse } from "next/server";
import Channel, { IChannel } from "@/models/channel";
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

    const totalChannels = await Channel.countDocuments(query);
    const totalPages = Math.ceil(totalChannels / limit);

    const channels = (await Channel.find(query)
      .populate("messages", "content")
      .lean()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)) as IChannel[];

    return NextResponse.json({
      channels,
      currentPage: page,
      totalPages,
      totalChannels,
    });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json(
      {
        error: "Error al recuperar canales",
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/channel:
 *   get:
 *     summary: Obtiene la lista de canales de un proyecto
 *     tags: [Channel]
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del proyecto al que pertenecen los canales
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Nombre del canal a buscar
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de canales por página
 *     responses:
 *       200:
 *         description: Lista de canales obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Se requiere projectId
 *       404:
 *         description: Proyecto no encontrado o sin acceso
 *       500:
 *         description: Error al recuperar canales
 */
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

    const newChannel = new Channel({
      name,
      project: projectId,
    });

    await newChannel.save();

    // Actualizar proyecto con el nuevo canal
    await Project.findByIdAndUpdate(projectId, {
      $push: { channels: newChannel._id },
    });

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error) {
    console.error("Error creating channel:", error);
    return NextResponse.json(
      {
        error: "Error al crear el canal",
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/channel:
 *   post:
 *     summary: Crea un nuevo canal en un proyecto
 *     tags: [Channel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID del proyecto al que pertenece el canal
 *               name:
 *                 type: string
 *                 description: Nombre del canal
 *     responses:
 *       201:
 *         description: Canal creado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para crear un canal en este proyecto
 *       500:
 *         description: Error al crear el canal
 */
export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { _id, ...data } = await request.json();

    // Verificar permisos
    const channel = await Channel.findById(_id).populate({
      path: "project",
      select: "creator collaborators",
    });

    if (!channel) {
      return NextResponse.json(
        { error: "Canal no encontrado" },
        { status: 404 }
      );
    }
    const project = channel.project as any;
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
          error: "No tienes permiso para editar este canal",
        },
        { status: 403 }
      );
    }

    const updatedChannel = await Channel.findByIdAndUpdate(
      _id,
      { name: data.name },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedChannel);
  } catch (error) {
    console.error("Error updating channel:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar el canal",
      },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/channel:
 *   put:
 *     summary: Actualiza un canal existente
 *     tags: [Channel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID del canal a actualizar
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del canal
 *     responses:
 *       200:
 *         description: Canal actualizado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para actualizar este canal
 *       404:
 *         description: Canal no encontrado
 *       500:
 *         description: Error al actualizar el canal
 */
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { _id } = await request.json();

    // Verificar permisos
    const channel = await Channel.findById(_id).populate({
      path: "project",
      select: "creator collaborators",
    });

    if (!channel) {
      return NextResponse.json(
        { error: "Canal no encontrado" },
        { status: 404 }
      );
    }
    const project = channel.project as any;
    const hasPermission =
      project.creator.toString() === session.user._id ||
      project.collaborators.some(
        (c: any) =>
          c.user.toString() === session.user._id && ["admin"].includes(c.role)
      );

    if (!hasPermission) {
      return NextResponse.json(
        {
          error: "No tienes permiso para eliminar este canal",
        },
        { status: 403 }
      );
    }

    // Eliminar canal y sus referencias
    await Promise.all([
      Channel.findByIdAndDelete(_id),
      Project.findByIdAndUpdate(project._id, {
        $pull: { channels: _id },
      }),
      // Opcional: Eliminar mensajes relacionados
      // Message.deleteMany({ channel: _id })
    ]);

    return NextResponse.json({ message: "Canal eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting channel:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar el canal",
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/channel:
 *   delete:
 *     summary: Elimina un canal existente
 *     tags: [Channel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID del canal a eliminar
 *     responses:
 *       200:
 *         description: Canal eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar este canal
 *       404:
 *         description: Canal no encontrado
 *       500:
 *         description: Error al eliminar el canal
 */

import { NextResponse } from "next/server";
import Notification, { INotification } from "@/models/notification";
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const markAsRead = searchParams.get("markAsRead") === "true";

    const query = {
      user: session.user._id,
      message: { $regex: search, $options: "i" },
    };

    // Obtener y actualizar notificaciones no leídas si se solicita
    if (markAsRead) {
      await Notification.updateMany(
        { ...query, read: false },
        { $set: { read: true } }
      );
    }

    const totalNotifications = await Notification.countDocuments(query);
    const totalPages = Math.ceil(totalNotifications / limit);

    const notifications = (await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()) as INotification[];

    return NextResponse.json({
      notifications,
      currentPage: page,
      totalPages,
      totalNotifications,
      unreadCount: markAsRead
        ? 0
        : await Notification.countDocuments({ ...query, read: false }),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        error: "Error al recuperar notificaciones",
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

    const { message, userId } = await request.json();

    // Verificar si es admin o está creando para sí mismo
    const isAdmin = session.user.role === "admin";
    const targetUserId = isAdmin && userId ? userId : session.user._id;

    if (!isAdmin && targetUserId !== session.user._id) {
      return NextResponse.json(
        {
          error: "No tienes permiso para crear esta notificación",
        },
        { status: 403 }
      );
    }

    const newNotification = new Notification({
      message,
      user: targetUserId,
      read: false,
    });

    await newNotification.save();

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      {
        error: "Error al crear la notificación",
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
    const notification = await Notification.findById(_id);

    if (!notification) {
      return NextResponse.json(
        { error: "Notificación no encontrada" },
        { status: 404 }
      );
    }

    if (
      notification.user.toString() !== session.user._id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error: "No tienes permiso para actualizar esta notificación",
        },
        { status: 403 }
      );
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      _id,
      { ...data, read: data.read ?? false },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar la notificación",
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
    const notification = await Notification.findById(_id);

    if (!notification) {
      return NextResponse.json(
        { error: "Notificación no encontrada" },
        { status: 404 }
      );
    }

    if (
      notification.user.toString() !== session.user._id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error: "No tienes permiso para eliminar esta notificación",
        },
        { status: 403 }
      );
    }

    await Notification.findByIdAndDelete(_id);

    return NextResponse.json({
      message: "Notificación eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar la notificación",
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtiene las notificaciones del usuario autenticado
 *     tags: [Notification]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtra las notificaciones por mensaje
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de notificaciones por página
 *       - in: query
 *         name: markAsRead
 *         schema:
 *           type: boolean
 *         description: Si es true, marca todas las notificaciones como leídas
 *     responses:
 *       200:
 *         description: Lista de notificaciones obtenida correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al recuperar notificaciones
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Crea una nueva notificación
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Contenido de la notificación
 *               userId:
 *                 type: string
 *                 description: ID del usuario destinatario (solo para admins)
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para crear esta notificación
 *       500:
 *         description: Error al crear la notificación
 */

/**
 * @swagger
 * /api/notifications:
 *   put:
 *     summary: Actualiza una notificación existente
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID de la notificación a actualizar
 *               read:
 *                 type: boolean
 *                 description: Estado de lectura de la notificación
 *     responses:
 *       200:
 *         description: Notificación actualizada correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para actualizar esta notificación
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error al actualizar la notificación
 */

/**
 * @swagger
 * /api/notifications:
 *   delete:
 *     summary: Elimina una notificación
 *     tags: [Notification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID de la notificación a eliminar
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar esta notificación
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error al eliminar la notificación
 */

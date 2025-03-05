import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, avatar } = await request.json();

    // Buscar usuario por email (NO usar findById)
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar usuario en MongoDB directamente en una sola operación
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { avatar },
      { new: true } // Devuelve el usuario actualizado
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Avatar actualizado correctamente",
        avatar: updatedUser.avatar,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/update-avatar:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/update-avatar:
 *   post:
 *     summary: Actualiza el avatar de un usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               avatar:
 *                 type: string
 *                 description: URL del nuevo avatar
 *     responses:
 *       200:
 *         description: Avatar actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Avatar actualizado correctamente"
 *                 avatar:
 *                   type: string
 *                   example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

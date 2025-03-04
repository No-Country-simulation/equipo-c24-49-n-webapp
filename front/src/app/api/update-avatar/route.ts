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
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    // Actualizar usuario en MongoDB directamente en una sola operación
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { avatar },
      { new: true } // Devuelve el usuario actualizado
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Avatar actualizado correctamente", avatar: updatedUser.avatar },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/update-avatar:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

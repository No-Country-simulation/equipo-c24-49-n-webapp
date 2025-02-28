import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener los datos del cuerpo de la solicitud
    const { fullname, email, password } = await request.json();

    // Validar la longitud de la contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    //@ts-ignore
    const userFound = await User.findOne({ email }).exec();

    if (userFound) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear un nuevo usuario
    const user = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    // Guardar el usuario en la base de datos
    const savedUser = await user.save();

    // Responder con los datos del usuario creado, excluyendo la contraseña
    return NextResponse.json(
      {
        fullname: savedUser.fullname,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    // Manejar errores de validación de Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    // Manejar otros errores
    console.error("Error in POST /api/register:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
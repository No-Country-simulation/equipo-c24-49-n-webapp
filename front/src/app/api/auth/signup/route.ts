import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createDefaultProjects } from "@/utils/defaultProjects";
import { Types } from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password, fullname, avatar, role, projects } =
      await request.json();

    // Validar la contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const userFound = await User.findOne({ email });

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
      email,
      password: hashedPassword,
      fullname,
      avatar,
      role,
      projects,
    });

    // Guardar el usuario en la base de datos
    const savedUser = await user.save();
    // 🔥 Crear proyectos automáticamente
    await createDefaultProjects(new Types.ObjectId(savedUser._id.toString()));

    console.log(savedUser);

    return NextResponse.json(
      {
        fullname: savedUser.fullname,
        email: savedUser.email,
        avatar: savedUser.avatar,
        role: savedUser.role,
        projects: savedUser.projects,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

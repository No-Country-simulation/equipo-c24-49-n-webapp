import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password, fullname, avatar, role, projects } = await request.json();

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
    console.log(savedUser)

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

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea una cuenta de usuario con correo, contraseña y otros detalles.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullname
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "securepassword123"
 *               fullname:
 *                 type: string
 *                 example: "Juan Pérez"
 *               avatar:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/avatar.jpg"
 *               role:
 *                 type: string
 *                 example: "user"
 *               projects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["projectId1", "projectId2"]
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullname:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: usuario@example.com
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                   example: "https://example.com/avatar.jpg"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["projectId1", "projectId2"]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Error de validación (ej. contraseña demasiado corta)
 *       409:
 *         description: El correo ya está registrado
 *       500:
 *         description: Error interno del servidor
 */

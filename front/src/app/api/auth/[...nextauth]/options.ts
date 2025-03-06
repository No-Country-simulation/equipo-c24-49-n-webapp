/**
 * Configuración de autenticación para NextAuth.js
 *
 * Esta configuración permite la autenticación mediante credenciales (email y contraseña)
 * y Google OAuth, usando una base de datos MongoDB para almacenar los usuarios.
 */
import { Types } from "mongoose";

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/libs/db";

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET, // Secreto para firmar tokens JWT

  // Adaptador de base de datos MongoDB
  adapter: MongoDBAdapter(client) as any,

  // Proveedores de autenticación
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      /**
       * Función de autorización para el proveedor de credenciales
       * Verifica si el usuario existe y si la contraseña es correcta
       */
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { email, password } = credentials;

        if (typeof email !== "string" || typeof password !== "string") {
          throw new Error("Invalid credentials format");
        }

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectDB();
          const userFound = await User.findOne({ email }).select("+password");

          if (!userFound) {
            throw new Error("Invalid credentials");
          }

          const passwordMatch = await bcrypt.compare(
            password,
            userFound.password
          );

          if (!passwordMatch) {
            throw new Error("Invalid credentials");
          }

          return {
            id: userFound._id.toString(),
            _id: userFound._id.toString(),
            email: userFound.email,
            name: userFound.fullname,
            fullname: userFound.fullname,
            image: userFound.avatar,
            avatar: userFound.avatar,
            role: userFound.role,
            projects: userFound.projects.map((p: Types.ObjectId) =>
              p.toString()
            ),
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  pages: {
    signIn: "/login", // Página personalizada de inicio de sesión
  },

  session: {
    strategy: "jwt", // Usa JWT para la gestión de sesiones
  },

  callbacks: {
    /**
     * Callback para personalizar el token JWT
     * Se ejecuta al iniciar sesión para agregar información adicional al token
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token._id = user._id || user.id;
        token.fullname = user.fullname || user.name;
        token.avatar = user.avatar || user.image;
        token.role = user.role || "viewer";
        token.projects = user.projects || [];
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }

      // 🔥 Si el usuario actualiza la sesión manualmente (ej: cambio de avatar)
      if (trigger === "update" && session?.avatar) {
        token.avatar = session.avatar; // Actualiza el avatar en el token
      }

      return token;
    },
    /**
     * Callback para personalizar la sesión del usuario
     * Se ejecuta cada vez que se solicita la sesión
     */
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        _id: token._id as string,
        fullname: token.fullname as string,
        avatar: token.avatar as string,
        role: token.role as "admin" | "editor" | "viewer",
        projects: token.projects as string[],
        createdAt: token.createdAt as Date,
        updatedAt: token.updatedAt as Date,
      };
      return session;
    },
  },

  events: {
    async signIn(message) {
      console.log("Sign in successful", message);
    },
    async signOut(message) {
      console.log("Sign out successful", message);
    },
    async createUser(message) {
      console.log("User created", message);
    },
  },
};

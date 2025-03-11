import { Types } from "mongoose";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/libs/db";
import { createDefaultProjects } from "@/utils/defaultProjects";

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,

  adapter: MongoDBAdapter(client) as any,

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
            hasDefaultProjects: userFound.hasDefaultProjects,
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
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
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

      if (trigger === "update" && session?.avatar) {
        token.avatar = session.avatar;
      }

      return token;
    },

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
      console.log(session);

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

      // Crear proyectos por defecto para el nuevo usuario
      try {
        const userId = new Types.ObjectId(message.user.id);
        await createDefaultProjects(userId);
        console.log("Default projects created for user:", userId);
      } catch (error) {
        console.error("Error creating default projects:", error);
      }
    },
  },
};

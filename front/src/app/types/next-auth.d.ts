import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string;
    fullname: string;
    avatar: string;
    role: "admin" | "editor" | "viewer";
    projects: string[]; // Cambia a string[] en lugar de Types.ObjectId[]
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    fullname: string;
    avatar: string;
    role: "admin" | "editor" | "viewer";
    projects: string[]; // Asegurar que sean strings
    createdAt: Date;
    updatedAt: Date;
  }
}

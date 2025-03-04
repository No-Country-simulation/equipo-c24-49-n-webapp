import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id: string;
    fullname: string;
    avatar: string;
    role: "admin" | "editor" | "viewer";
    projects: string[]; 
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    fullname: string;
    avatar: string;
    role: "admin" | "editor" | "viewer";
    projects: string[];
    createdAt: Date;
    updatedAt: Date;
  }
}
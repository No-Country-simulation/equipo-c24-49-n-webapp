import "next-auth";
import { DefaultSession } from "next-auth";
import { Types } from "mongoose";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            fullname: string;
            avatar: string;
            role: "admin" | "editor" | "viewer";
            projects: Types.ObjectId[];
            createdAt: Date;
            updatedAt: Date;
        } & DefaultSession["user"];
    }

    interface Token {
        _id: string;
        fullname: string;
        avatar: string;
        role: "admin" | "editor" | "viewer";
        projects: Types.ObjectId[];
        createdAt: Date;
        updatedAt: Date;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        fullname: string;
        avatar: string;
        role: "admin" | "editor" | "viewer";
        projects: Types.ObjectId[]; // Cambiar a Types.ObjectId[]
        createdAt: Date;
        updatedAt: Date;
    }
}
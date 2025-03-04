import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/libs/db";

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();
        const userFound = await User.findOne({ email: credentials.email });

        if (!userFound) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          _id: userFound._id.toString(),
          id: userFound._id.toString(),
          email: userFound.email,
          name: userFound.fullname,
          fullname: userFound.fullname,
          image: userFound.avatar,
          avatar: userFound.avatar,
          role: userFound.role,
          projects: userFound.projects.map((p: any) => p.toString()),
          createdAt: userFound.createdAt,
          updatedAt: userFound.updatedAt,
        };
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
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.fullname = user.fullname;
        token.avatar = user.avatar;
        token.role = user.role;
        token.projects = user.projects;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        _id: token._id,
        fullname: token.fullname,
        avatar: token.avatar,
        role: token.role,
        projects: token.projects,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      };
      return session;
    },
  },
};
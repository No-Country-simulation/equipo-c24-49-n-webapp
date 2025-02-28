import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter"

import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import client from "@/libs/db";

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: MongoDBAdapter(client),

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();
        //@ts-ignore
        const userFound = await User.findOne({ email: credentials.email }).select("+password");

        if (!userFound || !userFound.password) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, userFound.password);

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return { ...userFound.toObject(), password: undefined }; // Excluye la contraseña
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
    async redirect({
      url, baseUrl
    }) {
      return "/profile"
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user, password: undefined };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

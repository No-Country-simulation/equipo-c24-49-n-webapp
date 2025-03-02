import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
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
        const userFound = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (!userFound || !userFound.password) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

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
    async signIn({ user, account }) {
      return true; // Dejar que NextAuth siga su proceso normal
    },
    async redirect({ url, baseUrl }) {
      return "/profile"; // Redirigir al perfil después del inicio de sesión
    },
    async jwt({ token, user }) {
      await connectDB();

      if (!token.email) return token;
      //@ts-ignore
      let userFromDB = await User.findOne({ email: token.email });

      if (userFromDB) {
        // Solo asignar la imagen de Google si no tiene una imagen personalizada
        userFromDB.fullname = user?.name || token.name || userFromDB.fullname;

        if (
          !userFromDB.avatar ||
          userFromDB.avatar.includes("googleusercontent")
        ) {
          userFromDB.avatar = user?.image || token.picture || userFromDB.avatar;
        }

        userFromDB.updatedAt = new Date();
        await userFromDB.save();
        console.log("🔄 Usuario actualizado en users");
      } else {
        userFromDB = new User({
          fullname: user?.name || token.name,
          email: token.email,
          avatar: user?.image || token.picture || "", // Se crea con la imagen de Google si no hay otra
          role: "viewer",
          projects: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await userFromDB.save();
        console.log("✅ Usuario creado en users");
      }

      // Asignar los datos correctos al token
      token._id = userFromDB._id.toString();
      token.fullname = userFromDB.fullname;
      token.avatar = userFromDB.avatar;
      token.role = userFromDB.role;
      token.projects = userFromDB.projects;
      token.createdAt = userFromDB.createdAt;
      token.updatedAt = userFromDB.updatedAt;

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      // @ts-ignore
      session.user = {
        _id: token._id,
        fullname: token.fullname,
        email: token.email,
        avatar: token.avatar,
        role: token.role,
        projects: token.projects,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      };
    
      return session;
    },
  },
});

export { handler as GET, handler as POST };

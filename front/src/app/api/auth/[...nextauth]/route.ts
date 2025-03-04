import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/libs/db";

const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  adapter: MongoDBAdapter(client),

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
        // Validación de credenciales
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Conexión a la base de datos
        await connectDB();

        // Buscar usuario
        const userFound = await User.findByEmail(credentials.email);

        if (!userFound) {
          throw new Error("Invalid credentials");
        }

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        // Devolver usuario sin contraseña
        return { 
          id: userFound._id.toString(),
          email: userFound.email,
          name: userFound.fullname,
          image: userFound.avatar
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
        await connectDB();

        const userFromDB = await User.findOne({ email: token.email });

        if (userFromDB) {
          token._id = userFromDB._id.toString();
          token.fullname = userFromDB.fullname;
          token.avatar = userFromDB.avatar;
          token.role = userFromDB.role;
          
          // Mapear ObjectId a strings
          token.projects = userFromDB.projects.map((project: any) => 
            project.toString()
          );
          
          token.createdAt = userFromDB.createdAt;
          token.updatedAt = userFromDB.updatedAt;
        }
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
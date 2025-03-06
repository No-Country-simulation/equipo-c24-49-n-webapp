import  { Schema, model, models, Document, Model, Types } from "mongoose";

// Definir la interfaz del usuario
export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  avatar: string;
  role: "admin" | "editor" | "viewer";
  projects: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Métodos estáticos (opcional)
interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// Esquema del usuario
const UserSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      select: false, // No devolver la contraseña en las consultas
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
      minLength: [3, "Fullname must be at least 3 characters"],
      maxLength: [50, "Fullname must be at most 50 characters"],
    },
    avatar: {
      type: String,
      default: "", // URL de la imagen de perfil
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"], // Roles permitidos
      default: "viewer",
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project", // Referencia a la colección de proyectos
      },
    ],
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Método estático para buscar por email
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email }).select("+password"); // Incluir la contraseña en la consulta
};

// Crear o recuperar el modelo
const User = (models.User as IUserModel) || model<IUser, IUserModel>("User", UserSchema);

export default User;
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minLength: [6, "Password must be at least 6 characters"],
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
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);
export default User;
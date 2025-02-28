import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true, // Elimina espacios en blanco al principio y al final
      lowercase: true, // Convierte el email a minúsculas
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // No devolver la contraseña en las consultas
      minLength: [6, "Password must be at least 6 characters"], // Validación de longitud mínima
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true, // Elimina espacios en blanco al principio y al final
      minLength: [3, "Fullname must be at least 3 characters"],
      maxLength: [50, "Fullname must be at most 50 characters"], // Aumenté el límite máximo
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Verifica si el modelo ya está definido para evitar redefiniciones
const User = models.User || model("User", UserSchema);

export default User;
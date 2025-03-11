import { Schema, model, models, Document } from "mongoose";

// Interfaz para TypeScript
export interface ITask extends Document {
  title: string;
  description: string;
  project: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId; // 👈 Agregado
  assignedTo?: Schema.Types.ObjectId;
  priority: "Alta" | "Media" | "Baja";
  status: "En curso" | "En pausa" | "Finalizada";
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Esquema de Mongoose
const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "El título de la tarea es requerido"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // 👈 Agregado para relacionar tareas con categorías
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["Alta", "Media", "Baja"],
      default: "Baja",
    },
    status: {
      type: String,
      enum: ["En curso", "En pausa", "Finalizada"],
      default: "En curso",
    },
    dueDate: {
      type: Date,
      required: [true, "La fecha de plazo es requerida"],
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Exportar modelo
export default models.Task || model<ITask>("Task", TaskSchema);

import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project", // Referencia al proyecto al que pertenece la tarea
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencia al usuario que creó la tarea
      required: true,
    },
    assigned: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Referencia a los usuarios asignados a la tarea
      },
    ],
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"], // Estados permitidos
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"], // Prioridades permitidas
      default: "medium",
    },
    due_date: {
      type: Date,
      required: [true, "Due date is required"],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", // Referencia a los comentarios de la tarea
      },
    ],
    files: [
      {
        url: String, // URL del archivo
        name: String, // Nombre del archivo
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = models.Task || model("Task", TaskSchema);
export default Task;
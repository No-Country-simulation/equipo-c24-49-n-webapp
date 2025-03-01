import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencia al usuario creador
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task", // Referencia a las tareas del proyecto
      },
    ],
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Channel", // Referencia a los canales del proyecto
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
import { Schema, model, models } from "mongoose";

const ProjectCollaboratorSchema = new Schema(
  {
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project", // Referencia al proyecto
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencia al usuario colaborador
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"], // Roles permitidos
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectCollaborator =
  models.ProjectCollaborator || model("ProjectCollaborator", ProjectCollaboratorSchema);
export default ProjectCollaborator;
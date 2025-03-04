import mongoose, { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IProjectCollaborator extends Document {
  project: Types.ObjectId;
  user: Types.ObjectId;
  role: "admin" | "editor" | "viewer";
  createdAt: Date;
  updatedAt: Date;
}

interface IProjectCollaboratorModel extends Model<IProjectCollaborator> {
  findByUser?(userId: Types.ObjectId): Promise<IProjectCollaborator | null>;
}

const ProjectCollaboratorSchema = new Schema<IProjectCollaborator, IProjectCollaboratorModel>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
  },
  {
    timestamps: true,
  }
);

const ProjectCollaborator = (models.ProjectCollaborator as IProjectCollaboratorModel) || 
  model<IProjectCollaborator, IProjectCollaboratorModel>("ProjectCollaborator", ProjectCollaboratorSchema);

export default ProjectCollaborator;
import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IProjectCollaborator extends Document {
  user: Types.ObjectId;
  project: Types.ObjectId;
  role: "owner" | "admin" | "editor" | "viewer";
  joinedAt: Date;
}

interface IProjectCollaboratorModel extends Model<IProjectCollaborator> {
  __dummy?: never;
}

const ProjectCollaboratorSchema = new Schema<IProjectCollaborator, IProjectCollaboratorModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "editor", "viewer"],
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectCollaborator = (models.ProjectCollaborator as IProjectCollaboratorModel) || 
  model<IProjectCollaborator, IProjectCollaboratorModel>("ProjectCollaborator", ProjectCollaboratorSchema);

export default ProjectCollaborator;

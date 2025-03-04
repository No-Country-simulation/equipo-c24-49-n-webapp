import mongoose, { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  creator: Types.ObjectId;
  categories: Types.ObjectId[];
  channels: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

interface IProjectModel extends Model<IProject> {
  findByName?(name: string): Promise<IProject | null>;
}

const ProjectSchema = new Schema<IProject, IProjectModel>(
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
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Channel",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = (models.Project as IProjectModel) || 
  model<IProject, IProjectModel>("Project", ProjectSchema);

export default Project;
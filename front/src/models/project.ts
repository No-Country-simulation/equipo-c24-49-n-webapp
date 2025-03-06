import  { Schema, model, models, Document, Model, Types } from "mongoose";

export type BackgroundType = 'color' | 'gradient' | 'image';

export interface IProject extends Document {
  name: string;
  description: string;
  creator: Types.ObjectId;
  categories: Types.ObjectId[];
  channels: Types.ObjectId[];
  collaborators: Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
  backgroundType?: BackgroundType;
  backgroundColor?: string;
  backgroundGradient?: {
    color1: string;
    color2: string;
    angle?: number;
  };
  backgroundImage?: string;
  visibility?: 'privado' | 'publico' | 'equipo';
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
      default: 'Agregar descripción', 
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProjectCollaborator", 
      },
    ], 
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
    backgroundType: {
      type: String,
      enum: ['color', 'gradient', 'image'],
      default: 'color'
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF' 
    },
    backgroundGradient: {
      color1: {
        type: String,
        default: '#FFFFFF'
      },
      color2: {
        type: String,
        default: '#F0F0F0'
      },
      angle: {
        type: Number,
        default: 45
      }
    },
    backgroundImage: {
      type: String,
      default: null
    },
    visibility: {
      type: String,
      enum: ['privado', 'publico', 'equipo'],
      default: 'privado'
    },
  },
  {
    timestamps: true,
  }
);

const Project = (models.Project as IProjectModel) || 
  model<IProject, IProjectModel>("Project", ProjectSchema);

export default Project;
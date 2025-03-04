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

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
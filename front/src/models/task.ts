import mongoose, { Schema, model, models, Document, Model, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  category: Types.ObjectId;
  assignedTo: Types.ObjectId;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ITaskModel extends Model<ITask> {
  findByTitle?(title: string): Promise<ITask | null>;
}

const TaskSchema = new Schema<ITask, ITaskModel>(
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
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Task = (models.Task as ITaskModel) || 
  model<ITask, ITaskModel>("Task", TaskSchema);

export default Task;
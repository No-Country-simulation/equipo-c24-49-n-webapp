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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", 
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    assigned: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", 
      },
    ],
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"], 
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"], 
      default: "medium",
    },
    due_date: {
      type: Date,
      required: [true, "Due date is required"],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", 
      },
    ],
    files: [
      {
        url: String, 
        name: String, 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = models.Task || model("Task", TaskSchema);
export default Task;
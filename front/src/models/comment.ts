import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    task_id: {
      type: Schema.Types.ObjectId,
      ref: "Task", // Referencia a la tarea del comentario
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencia al usuario que escribió el comentario
      required: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
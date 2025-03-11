import { Schema, model, models, Types } from "mongoose";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    task: { type: Types.ObjectId, ref: "Task", required: true },
    author: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;

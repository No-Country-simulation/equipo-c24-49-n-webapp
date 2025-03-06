import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  task: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface ICommentModel extends Model<IComment> {
  findByContent?(content: string): Promise<IComment | null>;
}

const CommentSchema = new Schema<IComment, ICommentModel>(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = (models.Comment as ICommentModel) || 
  model<IComment, ICommentModel>("Comment", CommentSchema);

export default Comment;
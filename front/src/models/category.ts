import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project", 
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task", 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", CategorySchema);
export default Category;
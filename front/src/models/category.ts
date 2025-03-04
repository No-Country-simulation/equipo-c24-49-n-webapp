import mongoose, { Schema, model, models, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  project: Types.ObjectId;
  tasks: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

interface ICategoryModel extends Model<ICategory> {
  findByName?(name: string): Promise<ICategory | null>;
}

const CategorySchema = new Schema<ICategory, ICategoryModel>(
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

const Category = (models.Category as ICategoryModel) || 
  model<ICategory, ICategoryModel>("Category", CategorySchema);

export default Category;
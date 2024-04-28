import { Schema, model } from 'mongoose';
import { CategoryDocument } from 'src/types/categoryType';

const categorySchema = new Schema(
  {
    categoryImgUrl: { type: String, required: true },
    categoryName: { type: String, required: true },
    categoryCode: { type: String, unique: true, required: true },    
    userId: { type: String, required: true},
    isDelete: { type: Boolean}
  },
  {
    timestamps: true,
  }
);

const Category = model<CategoryDocument>('category', categorySchema);

export default Category;

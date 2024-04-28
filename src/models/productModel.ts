import { Schema, model } from 'mongoose';
import { ProductDocument } from 'src/types/productType';

const productSchema = new Schema(
  {    
    productName: { type: String, required: true },
    categoryCode: { type: String, required: true },    
    price: { type: Number, required: true },    
    description: { type: String, required: true },    
    userId: { type: String, required: true},
    isDelete: { type: Boolean}
  },
  {
    timestamps: true,
  }
);

const Product = model<ProductDocument>('product', productSchema);

export default Product;

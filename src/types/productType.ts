import { Document } from 'mongoose';

// common

export interface ReturnType<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | string | null;
}

// Product product
export interface CreateProductInput {  
  productName: string;
  categoryCode: string;
  price: Number;
  description: string;
}

//Get one Product
export interface GetProductInput {  
  id: string;
}

//Edit 
export interface EditProductInput {
  id: string;
  productName: string;
  categoryCode: string;
  price: Number;
  description: string;
}
//Delete 
export interface DeleteProductInput {
  id: string;
}

export interface ProductReturnType {
  id: string;
  productName: string;
  categoryCode: string;
  price: Number;
  description: string;
}

export interface ProductListReturnType {
  productList: Array<ProductReturnType>,
}

export interface ProductDocument extends CreateProductInput, Document {
  id: string;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

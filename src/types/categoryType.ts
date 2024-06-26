import { Document } from 'mongoose';

// common

export interface ReturnType<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | string | null;
}

// Category create
export interface CreateCategoryInput {
  categoryImgUrl: string,
  categoryName: string;
  categoryCode: string;
}

//Get one category
export interface GetCategoryInput {  
  categoryCode: string;
}

//Get one category
export interface DeleteCategoryInput {  
  categoryCode: string;
}

//Edit 
export interface EditCategoryInput {
  categoryImgUrl: string,
  categoryName: string;
  categoryCode: string;
}

export interface CategoryReturnType {
  id: string,
  categoryImgUrl: string,
  categoryName: string;
  categoryCode: string;
}

export interface CategoryListReturnType {
  categoryList: Array<CategoryReturnType>,
}

export interface CategoryDocument extends CreateCategoryInput, Document {
  id: string;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

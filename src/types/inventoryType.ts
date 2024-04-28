import { Document } from 'mongoose';

// common

export interface ReturnType<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | string | null;
}

// inventory inventory
export interface ImportInventoryListInput {  
  productId: string; 
  inventoryList: Array<string>;
}

//Get one inventory
export interface GetInventoryInput {  
  id: string;
  status: number; //0: avaliable, 1: sold, 2: disable
}

//Search inventories
export interface SearchInventoryInput {  
  productId: string; 
  keywords: string; 
}

//Edit 
export interface EditInventoryInput {
  id: string;
  content: string;
  orderNumber: string|undefined;
  status: number;
}

//Delete 
export interface DeleteInventoryInput {
  id: string;
}

export interface InventoryReturnType {
  id: string;
  productId: string;
  content: string;
  orderNumber: string|undefined;
  status: number;
  soldAt: Date|undefined;
}

export interface InventoryListReturnType {
  inventoryList: Array<InventoryReturnType>,
}

export interface InventoryDocument extends Document {
  id: string;
  productId: string;
  content: string;
  orderNumber: string|undefined;
  soldAt: Date|undefined;
  status: number;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

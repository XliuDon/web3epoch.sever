import { Document } from 'mongoose';

// common

export interface ReturnType<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | string | null;
}

// order order
export interface CreateOrderItemInput {  
  productId: string;
  amount: number;
}

export interface  CreateOrderInput {  
  orderItems: Array<CreateOrderItemInput>
}

//Get one order
export interface GetOrderInput {  
  orderNumber: string;
}

//delete one order
export interface DeleteOrderInput {  
  orderNumber: string;
}

//Paid order 
export interface UpdateOrderPaidInput {
  orderNumber: string;
  paidTx: string;
  customerWallet: string;
}

//Cancelled or Failed order 
export interface UpdateCancelledOrFailedOrderPaidInput {
  orderNumber: string;
  status: number;
}

export interface OrderItemReturnType {
  orderNumber: string;
  productName: string|undefined;
  price: number;
  amount: number;
}

export interface OrderSimpleReturnType {
  id: string;
  orderNumber: string;
}

export interface OrderReturnType {
  orderNumber: string;
  totalPrice: number;  
  status: number;
  customerWallet: string | undefined;
  paidTx: string | undefined;
  orderItems: Array<OrderItemReturnType>;
}

export interface OrderListReturnType {
  orderList: Array<OrderReturnType>,
}

export interface OrderDocument extends Document {
  id: string;
  orderNumber: string;
  totalPrice: number;  
  status: number;
  customerWallet: string;
  paidTx: string;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemDocument extends CreateOrderItemInput, Document {
  id: string;
  orderNumber: string;
  productName: string;
  price: number;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

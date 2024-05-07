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
  email: string;
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

//Update Order status
export interface UpdateOrderStatusInput {
  orderNumber: string;
  status: number;
}

//Update Order Item Delivery status
export interface UpdateOrderItemDeliveryStatusInput {
  orderItemId: string;
  status: number;
}

export interface OrderItemReturnType {
  id: string;
  orderNumber: string;
  productName: string|undefined;
  productId: string;
  price: number;
  amount: number;
  deliveryStatus: number;
  updatedAt: Date;
}

export interface OrderSimpleReturnType {
  id: string;
  orderNumber: string;
}

export interface OrderReturnType {
  email: string;
  orderNumber: string;
  totalPrice: number;  
  status: number;
  customerWallet: string | undefined;
  paidTx: string | undefined;
  createdAt: Date;
  expiredAt: Date;
  orderItems: Array<OrderItemReturnType>;
}

export interface OrderListReturnType {
  orderList: Array<OrderReturnType>,
}

export interface OrderDocument extends Document {
  id: string;
  email: string;
  orderNumber: string;
  totalPrice: number;  
  status: number;
  customerWallet: string;
  paidTx: string;
  isDelete: boolean;
  expiredAt: Date,
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemDocument extends CreateOrderItemInput, Document {
  id: string;
  orderNumber: string;
  productName: string;
  price: number;
  deliveryStatus: number;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

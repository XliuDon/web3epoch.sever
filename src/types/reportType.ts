import { Document } from 'mongoose';

// common

export interface ReturnType<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | string | null;
}

export interface ReportInput {  
  userId: string;
}

export interface ProductSalesReturnType {  
  categoryCode: string,
  productId: string;
  productName: string;
  totalSalesPrice: number;
  orderCount:number;
}

export interface ProductSalesByMonthReturnType {  
  productId: string;
  productName: string;
  totalPrice: number;
  month: string;
}

export interface ReportReturnType {  
  todayTotalPrice: number;
  todayOrderCount: number;
  totalPrice: number;
  totalOrderCount: number;
  topProductSales: Array<ProductSalesReturnType>;
  productsSales: Array<ProductSalesReturnType>;
  productsSalesByMonth: Array<ProductSalesByMonthReturnType>;  
  updatedAt: Date;
}


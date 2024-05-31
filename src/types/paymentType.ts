import { Document } from 'mongoose';

// common

export interface ReturnType<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | string | null;
}

// Payment create
export interface CreatePaymentInput {  
  priceToPay: number;
  orderNumber: string;
}

// Payment update
export interface UpdatePaymentInput {  
  orderNumber: string;
  pricePaid: number;
  chainId: string;
  tokenTick: string;
  customerWallet: string;
  paidTx: string;
}

// Payment update
export interface UpdateExpiredPaymentInput {  
  orderNumber: string;
}


// Payment get by price
export interface GetPaymentInputByPriceInput {  
  price: number;  
}

// // Payment return
// export interface GetPaymentReturnType{  
//   price: number;
//   orderNumber: string;
//   chainId: string | undefined;
//   tokenTick: string | undefined;
//   customerWallet: string | undefined;
//   paidTx: string | undefined;
// }


// Request Okx transactin history
export interface GetTransactionsInput {  
  walletId: string;
  chainIds: Array<string>;
  limit: string;
  startDate: string;
  endDate: string;
}

// Okx transaction history
export interface OkxTransactions {  
  chainId: string;
  txHash: string;
  fromAddr: string;
  toAddr: string;
  txTime: string;
  coinAmount: string;
  coinSymbol: string;
}

export interface PaymentDocument extends CreatePaymentInput, UpdatePaymentInput, Document {
  id: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

import {
  ReturnType,
  CreatePaymentInput,
  UpdatePaymentInput,
  UpdateExpiredPaymentInput,
  PaymentDocument
} from 'src/types/paymentType';

import Payment from '../models/paymentModel';

// Create new cate
export async function createPayment(
  paymentData: CreatePaymentInput
): Promise<ReturnType<Omit<PaymentDocument, 'Payment'>>> {
  

  try {   
    const addPrice = 0.0001;
    
    let findPrice = paymentData.priceToPay;
    for(let i=0;i<1000;i++){

      const payment = await Payment.findOne({ priceToPay: findPrice, status:0 });  
      if(!payment){
        break;
      }
      findPrice += addPrice;
    }
    

    const newProduct = await Payment.create({
        priceToPay: findPrice.toFixed(4),
        orderNumber: paymentData.orderNumber       
    });

    return {
      success: true,
      status: 200,
      message: 'product created successfully.',
      data: newProduct,
    };
  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

export async function getPendingPayments(): Promise<ReturnType<Array<PaymentDocument>>> {
 
  try {        
    const payments = await Payment.find({ status: 0 });

    return {
      success: true,
      status: 200,
      message: 'get pending successfully.',
      data: payments
    };

  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

export async function updatePaidPayment(
  paymentData: UpdatePaymentInput
): Promise<ReturnType<PaymentDocument>> {
 
  try {        
    const payment = await Payment.findOne({ orderNumber: paymentData.orderNumber, status:0 });
    if(!payment){
      return {
        success: false,
        status: 401,
        message:
          'No pending payment found',
        data: null,
      };
    }

    payment.pricePaid = paymentData.pricePaid;
    payment.chainId = paymentData.chainId;
    payment.tokenTick = paymentData.tokenTick,
    payment.customerWallet = paymentData.customerWallet;
    payment.paidTx = paymentData.paidTx;
    payment.status = 1;
    await payment.save();

    return {
      success: true,
      status: 200,
      message: 'get pending successfully.',
      data: payment
    };

  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}


export async function updateExpiredPayment(
  paymentData: UpdateExpiredPaymentInput
): Promise<ReturnType<PaymentDocument>> {
 
  try {        
    const payment = await Payment.findOne({ orderNumber: paymentData.orderNumber });
    if(!payment){
      return {
        success: false,
        status: 401,
        message:
          'No Payment found',
        data: null,
      };
    }

    payment.status = 2;
    await payment.save();

    return {
      success: true,
      status: 200,
      message: 'get pending successfully.',
      data: payment
    };

  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: error,
    };
  }
}

export async function getPendingPaymentByPrice(price: number) :
  Promise<PaymentDocument | null> 
{ 
    try {        
      const payment = await Payment.findOne({ priceToPay: price, status:0 });  
      if(!payment){
        return null;
      }
    
      return payment;
  
    } catch (error: any) {
      return null;
    }
}  
import * as yup from 'yup';

export interface PaymentSchema {
  priceToPay: number;
  orderNumber: string;
}

export interface UpdatePaymentSchema {  
  pricePaid:number ;
  chainId: string;
  tokenTick: string;
  customerWallet: string;
  paidTx: string;
}

export interface PaymentExpiredSchema {
  orderNumber: string;
}


export const paymentSchema: yup.SchemaOf<PaymentSchema> = yup.object().shape({
  priceToPay: yup
    .number()
    .required({ message: 'Payment price is required.' }),
  orderNumber: yup
    .string()
    .required({ message: 'Payment orderNumber is required.' }),
});

export const updatePaymentSchema: yup.SchemaOf<UpdatePaymentSchema> = yup.object().shape({
  orderNumber: yup
  .string()
  .required({ message: 'orderNumber is required.' }),
  pricePaid: yup
    .number()
    .required({ message: 'Payment price is required.' }),
    chainId: yup
    .string()
    .required({ message: 'Payment chainId is required.' }),
    tokenTick: yup
    .string()
    .required({ message: 'Payment tokenTick is required.' }),
    customerWallet: yup
    .string()
    .required({ message: 'customer Wallet is required.' }),
    paidTx: yup
    .string()
    .required({ message: 'paidTx is required.' }),
});

export const paymentExpiredSchema: yup.SchemaOf<PaymentExpiredSchema> = yup.object().shape({
  orderNumber: yup
  .string()
  .required({ message: 'orderNumber is required.' }),
});
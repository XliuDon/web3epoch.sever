import * as yup from 'yup';

export interface OrderItemSchema {
  productId: string;
  amount: number;
}

export interface OrderSchema {
  email: string;
  orderItems: Array<OrderItemSchema>;
}

export interface GetOrderSchema {
  orderNumber: string
}

export interface DeleteOrderSchema {
  orderNumber: string
}

export interface UpdatePaidOrderSchema {
  orderNumber: string,
  customerWallet: string | undefined,
  paidTx: string | undefined,
}

export interface UpdateOrderStatusSchema {
  orderNumber: string,
  status: number,
}

export interface UpdateOrderItemDeliveryStatusSchema {
  orderItemId: string,
  status: number,
}

export const orderSchema: yup.SchemaOf<OrderSchema> = yup.object().shape({
  email: yup
    .string()
    .required({ message: 'Customer email is required.' }),     
  orderItems: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup
          .string()
          .required({ message: 'Product Id is required.' }),
        amount: yup.number().required({ message: 'amount Id is required.' }),
      })
    )
    .required({message: 'order items is required'}),
});

export const getOrderSchema: yup.SchemaOf<GetOrderSchema> = yup.object().shape({
  orderNumber: yup
    .string()
    .required({ message: 'orderNumber is required.' }),     
});

export const updatePaidOrderSchema: yup.SchemaOf<UpdatePaidOrderSchema> = yup.object().shape({
  orderNumber: yup
    .string()
    .required({ message: 'orderNumber is required.' }),  
  customerWallet: yup
    .string(),    
  paidTx: yup
    .string(),    
});

export const updateOrderStatusSchema: yup.SchemaOf<UpdateOrderStatusSchema> = yup.object().shape({
  orderNumber: yup
    .string()
    .required({ message: 'orderNumber is required.' }),  
  status: yup
    .number()
    .required({ message: 'status is required.' }),       
});

export const deleteOrderSchema: yup.SchemaOf<DeleteOrderSchema> = yup.object().shape({
  orderNumber: yup
    .string()
    .required({ message: 'orderNumber is required.' }),     
});

export const updateOrderItemDeliveryStatusSchema: yup.SchemaOf<UpdateOrderItemDeliveryStatusSchema> = yup.object().shape({
  orderItemId: yup
    .string()
    .required({ message: 'orderItemId is required.' }),  
  status: yup
    .number()
    .required({ message: 'status is required.' }),       
});

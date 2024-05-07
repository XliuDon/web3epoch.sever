import {
  OrderDocument,
  OrderReturnType,  
  OrderItemReturnType,
  OrderSimpleReturnType,
  GetOrderInput,
  CreateOrderInput,
  UpdateOrderPaidInput,
  DeleteOrderInput,
  UpdateOrderStatusInput,
  UpdateOrderItemDeliveryStatusInput,
  ReturnType,
  OrderListReturnType
} from 'src/types/orderType';
import {
  PaymentDocument,
  CreatePaymentInput
} from 'src/types/paymentType';

import Order from '../models/orderModel';
import OrderItem from '../models/orderItemModel';
import Product from '../models/productModel';
import generateOrderNumber from '../utils/orderGenerator';
import { checkAvaliableInventoryAmount } from './inventoryService';
import { createPayment } from './paymentService';

// Create new cate
export async function createOrder(
  orderData: CreateOrderInput  
): Promise<ReturnType<OrderSimpleReturnType>> {
  
  try {       
    const inventoryAvaliable = await checkAvaliableInventoryAmount(orderData);
    
    if(!inventoryAvaliable){
      return {
        success: false,
        status: 401,
        message:
          'Inventory is out of stock.',
        data: null,
      };
    }

    const orderNumber = generateOrderNumber();
    
    let totalPrice = 0.0
    let userId: string|undefined = "0";
    const orderItems = await Promise.all(
      orderData.orderItems.map(async(item)=>{          
          const product = await Product.findOne({_id: item.productId})
          userId = product?.userId;
          if(product===null){
            throw new Error(`can't find product:${item.productId} `)
          }
          
          const price = product.price as number;
          totalPrice += price;
          
          return await OrderItem.create({
            orderNumber: orderNumber,
            productId: item.productId,  
            productName: product.productName,      
            price: product.price,
            amount: item.amount,
            deliveryStatus: 0,
            userId: product.userId
          })
      })
    )

    const d1 = new Date ();
    const expired = new Date ( d1 );
    expired.setMinutes ( d1.getMinutes() + 10 );
    
    const paymentData= {
      priceToPay: Number(totalPrice.toFixed(4)),
      orderNumber: orderNumber
    }
    const orderPrice = await createPayment(paymentData);
    console.log('orderPrice',orderPrice)
    // const OrderItemModel
    const newOrder = await Order.create({
      email: orderData.email,
      orderNumber: orderNumber,
      totalPrice: (orderPrice.data as PaymentDocument).priceToPay,
      expiredAt: expired,
      status: 0, //0: unpaid, 1:paid, 2: cancelled  
      userId: userId
    });

    const order : OrderSimpleReturnType ={
      id: newOrder._id,
      orderNumber: newOrder.orderNumber
    }
 
    return {
      success: true,
      status: 200,
      message: 'order created successfully.',
      data: order,
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

export async function getOrder(
  getOrder: GetOrderInput  
): Promise<ReturnType<OrderReturnType>> {

  const findOrder = await Order.findOne({ orderNumber: getOrder.orderNumber, isDelete:{$ne: true}});

  if (!findOrder) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }

  const findOrderItems = await OrderItem.find({orderNumber: getOrder.orderNumber})
  const orderItemsPromise = await Promise.all(
    findOrderItems.map(async(item)=>{      
      const orderItem : OrderItemReturnType = {
        id: item._id,
        orderNumber: item.orderNumber,        
        productName: item.productName,
        productId: item.productId,
        price: item.price,
        amount: item.amount,
        deliveryStatus:item.deliveryStatus,
        updatedAt: item.updatedAt
      }
      return orderItem;
    })
  );



  const order : OrderReturnType = {
    email: findOrder.email,
    orderNumber: findOrder.orderNumber,
    totalPrice: findOrder.totalPrice,
    status: findOrder.status,
    customerWallet: findOrder.customerWallet,
    paidTx: findOrder.paidTx,
    expiredAt: findOrder.expiredAt,
    createdAt: findOrder.createdAt,
    orderItems: orderItemsPromise
  }

  return {
    success: true,
    status: 200,
    message: 'get order success.',
    data: order,
  };
}

export async function getOrderItemsWithAdmin(
  orderNumber: string 
): Promise<Array<string>> {

  try {          
      const findOrderItems = await OrderItem.find({orderNumber: orderNumber})
      const ids = await Promise.all(
        findOrderItems.map(async(item)=>{      
          return item._id;
        })
      );

      return ids;
    } catch (error: any) {
      console.debug(error.message)
      return [];
    }
}

export async function updatePaidOrder(
  orderData: UpdateOrderPaidInput  
): Promise<ReturnType<OrderDocument>> {
  const findOrder = await Order.findOne({ orderNumber: orderData.orderNumber, isDelete:{$ne: true}});

  if (!findOrder) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }
  try {    
    findOrder.status = 1;
    findOrder.customerWallet = orderData.customerWallet;
    findOrder.paidTx = orderData.paidTx;

    await findOrder.save();
   
    return {
      success: true,
      status: 200,
      message: 'order update successfully.',
      data: findOrder,
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

export async function updateOrderStatus(
  orderData: UpdateOrderStatusInput,
  userId: string,
): Promise<ReturnType<OrderSimpleReturnType>> {
  const findOrder = await Order.findOne({ orderNumber: orderData.orderNumber, userId: userId  , isDelete:{$ne: true}});

  if (!findOrder) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }
  try {    
    findOrder.status = orderData.status;
    findOrder.save();

    return {
      success: true,
      status: 200,
      message: 'order update successfully.',
      data: findOrder,
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

export async function updateOrderStatusWithAdmin(
  orderData: UpdateOrderStatusInput,
): Promise<ReturnType<OrderSimpleReturnType>> {
  const findOrder = await Order.findOne({ orderNumber: orderData.orderNumber, isDelete:{$ne: true}});

  if (!findOrder) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }
  try {    
    findOrder.status = orderData.status;
    findOrder.save();

    return {
      success: true,
      status: 200,
      message: 'order update successfully.',
      data: findOrder,
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

export async function getOrderList(
  userId: string,
): Promise<ReturnType<OrderListReturnType>> {
  const findOrders = await Order.find({ userId: userId, isDelete:{$ne: true}}).sort({createdAt:-1});

  if (!findOrders) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }
  const orderPromise = await Promise.all(
    findOrders.map(async(order) =>{
      const orderItems = await OrderItem.find({orderNumber: order.orderNumber, userId: userId})
      const orderReturn: OrderReturnType ={
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        status: order.status,
        customerWallet: order.customerWallet,
        paidTx: order.paidTx,        
        orderItems:orderItems,
        email: order.email,
        expiredAt: order.expiredAt,
        createdAt: order.createdAt
      }
      return orderReturn;
    })
  )
  const orderList: OrderListReturnType = {
    orderList: orderPromise
  };

  return {
    success: true,
    status: 200,
    message: 'get order list success.',
    data: orderList,
  };
}


export async function deleteOrder(
  orderData: DeleteOrderInput,
  userId: string,
): Promise<ReturnType<OrderSimpleReturnType>> {
  const findOrder = await Order.findOne({ orderNumber: orderData.orderNumber, userId: userId  });

  if (!findOrder) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }
  try {    
    findOrder.isDelete = true;
    findOrder.save();

    return {
      success: true,
      status: 200,
      message: 'order delete successfully.',
      data: findOrder,
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

export async function updateOrderItemDeliveryStatus(
  orderItemData: UpdateOrderItemDeliveryStatusInput,
  userId: string,
): Promise<ReturnType<OrderSimpleReturnType>> {
  const findOrderItem = await OrderItem.findOne({ _id: orderItemData.orderItemId, userId: userId  , isDelete:{$ne: true}});

  if (!findOrderItem) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }
  try {    
    findOrderItem.deliveryStatus = orderItemData.status;
    await findOrderItem.save();

    return {
      success: true,
      status: 200,
      message: 'order update successfully.',
      data: findOrderItem,
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


export async function updateOrderItemsDeliveryStatusWithAdmin(
  orderItemIds: Array<string>
): Promise<ReturnType<boolean>> {
  
  try {    
    const filter = { _id: { $in : orderItemIds} };
    // Create an update document specifying the change to make
    const updateDoc = {
      $set: {
        deliveryStatus: 1,
      },
    };

    const result = await OrderItem.updateMany(filter, updateDoc)

    return {
      success: true,
      status: 200,
      message: 'order update successfully.',
      data: true,
    };

  } catch (error: any) {
    return {
      success: false,
      status: 404,
      message: error.message,
      data: false,
    };
  }
}

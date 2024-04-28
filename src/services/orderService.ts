import {
  OrderDocument,
  OrderReturnType,  
  OrderItemReturnType,
  OrderSimpleReturnType,
  GetOrderInput,
  CreateOrderInput,
  UpdateOrderPaidInput,
  DeleteOrderInput,
  UpdateCancelledOrFailedOrderPaidInput,
  ReturnType,
  OrderListReturnType
} from 'src/types/orderType';

import Order from '../models/orderModel';
import OrderItem from '../models/orderItemModel';
import Product from '../models/productModel';
import generateOrderNumber from '../utils/orderGenerator';

// Create new cate
export async function createOrder(
  orderData: CreateOrderInput,
  userId: string,
): Promise<ReturnType<OrderSimpleReturnType>> {
  

  try {   
    const orderNumber = generateOrderNumber();
    
    let totalPrice = 0.0
    const orderItems = await Promise.all(
      orderData.orderItems.map(async(item)=>{          
          const product = await Product.findOne({_id: item.productId})
          if(product===null){
            throw new Error(`can't find product:${item.productId} `)
          }
          console.log('product',product)
          const price = product.price as number;
          totalPrice += price;
          
          return await OrderItem.create({
            orderNumber: orderNumber,
            productId: item.productId,  
            productName: product.productName,      
            price: product.price,
            amount: item.amount,
            userId: userId
          })
      })
    )

    console.log(orderItems)
    
    // const OrderItemModel
    const newOrder = await Order.create({
      orderNumber: orderNumber,
      totalPrice: totalPrice,        
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
  getOrder: GetOrderInput,
  userId: string,
): Promise<ReturnType<OrderReturnType>> {

  const findOrder = await Order.findOne({ orderNumber: getOrder.orderNumber, userId: userId , isDelete:{$ne: true}});

  if (!findOrder) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }

  const findOrderItems = await OrderItem.find({orderNumber: getOrder.orderNumber, userId: userId})
  const orderItemsPromise = await Promise.all(
    findOrderItems.map(async(item)=>{      
      const orderItem : OrderItemReturnType = {
        orderNumber: item.orderNumber,        
        productName: item.productName,
        price: item.price,
        amount: item.amount,
      }
      return orderItem;
    })
  );

  const order : OrderReturnType = {
    orderNumber: findOrder.orderNumber,
    totalPrice: findOrder.totalPrice,
    status: findOrder.status,
    customerWallet: findOrder.customerWallet,
    paidTx: findOrder.paidTx,
    orderItems: orderItemsPromise
  }

  return {
    success: true,
    status: 200,
    message: 'get order success.',
    data: order,
  };
}

export async function updatePaidOrder(
  orderData: UpdateOrderPaidInput,
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
    findOrder.status = 1;
    findOrder.customerWallet = orderData.customerWallet;
    findOrder.paidTx = orderData.paidTx;

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


export async function updateCancelledOrFailedOrder(
  orderData: UpdateCancelledOrFailedOrderPaidInput,
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

export async function getOrderList(
  userId: string,
): Promise<ReturnType<OrderListReturnType>> {
  const findOrders = await Order.find({ userId: userId, isDelete:{$ne: true}});

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
        orderItems:orderItems
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
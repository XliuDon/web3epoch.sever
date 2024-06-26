import { Request, Response } from 'express';
import { 
  createOrder, 
  getOrder, 
  getOrderItemsWithAdmin,
  getOrderList, 
  updatePaidOrder, 
  updateOrderStatus, 
  deleteOrder, 
  updateOrderStatusWithAdmin,
  updateOrderItemDeliveryStatus,
  updateOrderItemsDeliveryStatusWithAdmin } from '../services/orderService';

import {
    UpdatePaymentInput
  } from '../types/paymentType';

import { getUpdateDeliverInventories } from '../services/inventoryService';
import { updatePaidPayment } from '../services/paymentService';
import getUserId from '../utils/userInfo';
import sendEmail from '../services/emailService';

export async function createOrderController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await createOrder( req.body);

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function updateOrderPaidAndDeliveryController(
  req: Request,
  res: Response
): Promise<Response> {

  const paymentInput : UpdatePaymentInput = {
    pricePaid: req.body.pricePaid,
    chainId:  req.body.chainId,
    orderNumber: req.body.orderNumber,
    tokenTick: req.body.tokenTick,
    paidTx: req.body.paidTx,
    customerWallet: req.body.customerWallet,
  }
  const paymentResponse = await updatePaidPayment(paymentInput);
  if (paymentResponse.success === true) {
    const response = await updatePaidOrder(req.body);

    if (response.success === true) {
      const deliveryResponse =await getUpdateDeliverInventories(req.body.orderNumber);
      if(deliveryResponse.success === true){
          //todo: email inventories to customer
          //await sendEmail()
          const emailSuccess = true;
          if(emailSuccess){
            const orderItems = await getOrderItemsWithAdmin(req.body.orderNumber);          
            await updateOrderItemsDeliveryStatusWithAdmin(orderItems)
          }
          
        return res.status(deliveryResponse.status).json(deliveryResponse); 
      }else{
        const updateInput  = {
          orderNumber: req.body.orderNumber,
          status: 3
        }
        const updateOrderStatus = await updateOrderStatusWithAdmin(updateInput);
        return res.status(deliveryResponse.status).json(deliveryResponse);
      }
    }
    return res.status(response.status).json(response);
  }

  return res.status(paymentResponse.status).json(paymentResponse);
}

export async function updateOrderStatusController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await updateOrderStatus(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getOrderController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getOrder(req.body);

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getOrderListController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getOrderList(await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}


export async function deleteOrderController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await deleteOrder(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function updateOrderItemDeliveryStatusController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await updateOrderItemDeliveryStatus(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

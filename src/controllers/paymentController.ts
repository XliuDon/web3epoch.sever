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

import {InventoryWithProductNameReturnType} from '../types/inventoryType';
import {OrderDocument} from '../types/orderType';
import {
    ReturnType,
    UpdatePaymentInput
  } from '../types/paymentType';
import { TransfersType } from 'src/types/solanaWebhookType';

import { getUpdateDeliverInventories } from '../services/inventoryService';
import { updatePaidPayment, getPendingPaymentByPrice } from '../services/paymentService';
import sendEmailWithTemplate from '../utils/emailFormat';

export async function callbackPaidController(
  req: Request,
  res: Response
): Promise<Response> {


  await updatePayment(req);

  return res.status(200).json("OK");
}

export async function updatePaidController(
  req: Request,
  res: Response
): Promise<Response> {

  const result = await updatePayment(req);;
  if(result){
    return res.status(200).json("Recieved payment and delivered the products");  
  }else{
    return res.status(301).json("Recieved payment and failed to deliver the products, it may already delivered");  
  }
}

async function updatePayment( req: Request):Promise<boolean>{

  console.log('okx payment callback:',req.body)

  const transfer = req.body as TransfersType;

  if(transfer === null){
    return false;
  }
  
  let paidPrice = transfer.tokenTransfers[0].tokenAmount;
  
  const payment = await getPendingPaymentByPrice(paidPrice)
  
  if(payment === null){
    return false;
  }

  const payData = {
    orderNumber: payment.orderNumber,
    pricePaid: paidPrice,
    chainId:  'SOL', //req.body.data[0].chainId,
    tokenTick: 'USDC',//req.body.data[0].assetSummary.coinSymbol,
    customerWallet: transfer.tokenTransfers[0].fromUserAccount,
    paidTx: transfer.signature,
  };

  const response = await updatePaidPayment(payData);
  if (response.success === true) {
    const updateOrder = {
      orderNumber: payData.orderNumber,
      paidTx: payData.paidTx,
      customerWallet: payData.customerWallet,
    }

    const orderResp = await updatePaidOrder(updateOrder);
    if (orderResp.success === true) {
      const deliveryResponse =await getUpdateDeliverInventories(payData.orderNumber);
      if(deliveryResponse.success === true){
          //todo: email inventories to customer
          const inventoryList = (deliveryResponse.data as Array<InventoryWithProductNameReturnType>);
          const messageId = await sendEmailWithTemplate((orderResp.data as OrderDocument).email,payData.orderNumber, inventoryList)
          const emailSuccess = messageId.length>0;
          if(emailSuccess){
            const orderItems = await getOrderItemsWithAdmin(payData.orderNumber);          
            await updateOrderItemsDeliveryStatusWithAdmin(orderItems)
            return true;
          }
      }else{
        const updateInput  = {
          orderNumber: payData.orderNumber,
          status: 3
        }
        const updateOrderStatus = await updateOrderStatusWithAdmin(updateInput);        
      }
    }
  }
  return false;
}

export async function updateExpiredPaymentController(
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

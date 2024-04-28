import { Request, Response } from 'express';
import { createOrder, getOrder, getOrderList, updatePaidOrder, updateCancelledOrFailedOrder, deleteOrder } from '../services/orderService';
import getUserId from '../utils/userInfo'

export async function createOrderController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await createOrder( req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function updatePaidController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await updatePaidOrder(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function updateCancelledOrFailedOrderController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await updateCancelledOrFailedOrder(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getOrderController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getOrder(req.body, await getUserId(req));

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
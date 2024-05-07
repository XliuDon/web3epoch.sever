import { Request, Response } from 'express';
import { importInventory, getInventory, editInventory, getInventoryList, searchInventoryList, deleteInventory, getDeliveredInventoryList } from '../services/inventoryService';
import getUserId from '../utils/userInfo'

export async function importInventoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await importInventory( req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function editInventoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await editInventory(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getInventoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getInventory(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getInventoryListController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getInventoryList(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}


export async function searchInventoryListController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await searchInventoryList(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function deleteInventoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await deleteInventory(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getDeliveredInventoryListController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getDeliveredInventoryList(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}
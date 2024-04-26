import { Request, Response } from 'express';
import { importInventory, getInventory, editInventory, getInventoryList } from '../services/inventoryService';
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
  const response = await getInventoryList(await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}


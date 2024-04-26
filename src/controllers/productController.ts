import { Request, Response } from 'express';
import { createProduct, getProduct, editProduct, getProductList } from '../services/productService';
import getUserId from '../utils/userInfo'

export async function createProductController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await createProduct( req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function editProductController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await editProduct(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getProductController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getProduct(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getProductListController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getProductList(await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}


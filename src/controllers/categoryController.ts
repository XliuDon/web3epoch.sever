import { Request, Response } from 'express';
import { createCategory, getCategory, editCategory, getCategoryList, deleteCategory } from '../services/categoryService';
import getUserId from '../utils/userInfo'

export async function createCategoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const cateData = req.body;
  const response = await createCategory(cateData, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function editCategoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await editCategory(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getCategoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getCategory(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function getCategoryListController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await getCategoryList(await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

export async function deleteCategoryController(
  req: Request,
  res: Response
): Promise<Response> {
  const response = await deleteCategory(req.body, await getUserId(req));

  if (response.success === true) {
    return res.status(response.status).json(response);
  }

  return res.status(response.status).json(response);
}

import { Request, Response } from 'express';
import { createCategory, getCategory, editCategory, getCategoryList, deleteCategory } from '../services/categoryService';
import getUserId from '../utils/userInfo';

export async function createCategoryController(
  req: Request,
  res: Response
): Promise<Response> {
  let fileName = '';
  if (req.file) {
    fileName = req.file.filename;
  }

  const cateDataRaw = JSON.parse(req.body.cate_data);
  const cateData = {
    categoryImgUrl: fileName,
    categoryName: cateDataRaw.categoryName,
    categoryCode: cateDataRaw.categoryCode,
  }
  // console.log('cateData',cateData)
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
  let fileName = '';
  if (req.file) {
    fileName = req.file.filename;
  }

  const cateDataRaw = JSON.parse(req.body.cate_data);
  const cateData = {
    categoryImgUrl: fileName,
    categoryName: cateDataRaw.categoryName,
    categoryCode: cateDataRaw.categoryCode,
  }
  
  const response = await editCategory(cateData, await getUserId(req));

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

export async function uploadCategoryImageController(
  req: Request,
  res: Response
): Promise<Response> {
  const file = req.file
  console.log('upload file:', file);
 

  return res.status(200).json({status:200, data:null});
}
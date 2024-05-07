import {
  CategoryDocument,
  CategoryReturnType,
  EditCategoryInput,
  GetCategoryInput,
  CreateCategoryInput,
  DeleteCategoryInput,
  ReturnType,
  CategoryListReturnType
} from 'src/types/categoryType';

import CategoryModel from '../models/categoryModel';

// Create new cate
export async function createCategory(
  categoryData: CreateCategoryInput,
  userId: string,
): Promise<ReturnType<Omit<CategoryDocument, 'categoryName'>>> {
  

  try {   
    const existingCate = await CategoryModel.findOne({ categoryCode: categoryData.categoryCode, userId: userId });

    if (existingCate !== null) {
      return {
        success: false,
        status: 409,
        message: 'Category already exist.',
        data: null,
      };
    }

    const newCate = await CategoryModel.create({
      ...categoryData,
      userId: userId
    });

    return {
      success: true,
      status: 200,
      message: 'Category created successfully.',
      data: newCate,
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

export async function getCategory(
  getCategory: GetCategoryInput,
  userId: string,
): Promise<ReturnType<CategoryReturnType>> {

  const findCate = await CategoryModel.findOne({ categoryCode: getCategory.categoryCode, userId: userId, isDelete:{$ne: true} });

  if (!findCate) {
    return {
      success: false,
      status: 401,
      message:
        'No category find.',
      data: null,
    };
  }

  return {
    success: true,
    status: 200,
    message: 'get category success.',
    data: findCate,
  };
}

export async function editCategory(
  editCategory: EditCategoryInput,
  userId: string,
): Promise<ReturnType<CategoryReturnType>> {
  const findCate = await CategoryModel.findOne({ categoryCode: editCategory.categoryCode, userId: userId , isDelete:{$ne: true} });

  if (!findCate) {
    return {
      success: false,
      status: 401,
      message:
        'No category find.',
      data: null,
    };
  }
  try {    
    findCate.categoryImgUrl = editCategory.categoryImgUrl;
    findCate.categoryName = editCategory.categoryName;

    findCate.save();

    return {
      success: true,
      status: 200,
      message: 'Category update successfully.',
      data: findCate,
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


export async function getCategoryList(
  userId: string,
): Promise<ReturnType<CategoryListReturnType>> {
  let query = {}
  if(userId == "0"){
    query = { isDelete:{$ne: true}}
  }else{
    query = { userId: userId, isDelete:{$ne: true}}
  }
  const findCates = await CategoryModel.find(query);

  if (!findCates) {
    return {
      success: false,
      status: 401,
      message:
        'No category find.',
      data: null,
    };
  }
  const categoryList: CategoryListReturnType = {
    categoryList: findCates
  };

  return {
    success: true,
    status: 200,
    message: 'get category list success.',
    data: categoryList,
  };
}


export async function deleteCategory(
  cateData: DeleteCategoryInput,
  userId: string,
): Promise<ReturnType<CategoryReturnType>> {
  const findCategory = await CategoryModel.findOne({ categoryCode: cateData.categoryCode, userId: userId  });

  if (!findCategory) {
    return {
      success: false,
      status: 401,
      message:
        'No category find.',
      data: null,
    };
  }
  try {    
    findCategory.isDelete = true;
    findCategory.save();

    return {
      success: true,
      status: 200,
      message: 'Category delete successfully.',
      data: findCategory,
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
import {
  CategoryDocument,
  CategoryReturnType,
  EditCategoryInput,
  GetCategoryInput,
  CreateCategoryInput,
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

  const findCate = await CategoryModel.findOne({ categoryCode: getCategory.categoryCode, userId: userId });

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
  const findCate = await CategoryModel.findOne({ categoryCode: editCategory.categoryCode, userId: userId  });

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
  const findCates = await CategoryModel.find({ userId: userId});

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
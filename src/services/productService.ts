import {
  ProductDocument,
  ProductReturnType,
  EditProductInput,
  GetProductInput,
  CreateProductInput,
  DeleteProductInput,
  ReturnType,
  ProductListReturnType
} from 'src/types/productType';

import Product from '../models/productModel';

// Create new cate
export async function createProduct(
  productData: CreateProductInput,
  userId: string,
): Promise<ReturnType<Omit<ProductDocument, 'ProductName'>>> {
  

  try {   
    const newProduct = await Product.create({
      ...productData,
      userId: userId
    });

    return {
      success: true,
      status: 200,
      message: 'product created successfully.',
      data: newProduct,
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

export async function getProduct(
  getproduct: GetProductInput,
  userId: string,
): Promise<ReturnType<ProductReturnType>> {

  const findProduct = await Product.findOne({ _id: getproduct.id, userId: userId, isDelete:{$ne: true} });

  if (!findProduct) {
    return {
      success: false,
      status: 401,
      message:
        'No product find.',
      data: null,
    };
  }

  return {
    success: true,
    status: 200,
    message: 'get product success.',
    data: findProduct,
  };
}

export async function editProduct(
  editProduct: EditProductInput,
  userId: string,
): Promise<ReturnType<ProductReturnType>> {
  const findProduct = await Product.findOne({ _id: editProduct.id, userId: userId, isDelete:{$ne: true}  });

  if (!findProduct) {
    return {
      success: false,
      status: 401,
      message:
        'No product find.',
      data: null,
    };
  }
  try {    
    findProduct.productName = editProduct.productName;
    findProduct.price = editProduct.price;
    findProduct.categoryCode = editProduct.categoryCode;
    findProduct.description = editProduct.description;

    findProduct.save();

    return {
      success: true,
      status: 200,
      message: 'product update successfully.',
      data: findProduct,
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


export async function getProductList(
  userId: string,
): Promise<ReturnType<ProductListReturnType>> {
  const findProducts = await Product.find({ userId: userId, isDelete:{$ne: true}});

  if (!findProducts) {
    return {
      success: false,
      status: 401,
      message:
        'No product find.',
      data: null,
    };
  }
  const productList: ProductListReturnType = {
    productList: findProducts
  };

  return {
    success: true,
    status: 200,
    message: 'get product list success.',
    data: productList,
  };
}



export async function deleteProduct(
  productData: DeleteProductInput,
  userId: string,
): Promise<ReturnType<ProductReturnType>> {
  const findProduct = await Product.findOne({ _id: productData.id, userId: userId  });

  if (!findProduct) {
    return {
      success: false,
      status: 401,
      message:
        'No order find.',
      data: null,
    };
  }
  try {    
    findProduct.isDelete = true;
    findProduct.save();

    return {
      success: true,
      status: 200,
      message: 'Product delete successfully.',
      data: findProduct,
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
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
import Inventory from '../models/inventoryModel';

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

  const inventoryCount = await Inventory.countDocuments({productId: getproduct.id,status:0, userId: userId});
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
    data: {
      ...findProduct,
      inventoryCount: inventoryCount
    }
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
      data: {
        ...findProduct,
        inventoryCount:0
      }
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
  let query = {}
  if(userId == "0"){
    query = { isDelete:{$ne: true}}
  }else{
    query = { userId: userId, isDelete:{$ne: true}}
  }

  const findProducts = await Product.find(query);

  if (!findProducts) {
    return {
      success: false,
      status: 401,
      message:
        'No product find.',
      data: null,
    };
  }

  const productsPromise:Array<ProductReturnType> = await Promise.all(
    findProducts.map(async(p)=>{
      let query = {}
      if(userId == "0"){
        query = {productId: p.id,status:0}
      }else{
        query = {productId: p.id,status:0, userId: userId}
      }

        const inventoryCount = await Inventory.countDocuments(query);
        const returnProduct : ProductReturnType ={
          id: p._id,
          productName:  p.productName,
          categoryCode:  p.categoryCode,
          price:  p.price,
          description:  p.description,
          inventoryCount: inventoryCount
        }
        return returnProduct
    })
  )
  const productList: ProductListReturnType = {
    productList: productsPromise
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
        'No Product find.',
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
      data: null
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

import {
  InventoryDocument,
  InventoryReturnType,
  EditInventoryInput,
  GetInventoryInput,
  GetInventoryListInput,
  ImportInventoryListInput,
  DeleteInventoryInput,
  ReturnType,
  SearchInventoryInput,
  DeliveredInventoriesInput,
  InventoryWithProductNameReturnType,
  InventoryListReturnType
} from 'src/types/inventoryType';

import {
  CreateOrderInput
} from 'src/types/orderType';

import inventoryModel from '../models/inventoryModel';
import OrderItem from '../models/orderItemModel';
import Product from '../models/productModel';

// Create new cate
export async function importInventory(
  inventoryDataInput: ImportInventoryListInput,
  userId: string,
): Promise<ReturnType<Omit<Array<InventoryDocument>,'inventory'>>> {
  

  try {   
    const newInventoryList: Array<InventoryDocument> = [];
    if(inventoryDataInput){
      inventoryDataInput.inventoryList.map(async (content)=>{
        const exitingInventory = await inventoryModel.findOne({userId: userId, productId: inventoryDataInput.productId, content: content})
        if(exitingInventory ==null){
          const newinventory = await inventoryModel.create({
            content: content,
            productId: inventoryDataInput.productId,
            status: 0,
            userId: userId
          });
          newInventoryList.push(newinventory)
        }        
      })
    }
   
    return {
      success: true,
      status: 200,
      message: 'inventory created successfully.',
      data: newInventoryList,
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

export async function getInventory(
  getInventory: GetInventoryInput,
  userId: string,
): Promise<ReturnType<InventoryReturnType>> {

  const findinventory = await inventoryModel.findOne({ _id: getInventory.id, userId: userId , isDelete:{$ne: true}});

  if (!findinventory) {
    return {
      success: false,
      status: 401,
      message:
        'No inventory find.',
      data: null,
    };
  }

  return {
    success: true,
    status: 200,
    message: 'get inventory success.',
    data: findinventory,
  };
}

export async function editInventory(
  editinventory: EditInventoryInput,
  userId: string,
): Promise<ReturnType<InventoryReturnType>> {
  const findInventory = await inventoryModel.findOne({ _id: editinventory.id, userId: userId , isDelete:{$ne: true} });

  if (!findInventory) {
    return {
      success: false,
      status: 401,
      message:
        'No inventory find.',
      data: null,
    };
  }
  try {    
    findInventory.content = editinventory.content;
    findInventory.status = editinventory.status;

    await findInventory.save();

    return {
      success: true,
      status: 200,
      message: 'inventory update successfully.',
      data: findInventory,
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


export async function getInventoryList(
  getInventoryData: GetInventoryListInput,
  userId: string,
): Promise<ReturnType<InventoryListReturnType>> {
  let query = {}
  if(userId == "0"){
    query = { productId: getInventoryData.productId,status:0, isDelete:{$ne: true}}
  }else{
    query = { productId: getInventoryData.productId,status:0, userId: userId, isDelete:{$ne: true}}
  }

  const findInventorys = await inventoryModel.find(query);

  if (!findInventorys) {
    return {
      success: false,
      status: 401,
      message:
        'No inventory find.',
      data: null,
    };
  }
  const inventoryList: InventoryListReturnType = {
    inventoryList: findInventorys
  };

  return {
    success: true,
    status: 200,
    message: 'get inventory list success.',
    data: inventoryList,
  };
}

export async function searchInventoryList(
  searchData: SearchInventoryInput,
  userId: string,
): Promise<ReturnType<InventoryListReturnType>> {
  let queryStatus = {}
  
  if(searchData.status !== -1){
    queryStatus = {status: searchData.status??0}
  }
  
  const findInventorys = await inventoryModel.find(
    { 
      userId: userId, 
      productId: searchData.productId, 
      isDelete:{$ne: true}, 
      $or: [{content: new RegExp('.*' + searchData.keywords + '.*')},{orderNumber:new RegExp('.*' + searchData.keywords + '.*')}], 
      ...queryStatus
    });

  if (!findInventorys) {
    return {
      success: false,
      status: 401,
      message:
        'No inventory find.',
      data: null,
    };
  }
  const inventoryList: InventoryListReturnType = {
    inventoryList: findInventorys
  };

  return {
    success: true,
    status: 200,
    message: 'get inventory list success.',
    data: inventoryList,
  };
}


export async function deleteInventory(
  inventoryData: DeleteInventoryInput,
  userId: string,
): Promise<ReturnType<InventoryReturnType>> {

  try {    
    const findInventory = await inventoryModel.deleteOne({ _id: inventoryData.id, userId: userId  });
    return {
      success: true,
      status: 200,
      message: 'Inventory delete successfully.',
      data: null,
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

export async function checkAvaliableInventoryAmount(orderData: CreateOrderInput){
  try {    
    const results = await Promise.all(
      orderData.orderItems.map(async (order) =>{
        const inventoryCount = await inventoryModel.countDocuments({ productId: order.productId, status:0 });
        if(inventoryCount >= order.amount ){
          return true;
        }
        return false;
      })
    ) 
       
    return !results.includes(false);
    
  } catch (error: any) {
    
    return false;    
  }
}

export async function getUpdateDeliverInventories(
  orderNumber:string,
): Promise<ReturnType<Array<InventoryWithProductNameReturnType>>> {

  try {    
    const orderItems = await OrderItem.find({ orderNumber: orderNumber, status: 0});
    const inventories:Array<InventoryWithProductNameReturnType> = []
    if(orderItems){
      const results = await Promise.all(
        orderItems.map(async(o)=>{
          const soldInventories =  await inventoryModel.find({ productId: o.productId, status: 0}).limit(o.amount)          
          const product = await Product.findOne({_id: o.productId});
          return await Promise.all(soldInventories.map(async(i)=>{
            i.status = 1;
            i.orderNumber = o.orderNumber;
            i.soldAt = new Date();
            await i.save();            

            const inventory: InventoryWithProductNameReturnType = {
              id: i._id,
              productId: i.productId,
              productName: product?.productName,
              content: i.content,
              orderNumber: i.orderNumber,
              status: i.status,
              soldAt: i.soldAt
            }
            inventories.push(inventory);
            return inventory;
          }))
        })
      )      
    }

    console.log('inventories',inventories)
    
    return {
      success: true,
      status: 200,
      message: 'Update inventory status successfully.',
      data: inventories,
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


export async function getDeliveredInventoryList(
  deliveryInventoriesData: DeliveredInventoriesInput,
  userId: string,
): Promise<ReturnType<InventoryListReturnType>> {

  const findInventorys = await inventoryModel.find({ orderNumber: deliveryInventoriesData.orderNumber, productId: deliveryInventoriesData.productId, status:1, userId: userId, isDelete:{$ne: true}});

  if (!findInventorys) {
    return {
      success: false,
      status: 404,
      message:
        'No inventory find.',
      data: null,
    };
  }
  const inventoryList: InventoryListReturnType = {
    inventoryList: findInventorys
  };

  return {
    success: true,
    status: 200,
    message: 'get inventory list success.',
    data: inventoryList,
  };
}
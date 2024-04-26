
import {
  InventoryDocument,
  InventoryReturnType,
  EditInventoryInput,
  GetInventoryInput,
  ImportInventoryListInput,
  ReturnType,
  InventoryListReturnType
} from 'src/types/inventoryType';

import inventoryModel from '../models/inventoryModel';

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

  const findinventory = await inventoryModel.findOne({ _id: getInventory.id, userId: userId });

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
  const findInventory = await inventoryModel.findOne({ _id: editinventory.id, userId: userId  });

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

    findInventory.save();

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
  userId: string,
): Promise<ReturnType<InventoryListReturnType>> {
  const findInventorys = await inventoryModel.find({ userId: userId});

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
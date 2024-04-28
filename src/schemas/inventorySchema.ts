import * as yup from 'yup';

export interface ImportInventoryListSchema {
  productId: string,
  inventoryList: Array<string>,  
}

export interface InventorySchema {
  productId: string,
  content: string,
  status: number;
}

export interface GetInventorySchema {
  id: string;
}

export interface GetInventoryListSchema {
  productId: string;
}

export interface EditInventorySchema {
  id: string | undefined,
  content: string,
  status: number;
}

export interface UpdateOrderInventorySchema {
  id: string | undefined,
  orderNumber: string
}

export interface SearchInventorySchema {
  productId: string; 
  keywords: string,
}

export interface DeleteInventorySchema {
  id: string,
}

export const inventoryListSchema: yup.SchemaOf<ImportInventoryListSchema> = yup.object().shape({
  productId: yup
    .string()
    .required({ message: 'Product Id is required.' }),    
  inventoryList: yup
      .array()
      .required({ message: 'inventory list is required.' }),
     
});

export const inventorySchema: yup.SchemaOf<InventorySchema> = yup.object().shape({
  productId: yup
    .string()
    .required({ message: 'Product Id is required.' }),    
  content: yup
      .string()
      .required({ message: 'content is required.' }),
  status: yup
      .number()
      .required({ message: 'status is required.' }),
     
});

export const editInventorySchema: yup.SchemaOf<EditInventorySchema> = yup.object().shape({
  content: yup
    .string()
    .required({ message: 'inventory content is required.' }),
    id: yup
    .string()
    .required({ message: 'inventory Id is required.' }),
    status: yup
      .number()
      .required({ message: 'status is required.' }),
});

export const updateOrderInventorySchema: yup.SchemaOf<UpdateOrderInventorySchema> = yup.object().shape({
    id: yup
    .string()
    .required({ message: 'inventory Id is required.' }),
    orderNumber: yup
      .string()
      .required({ message: 'order number is required.' }),
});



export const getInventorySchema: yup.SchemaOf<GetInventorySchema> = yup.object().shape({
    id: yup
    .string()
    .required({ message: 'inventory id is required.' }),
});


export const getInventoryListSchema: yup.SchemaOf<GetInventoryListSchema> = yup.object().shape({
  productId: yup
  .string()
  .required({ message: 'product id is required.' }),
});

export const searchInventorySchema: yup.SchemaOf<SearchInventorySchema> = yup.object().shape({
  productId: yup
    .string()
    .required({ message: 'productId is required.' }),
  keywords: yup
  .string()
  .required({ message: 'keywords is required.' }),
});

export const deleteInventorySchema: yup.SchemaOf<DeleteInventorySchema> = yup.object().shape({
  id: yup
    .string()
    .required({ message: 'id is required.' }),     
});



export default InventorySchema;
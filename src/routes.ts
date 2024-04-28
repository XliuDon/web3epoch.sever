import { Express, Request, Response } from 'express';
import signInController from './controllers/signInController';
import signUpController from './controllers/signUpController';
import validateRequest from './middlewares/validateRequest';
import {auth} from './middlewares/auth';
import signInSchema from './schemas/signInSchema';
import signUpSchema from './schemas/signUpSchema';
import categorySchema from './schemas/categorySchema';
import { getCategorySchema, deleteCategorySchema } from './schemas/categorySchema';

import {createCategoryController, editCategoryController, getCategoryController, getCategoryListController, deleteCategoryController} from './controllers/categoryController';
import {createProductController, editProductController, getProductController, getProductListController, deleteProductController} from './controllers/productController';
import {importInventoryController, editInventoryController, getInventoryController, getInventoryListController, searchInventoryListController, deleteInventoryController} from './controllers/inventoryController';
import {createOrderController, getOrderController, getOrderListController, updatePaidController, updateCancelledOrFailedOrderController, deleteOrderController} from './controllers/orderController';
import {productSchema, editProductSchema, getProductSchema, deleteProductSchema} from './schemas/productSchema';
import {inventoryListSchema, editInventorySchema, getInventoryListSchema, getInventorySchema, updateOrderInventorySchema, searchInventorySchema, deleteInventorySchema } from './schemas/inventorySchema';
import {orderSchema, getOrderSchema, updatePaidOrderSchema, updateCancelledOrFailedOrderSchema, deleteOrderSchema } from './schemas/orderSchema';


function routes(app: Express): void {
  app.get('/api', (_: Request, res: Response) =>
    res.status(200).send('Hello from server...')
  );

  app.post('/api/signup', validateRequest(signUpSchema), signUpController);
  app.post('/api/signin', validateRequest(signInSchema), signInController);

  app.post('/api/categorycreate', [auth, validateRequest(categorySchema)], createCategoryController);
  app.post('/api/categoryedit', [auth, validateRequest(categorySchema)], editCategoryController);
  app.post('/api/categoryget', [auth, validateRequest(getCategorySchema)], getCategoryController);
  app.post('/api/categorydelete', [auth, validateRequest(deleteCategorySchema)], deleteCategoryController);
  app.post('/api/categorygetlist', [auth], getCategoryListController);

  app.post('/api/productcreate', [auth, validateRequest(productSchema)], createProductController);
  app.post('/api/productedit', [auth, validateRequest(editProductSchema)], editProductController);
  app.post('/api/productget', [auth, validateRequest(getProductSchema)], getProductController);
  app.post('/api/productdelete', [auth, validateRequest(deleteProductSchema)], deleteProductController);
  app.post('/api/productgetlist', [auth], getProductListController);

  app.post('/api/inventoryimport', [auth, validateRequest(inventoryListSchema)], importInventoryController);
  app.post('/api/inventoryedit', [auth, validateRequest(editInventorySchema)], editInventoryController);
  app.post('/api/inventoryget', [auth, validateRequest(getInventorySchema)], getInventoryController);
  app.post('/api/inventorygetlist', [auth, validateRequest(getInventoryListSchema)], getInventoryListController);
  app.post('/api/inventorysearch', [auth, validateRequest(searchInventorySchema)], searchInventoryListController);
  app.post('/api/inventorydelete', [auth, validateRequest(deleteInventorySchema)], deleteInventoryController);

  app.post('/api/ordercreate', [auth, validateRequest(orderSchema)], createOrderController);
  app.post('/api/orderupdatepaid', [auth, validateRequest(updatePaidOrderSchema)], updatePaidController);
  app.post('/api/ordercancellorfailed', [auth, validateRequest(updateCancelledOrFailedOrderSchema)], updateCancelledOrFailedOrderController);
  app.post('/api/orderget', [auth, validateRequest(getOrderSchema)], getOrderController);
  app.post('/api/orderdelete', [auth, validateRequest(deleteOrderSchema)], deleteOrderController);
  app.post('/api/ordergetlist', [auth], getOrderListController);
}

export default routes;

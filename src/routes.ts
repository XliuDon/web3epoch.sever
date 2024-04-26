import { Express, Request, Response } from 'express';
import signInController from './controllers/signInController';
import signUpController from './controllers/signUpController';
import validateRequest from './middlewares/validateRequest';
import {auth} from './middlewares/auth';
import signInSchema from './schemas/signInSchema';
import signUpSchema from './schemas/signUpSchema';
import categorySchema from './schemas/categorySchema';
import {getCategorySchema} from './schemas/categorySchema';

import {createCategoryController, editCategoryController, getCategoryController, getCategoryListController} from './controllers/categoryController';
import {createProductController, editProductController, getProductController, getProductListController} from './controllers/productController';
import {importInventoryController, editInventoryController, getInventoryController, getInventoryListController} from './controllers/inventoryController';
import {productSchema, editProductSchema, getProductSchema} from './schemas/productSchema';
import {inventoryListSchema, editInventorySchema, getInventoryListSchema, getInventorySchema, updateOrderInventorySchema } from './schemas/inventorySchema';



function routes(app: Express): void {
  app.get('/api', (_: Request, res: Response) =>
    res.status(200).send('Hello from server...')
  );

  app.post('/api/signup', validateRequest(signUpSchema), signUpController);
  app.post('/api/signin', validateRequest(signInSchema), signInController);

  app.post('/api/categorycreate', [auth, validateRequest(categorySchema)], createCategoryController);
  app.post('/api/categoryedit', [auth, validateRequest(categorySchema)], editCategoryController);
  app.post('/api/categoryget', [auth, validateRequest(getCategorySchema)], getCategoryController);
  app.post('/api/categorygetlist', [auth], getCategoryListController);

  app.post('/api/productcreate', [auth, validateRequest(productSchema)], createProductController);
  app.post('/api/productedit', [auth, validateRequest(editProductSchema)], editProductController);
  app.post('/api/productget', [auth, validateRequest(getProductSchema)], getProductController);
  app.post('/api/productgetlist', [auth], getProductListController);

  app.post('/api/inventoryimport', [auth, validateRequest(inventoryListSchema)], importInventoryController);
  app.post('/api/inventoryedit', [auth, validateRequest(editInventorySchema)], editInventoryController);
  app.post('/api/inventoryget', [auth, validateRequest(getInventorySchema)], getInventoryController);
  app.post('/api/inventorygetlist', [auth, validateRequest(getInventoryListSchema)], getInventoryListController);
}

export default routes;

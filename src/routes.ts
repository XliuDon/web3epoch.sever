import { Express, Request, Response } from 'express';
import signInController from './controllers/signInController';
import signUpController from './controllers/signUpController';
import validateRequest from './middlewares/validateRequest';
import {auth} from './middlewares/auth';
import signInSchema from './schemas/signInSchema';
import signUpSchema from './schemas/signUpSchema';
import categorySchema from './schemas/categorySchema';
import { getCategorySchema, deleteCategorySchema, categoryWithImageSchema } from './schemas/categorySchema';

import {createCategoryController, editCategoryController, getCategoryController, getCategoryListController, deleteCategoryController, uploadCategoryImageController} from './controllers/categoryController';
import {createProductController, editProductController, getProductController, getProductListController, deleteProductController} from './controllers/productController';
import {importInventoryController, editInventoryController, getInventoryController, getInventoryListController, searchInventoryListController, deleteInventoryController, getDeliveredInventoryListController} from './controllers/inventoryController';
import {createOrderController, getOrderController, getOrderListController, updateOrderPaidAndDeliveryController, updateOrderStatusController, deleteOrderController, updateOrderItemDeliveryStatusController} from './controllers/orderController';
import {updateExpiredPaymentController, updatePaidController, callbackPaidController} from './controllers/paymentController';
import {createSupportController, updateSupportStatusController, getAllSupportsController, getPendingSupportsController} from './controllers/supportController';
import {getDashboardReportController} from './controllers/reportController';

import {productSchema, editProductSchema, getProductSchema, deleteProductSchema} from './schemas/productSchema';
import {inventoryListSchema, editInventorySchema, getInventoryListSchema, getInventorySchema,  searchInventorySchema, deleteInventorySchema, deliveredInventoriesSchema } from './schemas/inventorySchema';
import {orderSchema, getOrderSchema, updatePaidOrderSchema, updateOrderStatusSchema, deleteOrderSchema, updateOrderItemDeliveryStatusSchema } from './schemas/orderSchema';
import {paymentExpiredSchema, paymentSchema, updatePaymentSchema} from './schemas/paymentSchema';
import {updateSupportStatusSchema, supportSchema} from './schemas/supportSchema';
import dotenv from 'dotenv';
dotenv.config();

const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req:Request, file:any, cb:any) {
    cb(null, process.env.IMAGE_PATH)
  },
  filename: function (req:Request, file:any, cb:any) {
    const suffix = file.originalname.split('.').pop();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '.' + suffix)
  }
})

const upload = multer({ storage: storage })

// const upload = multer({ dest: `${process.env.IMAGE_PATH}` });
// const storage = multer.diskStorage({
//   destination: (req, file, cb)=>{
//     // # This part defines where the files need to be saved
//     cb(null, '/tmp/my-uploads')
//   },
//   filename: (req, file, cb)=>{
//     // # This part sets the file name of the file
//     cb(null, file.originalname)
//   }
// })

function routes(app: Express): void {
  app.get('/api', (_: Request, res: Response) =>
    res.status(200).send('Hello from server...')
  );

  app.post('/api/signup', validateRequest(signUpSchema), signUpController);
  app.post('/api/signin', validateRequest(signInSchema), signInController);

  app.post('/api/categorycreate', [auth, upload.single('file')], createCategoryController);
  app.post('/api/categoryedit', [auth, upload.single('file')], editCategoryController);
  app.post('/api/categoryget', [auth, validateRequest(getCategorySchema)], getCategoryController);
  app.post('/api/categorydelete', [auth, validateRequest(deleteCategorySchema)], deleteCategoryController);
  app.get('/api/categorygetlist', getCategoryListController);
  

  app.post('/api/productcreate', [auth, validateRequest(productSchema)], createProductController);
  app.post('/api/productedit', [auth, validateRequest(editProductSchema)], editProductController);
  app.post('/api/productget', [auth, validateRequest(getProductSchema)], getProductController);
  app.post('/api/productdelete', [auth, validateRequest(deleteProductSchema)], deleteProductController);
  app.get('/api/productgetlist', getProductListController);

  app.post('/api/inventoryimport', [auth, validateRequest(inventoryListSchema)], importInventoryController);
  app.post('/api/inventoryedit', [auth, validateRequest(editInventorySchema)], editInventoryController);
  app.post('/api/inventoryget', [auth, validateRequest(getInventorySchema)], getInventoryController);
  app.post('/api/inventorygetlist', [validateRequest(getInventoryListSchema)], getInventoryListController);
  app.post('/api/inventorysearch', [auth, validateRequest(searchInventorySchema)], searchInventoryListController);
  app.post('/api/inventorydelete', [auth, validateRequest(deleteInventorySchema)], deleteInventoryController);
  app.post('/api/inventorygetdelivered', [auth, validateRequest(deliveredInventoriesSchema)], getDeliveredInventoryListController);
  

  app.post('/api/ordercreate', [validateRequest(orderSchema)], createOrderController);
  app.post('/api/orderupdatepaid', [auth, validateRequest(updatePaidOrderSchema)], updateOrderPaidAndDeliveryController);
  app.post('/api/orderstatusupdate', [auth, validateRequest(updateOrderStatusSchema)], updateOrderStatusController);
  app.post('/api/orderget', [validateRequest(getOrderSchema)], getOrderController);
  app.post('/api/orderdelete', [auth, validateRequest(deleteOrderSchema)], deleteOrderController);
  app.post('/api/orderitem_deliverystatus_update', [auth, validateRequest(updateOrderItemDeliveryStatusSchema)], updateOrderItemDeliveryStatusController);  
  app.get('/api/ordergetlist', [auth], getOrderListController);

  app.post('/api/paymentpaid', [validateRequest(updatePaymentSchema)], updatePaidController);
  app.post('/api/paymentexpired', [auth, validateRequest(paymentExpiredSchema)], updateExpiredPaymentController);
  app.post('/api/paymenthook',callbackPaidController);

  app.post('/api/supportcreate', [validateRequest(supportSchema)], createSupportController);
  app.post('/api/supportupdatestatus', [auth, validateRequest(updateSupportStatusSchema)], updateSupportStatusController);
  app.get('/api/supportgetall', [auth], getAllSupportsController);
  app.get('/api/supportgetpending',[auth], getPendingSupportsController);

  app.get('/api/report',[auth], getDashboardReportController);
  
}

export default routes;

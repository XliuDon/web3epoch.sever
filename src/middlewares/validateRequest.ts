import { NextFunction, Request, Response } from 'express';
import { SignUpSchema } from 'src/schemas/signUpSchema';
import { SignInSchema } from 'src/schemas/signInSchema';
import { CategorySchema, GetCategorySchema, DeleteCategorySchema, CategoryWithImageSchema } from 'src/schemas/categorySchema';
import {ProductSchema, GetProductSchema, DeleteProductSchema } from 'src/schemas/productSchema';
import {ImportInventoryListSchema, GetInventorySchema, GetInventoryListSchema, EditInventorySchema, UpdateOrderInventorySchema, SearchInventorySchema, DeleteInventorySchema, DeliveredInventoriesSchema } from 'src/schemas/inventorySchema';
import {OrderSchema, GetOrderSchema, UpdatePaidOrderSchema, UpdateOrderStatusSchema, DeleteOrderSchema, UpdateOrderItemDeliveryStatusSchema } from 'src/schemas/orderSchema';
import {PaymentExpiredSchema, PaymentSchema, UpdatePaymentSchema} from 'src/schemas/paymentSchema';
import { SupportSchema} from 'src/schemas/supportSchema';
import { SchemaOf } from 'yup';

function validateRequest(schema: SchemaOf<
  SignInSchema | SignUpSchema | CategorySchema | GetCategorySchema | DeleteCategorySchema | CategoryWithImageSchema |
  ProductSchema | GetProductSchema | DeleteProductSchema |
  ImportInventoryListSchema| GetInventorySchema| GetInventoryListSchema| EditInventorySchema| UpdateOrderInventorySchema | SearchInventorySchema | DeleteInventorySchema | DeliveredInventoriesSchema |
  OrderSchema | GetOrderSchema | UpdatePaidOrderSchema | UpdateOrderStatusSchema | DeleteOrderSchema | UpdateOrderItemDeliveryStatusSchema |
  PaymentExpiredSchema | PaymentSchema | UpdatePaymentSchema |
  SupportSchema
  >) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {      
      const validatedReqBody = await schema.validate(req.body);
      req.body = validatedReqBody;
      next();
    } catch (error: any) {
      res.status(500).json(error.message);
    }
  };
}

export default validateRequest;

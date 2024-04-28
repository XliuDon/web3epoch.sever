import { Schema, model } from 'mongoose';
import { OrderItemDocument } from 'src/types/orderType';

const orderItemSchema = new Schema(
  {    
    orderNumber: { type: String, required: true },
    productId: { type: String, required: true },        
    productName: { type: String, required: true }, 
    price: { type: Number, required: true },        
    amount: {type: Number, required: true },
    userId: { type: String, required: true},
    isDelete: { type: Boolean}
  },
  {
    timestamps: true,
  }
);

const OrderItem = model<OrderItemDocument>('orderItem', orderItemSchema);

export default OrderItem;

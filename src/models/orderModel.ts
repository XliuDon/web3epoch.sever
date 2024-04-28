import { Schema, model } from 'mongoose';
import { OrderDocument } from 'src/types/orderType';

const orderSchema = new Schema(
  {    
    orderNumber: { type: String, required: true },
    totalPrice: { type: String, required: true },        
    status: { type: Number, required: true }, //0: unpaid, 1:paid, 2: cancelled, 3: paid, but failed update, 4: sent order to customer
    customerWallet:  { type: String},        
    paidTx:  { type: String},        
    userId: { type: String, required: true},
    isDelete: { type: Boolean}
  },
  {
    timestamps: true,
  }
);

const Order = model<OrderDocument>('order', orderSchema);

export default Order;

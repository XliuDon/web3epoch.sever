import { Schema, model } from 'mongoose';
import { OrderDocument } from 'src/types/orderType';

const orderSchema = new Schema(
  {    
    email: { type: String, required: true },
    orderNumber: { type: String, required: true },
    totalPrice: { type: String, required: true },        
    status: { type: Number, required: true }, //0: unpaid, 1:paid, 2: cancelled, 3: paid, but failed update, 4: sent order to customer, 5: expired
    customerWallet:  { type: String},        
    paidTx:  { type: String},        
    overallStatus: { type: String, required:true, default:0}, //0:pending, 1:completed, 2: part completed
    userId: { type: String, required: true},
    isDelete: { type: Boolean},
    expiredAt: { type: Date }
  },
  {
    timestamps: true,
  }
);

const Order = model<OrderDocument>('order', orderSchema);

export default Order;

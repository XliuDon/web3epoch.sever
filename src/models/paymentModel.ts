import { Schema, model } from 'mongoose';
import { PaymentDocument } from 'src/types/paymentType';

const paymentSchema = new Schema(
  {
    orderNumber:{ type: String, required: true },
    priceToPay: { type: Number, required: true },
    pricePaid: { type: Number },
    chainId: { type: String},
    tokenTick: { type: String},
    customerWallet: { type: String },
    paidTx: { type: String },
    status: { type:Number, required: true, default:0}, //0:pending, 1:paid, 2: expired
  },
  {
    timestamps: true,
  }
);

const Payment = model<PaymentDocument>('Payment', paymentSchema);

export default Payment;

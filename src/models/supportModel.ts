import { Schema, model } from 'mongoose';
import { SupportDocument } from 'src/types/supportType';

const supportSchema = new Schema(
  {
    email:{ type: String, required: true },
    message:{ type: String, required: true },
    status: { type:Number, required: true, default:0}, //0:pending, 1:solved
  },
  {
    timestamps: true,
  }
);

const Support = model<SupportDocument>('Support', supportSchema);

export default Support;

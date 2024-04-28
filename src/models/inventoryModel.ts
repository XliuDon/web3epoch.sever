import { Schema, model } from 'mongoose';
import { InventoryDocument } from 'src/types/inventoryType';

const inventorySchema = new Schema(
  {    
    productId:  { type: String, required: true },
    content: { type: String, required: true },
    status: { type: Number, required: true },
    orderNumber: { type: String },    
    soldAt: { type: Date },        
    userId: { type: String, required: true},
    isDelete: { type: Boolean}
  },
  {
    timestamps: true,
  }
);

const Inventory = model<InventoryDocument>('inventory', inventorySchema);

export default Inventory;

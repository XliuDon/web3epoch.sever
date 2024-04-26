import { Schema, model } from 'mongoose';
import { UserDocument } from 'src/types/userType';

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    usertype: { type:Number, required: true, default:1}, //1: merchant, 2: admin
  },
  {
    timestamps: true,
  }
);

const User = model<UserDocument>('User', userSchema);

export default User;

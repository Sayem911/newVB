import mongoose from 'mongoose';
import { Schema, models } from 'mongoose';

export interface IUser {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  image?: string;
  role: 'admin' | 'reseller' | 'customer';
  status: 'active' | 'pending' | 'suspended';
  domain?: string;
  businessName?: string;
  description?: string;
  wallet?: {
    balance: number;
    currency: string;
  };
  productPricing?: {
    [productId: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: String,
    name: { type: String, required: true },
    image: String,
    role: {
      type: String,
      enum: ['admin', 'reseller', 'customer'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      default: 'active',
    },
    domain: String,
    businessName: String,
    description: String,
    wallet: {
      balance: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
    },
    productPricing: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model('User', UserSchema);
import mongoose, { Document } from 'mongoose';
import { IUser } from '../user/user.model';

export interface IPaymentDetails extends Document {
  _id: mongoose.Types.ObjectId;
  user: IUser['_id'];
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  method: string;
  bank?: string;
  wallet?: string;
  cardId?: string;
  vpa?: string;
  email: string;
  contact: string;
  fee: number;
  tax: number;
  createdAt: Date;
  updatedAt: Date;
}

const paymentDetailsSchema = new mongoose.Schema<IPaymentDetails>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String, required: true },
    razorpaySignature: { type: String, required: true },
    amount: { type: Number, required: true }, // in paise
    currency: { type: String, required: true, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
      default: 'created'
    },
    method: { type: String, required: true }, // card, netbanking, wallet, upi, etc.
    bank: { type: String }, // bank code for netbanking
    wallet: { type: String }, // wallet provider
    cardId: { type: String }, // card id for card payments
    vpa: { type: String }, // UPI VPA
    email: { type: String, required: true },
    contact: { type: String, required: true },
    fee: { type: Number }, // in paise
    tax: { type: Number } // in paise
  },
  { timestamps: true }
);

export const PaymentDetails = mongoose.model<IPaymentDetails>('PaymentDetails', paymentDetailsSchema);
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  contact: string;
  password?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  payments?: mongoose.Types.ObjectId[]; // Array of payment references
  quizProgress?: {
    completed: boolean;
    currentSection?: number;
    answers?: Record<string, any>;
    scores?: Record<string, number>;
  };
  report?: {
    generated: boolean;
    data?: any;
    pdfUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentId: { type: String },
    quizProgress: {
      completed: { type: Boolean, default: false },
      currentSection: { type: Number, default: 0 },
      answers: { type: Object, default: {} },
      scores: { type: Object, default: {} }
    },
    report: {
      generated: { type: Boolean, default: false },
      data: { type: Object },
      pdfUrl: { type: String }
    },
    payments: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'PaymentDetails' 
    }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
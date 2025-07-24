import mongoose, { Document } from 'mongoose';

interface IAnswer {
  question: mongoose.Types.ObjectId;
  optionIndex: number;
  score: number;
}

export interface IResponse extends Document {
  user: mongoose.Types.ObjectId;
  section: mongoose.Types.ObjectId;
  answers: IAnswer[];
  totalScore: number;
  completedAt: Date;
}

const responseSchema = new mongoose.Schema<IResponse>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    optionIndex: { type: Number, required: true },
    score: { type: Number, required: true }
  }],
  totalScore: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

export const Response = mongoose.model<IResponse>('Response', responseSchema);
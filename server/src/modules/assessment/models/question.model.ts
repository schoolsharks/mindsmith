import mongoose, { Document } from 'mongoose';

interface IOption {
  text: string;
  score: number;
}

export interface IQuestion extends Document {
  subsection: mongoose.Types.ObjectId;
  text: string;
  options: IOption[];
  category?: string;
}

const questionSchema = new mongoose.Schema<IQuestion>({
  subsection: { type: mongoose.Schema.Types.ObjectId, ref: 'Subsection', required: true },
  text: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    score: { type: Number, required: true }
  }],
  category: { type: String }
});

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
import mongoose, { Document } from "mongoose";

interface IOption {
  text: string;
  score: number;
}

enum QuestionType {
  OPTIONS = "OPTIONS",
  SEMICIRCLE_METER = "SEMICIRCLE_METER",
  LINEAR_METER = "LINEAR_METER",
}
export interface IQuestion extends Document {
  subsection: mongoose.Types.ObjectId;
  text: string;
  options: IOption[];
  order: number; // Added order field
  category?: string;
  questionType: QuestionType;
}

const questionSchema = new mongoose.Schema<IQuestion>({
  subsection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subsection",
    required: true,
  },
  text: { type: String, required: true },
  options: [
    {
      text: { type: String, required: true },
      score: { type: Number, required: true },
    },
  ],
  order: { type: Number, required: true, default: 0 },
  questionType: {
    type: String,
    enum: Object.values(QuestionType),
    required: true,
  },
  category: { type: String },
});

export const Question = mongoose.model<IQuestion>("Question", questionSchema);

import mongoose, { Document } from 'mongoose';

export interface ISubsection extends Document {
  section: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  questions: mongoose.Types.ObjectId[];
}

const subsectionSchema = new mongoose.Schema<ISubsection>({
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

export const Subsection = mongoose.model<ISubsection>('Subsection', subsectionSchema);
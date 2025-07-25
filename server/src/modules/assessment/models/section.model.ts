import mongoose, { Document } from 'mongoose';

export interface ISection extends Document {
  name: string;
  description: string;
  duration: string;
  order: number; // Added order field
  subsections: mongoose.Types.ObjectId[];
}

const sectionSchema = new mongoose.Schema<ISection>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  order: { type: Number, required: true, default: 0 }, // Added order field
  subsections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subsection' }]
});

export const Section = mongoose.model<ISection>('Section', sectionSchema);
import mongoose, { Document } from 'mongoose';

export interface ISection extends Document {
  name: string;
  description: string;
  duration: string;
  subsections: mongoose.Types.ObjectId[];
}

const sectionSchema = new mongoose.Schema<ISection>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  subsections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subsection' }]
});

export const Section = mongoose.model<ISection>('Section', sectionSchema);
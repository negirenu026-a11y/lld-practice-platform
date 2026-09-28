import mongoose, { type Document, Schema } from 'mongoose';

export interface IProblem extends Document {
  problemId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concepts: string[];
  description: string;
  requirements: string[];
  expectedFormat: string[];
}

const ProblemSchema = new Schema<IProblem>(
  {
    problemId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    concepts: { type: [String], default: [] },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    expectedFormat: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);

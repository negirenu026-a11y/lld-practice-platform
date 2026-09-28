import mongoose, { type Document, Schema } from 'mongoose';

export interface ICriterionScore {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  feedback: string;
}

export interface IImprovement {
  observation: string;
  whyItMatters: string;
  suggestion: string;
}

export interface IEvaluatorResult {
  evaluator: 'deterministic' | 'ai';
  score: number;
  passed: boolean;
  details: string;
  error?: string;
}

export interface IEvaluation extends Document {
  submissionId: mongoose.Types.ObjectId;
  overallScore: number;
  criteria: ICriterionScore[];
  strengths: string[];
  improvements: IImprovement[];
  evaluatorResults: IEvaluatorResult[];
}

const CriterionScoreSchema = new Schema<ICriterionScore>(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    weight: { type: Number, required: true },
    feedback: { type: String, default: '' },
  },
  { _id: false }
);

const ImprovementSchema = new Schema<IImprovement>(
  {
    observation: { type: String, required: true },
    whyItMatters: { type: String, required: true },
    suggestion: { type: String, required: true },
  },
  { _id: false }
);

const EvaluatorResultSchema = new Schema<IEvaluatorResult>(
  {
    evaluator: { type: String, enum: ['deterministic', 'ai'], required: true },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    details: { type: String, default: '' },
    error: { type: String },
  },
  { _id: false }
);

const EvaluationSchema = new Schema<IEvaluation>(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true,
      index: true,
    },
    overallScore: { type: Number, required: true },
    criteria: { type: [CriterionScoreSchema], default: [] },
    strengths: { type: [String], default: [] },
    improvements: { type: [ImprovementSchema], default: [] },
    evaluatorResults: { type: [EvaluatorResultSchema], default: [] },
  },
  { timestamps: true }
);

export const Evaluation = mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);

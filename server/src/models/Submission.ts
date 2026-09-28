import mongoose, { type Document, Schema } from 'mongoose';

export interface IClassDefinition {
  name: string;
  responsibilities: string;
  methods: string;
}

export interface IInterfaceDefinition {
  name: string;
  methods: string;
}

export type SubmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED';

export interface ISubmission extends Document {
  problemId: string;
  attemptNumber: number;
  status: SubmissionStatus;
  classes: IClassDefinition[];
  interfaces: IInterfaceDefinition[];
  relationships: string[];
  explanation: string;
}

const ClassDefinitionSchema = new Schema<IClassDefinition>(
  {
    name: { type: String, required: true },
    responsibilities: { type: String, default: '' },
    methods: { type: String, default: '' },
  },
  { _id: false }
);

const InterfaceDefinitionSchema = new Schema<IInterfaceDefinition>(
  {
    name: { type: String, required: true },
    methods: { type: String, default: '' },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    problemId: { type: String, required: true, index: true },
    attemptNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'EVALUATING', 'COMPLETED', 'FAILED'],
      default: 'SUBMITTED',
    },
    classes: { type: [ClassDefinitionSchema], default: [] },
    interfaces: { type: [InterfaceDefinitionSchema], default: [] },
    relationships: { type: [String], default: [] },
    explanation: { type: String, default: '' },
  },
  { timestamps: true }
);

SubmissionSchema.index({ problemId: 1, attemptNumber: -1 });

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);

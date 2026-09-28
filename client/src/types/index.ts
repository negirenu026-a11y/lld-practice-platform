// ── Domain Types ──

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SubmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  concepts: string[];
  description: string;
  requirements: string[];
  expectedFormat: string[];
}

export interface ClassDefinition {
  name: string;
  responsibilities: string;
  methods: string;
}

export interface InterfaceDefinition {
  name: string;
  methods: string;
}

export interface SubmissionData {
  problemId: string;
  classes: ClassDefinition[];
  interfaces: InterfaceDefinition[];
  relationships: string[];
  explanation: string;
}

export interface Submission {
  id: string;
  problemId: string;
  attemptNumber: number;
  status: SubmissionStatus;
  classes: ClassDefinition[];
  interfaces: InterfaceDefinition[];
  relationships: string[];
  explanation: string;
  createdAt: string;
  updatedAt: string;
}

export interface CriterionScore {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  feedback: string;
}

export interface Improvement {
  observation: string;
  whyItMatters: string;
  suggestion: string;
}

export interface EvaluatorResult {
  evaluator: 'deterministic' | 'ai';
  score: number;
  passed: boolean;
  details: string;
  error?: string;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  overallScore: number;
  criteria: CriterionScore[];
  strengths: string[];
  improvements: Improvement[];
  evaluatorResults: EvaluatorResult[];
  createdAt: string;
}

// ── Learner Progress (Dashboard) ──

export interface LearnerProgress {
  totalAttempts: number;
  completedAttempts: number;
  latestScore: number | null;
}

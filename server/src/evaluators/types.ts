import type { ISubmission, ICriterionScore, IImprovement, IEvaluatorResult } from '../models/index.js';

// ── Evaluator result shape (before persisting) ──

export interface EvaluationResult {
  overallScore: number;
  criteria: ICriterionScore[];
  strengths: string[];
  improvements: IImprovement[];
  evaluatorResults: IEvaluatorResult[];
}

// ── Evaluator interface — all evaluators implement this ──

export interface Evaluator {
  readonly name: string;
  evaluate(submission: ISubmission): Promise<EvaluationResult>;
}

// ── AI Provider interface — abstraction over any LLM API ──

export interface AIProviderResponse {
  strengths: string[];
  improvements: IImprovement[];
  score: number;
}

export interface AIProvider {
  readonly name: string;
  evaluate(submission: ISubmission, problemTitle: string): Promise<AIProviderResponse>;
}

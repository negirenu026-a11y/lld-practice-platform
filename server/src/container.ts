import { config } from './config.js';
import { SubmissionService, EvaluationService } from './services/index.js';
import {
  DeterministicEvaluator,
  AIEvaluator,
  MockAIProvider,
  CompositeEvaluator,
} from './evaluators/index.js';
import type { AIProvider } from './evaluators/index.js';

// ── Wire up the evaluator pipeline ──

const deterministicEvaluator = new DeterministicEvaluator();

// Choose AI provider based on API key presence
const aiProvider: AIProvider = config.ai.apiKey
  ? new AIEvaluator()
  : new MockAIProvider();

if (!config.ai.apiKey) {
  console.log('ℹ AI_API_KEY not set — using MockAIProvider');
}

const compositeEvaluator = new CompositeEvaluator(deterministicEvaluator, aiProvider);

// ── Services (depend on abstractions, not concretions) ──

export const submissionService = new SubmissionService();
export const evaluationService = new EvaluationService(compositeEvaluator);

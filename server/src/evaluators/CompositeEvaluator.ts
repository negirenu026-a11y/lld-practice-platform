import type { ISubmission } from '../models/index.js';
import type { Evaluator, EvaluationResult, AIProvider } from './types.js';
import { DeterministicEvaluator } from './DeterministicEvaluator.js';

/**
 * CompositeEvaluator runs the deterministic evaluator first, then attempts the
 * AI provider. AI failure is gracefully handled — the deterministic result is
 * kept, AI error is stored, and the submission is still marked COMPLETED.
 */
export class CompositeEvaluator implements Evaluator {
  readonly name = 'composite';
  deterministic: DeterministicEvaluator;
  aiProvider: AIProvider;

  constructor(deterministic: DeterministicEvaluator, aiProvider: AIProvider) {
    this.deterministic = deterministic;
    this.aiProvider = aiProvider;
  }

  async evaluate(submission: ISubmission, problemTitle?: string): Promise<EvaluationResult> {
    // 1. Always run deterministic first
    const result = await this.deterministic.evaluate(submission);

    // 2. Attempt AI evaluation (never let it fail the overall evaluation)
    try {
      const aiResult = await this.aiProvider.evaluate(
        submission,
        problemTitle ?? submission.problemId
      );

      // Merge AI strengths and improvements
      result.strengths.push(...aiResult.strengths);
      result.improvements.push(...aiResult.improvements);

      result.evaluatorResults.push({
        evaluator: 'ai',
        score: aiResult.score,
        passed: true,
        details: `AI evaluation completed. AI score: ${aiResult.score}%.`,
      });
    } catch (err) {
      // AI failure is non-fatal
      const errorMsg = err instanceof Error ? err.message : 'Unknown AI error';
      console.warn(`[CompositeEvaluator] AI evaluation failed: ${errorMsg}`);

      result.evaluatorResults.push({
        evaluator: 'ai',
        score: 0,
        passed: false,
        details: '',
        error: errorMsg,
      });
    }

    return result;
  }
}

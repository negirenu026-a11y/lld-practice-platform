import { Evaluation, Problem } from '../models/index.js';
import type { IEvaluation, ISubmission } from '../models/index.js';
import type { CompositeEvaluator } from '../evaluators/CompositeEvaluator.js';

/**
 * EvaluationService depends only on the Evaluator interface.
 * The concrete evaluator (CompositeEvaluator) is injected via constructor.
 */
export class EvaluationService {
  evaluator: CompositeEvaluator;

  constructor(evaluator: CompositeEvaluator) {
    this.evaluator = evaluator;
  }

  async evaluate(submission: ISubmission): Promise<IEvaluation> {
    const problem = await Problem.findOne({ problemId: submission.problemId });
    const problemTitle = problem?.title ?? submission.problemId;

    const result = await this.evaluator.evaluate(submission, problemTitle);

    const evaluation = await Evaluation.create({
      submissionId: submission._id,
      overallScore: result.overallScore,
      criteria: result.criteria,
      strengths: result.strengths,
      improvements: result.improvements,
      evaluatorResults: result.evaluatorResults,
    });

    return evaluation;
  }

  async getBySubmissionId(submissionId: string): Promise<IEvaluation> {
    const evaluation = await Evaluation.findOne({ submissionId });
    if (!evaluation)
      throw new Error(`Evaluation for submission "${submissionId}" not found.`);
    return evaluation;
  }
}

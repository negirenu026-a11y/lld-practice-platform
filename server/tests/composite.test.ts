import { describe, it, expect } from 'vitest';
import { CompositeEvaluator } from '../src/evaluators/CompositeEvaluator.js';
import { DeterministicEvaluator } from '../src/evaluators/DeterministicEvaluator.js';
import { MockAIProvider } from '../src/evaluators/MockAIProvider.js';
import type { AIProvider, AIProviderResponse } from '../src/evaluators/types.js';
import type { ISubmission } from '../src/models/Submission.js';

function makeSubmission(): ISubmission {
  return {
    _id: 'test-id',
    problemId: 'parking-lot',
    attemptNumber: 1,
    status: 'SUBMITTED',
    classes: [{ name: 'ParkingLot', responsibilities: 'manages', methods: 'park' }],
    interfaces: [{ name: 'IStrategy', methods: 'execute' }],
    relationships: ['ParkingLot uses IStrategy'],
    explanation: 'Uses strategy pattern for extensibility.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as ISubmission;
}

describe('CompositeEvaluator', () => {
  it('should include both deterministic and AI results when AI succeeds', async () => {
    const composite = new CompositeEvaluator(
      new DeterministicEvaluator(),
      new MockAIProvider()
    );

    const result = await composite.evaluate(makeSubmission(), 'Parking Lot');

    const evaluators = result.evaluatorResults.map((r) => r.evaluator);
    expect(evaluators).toContain('deterministic');
    expect(evaluators).toContain('ai');

    const aiResult = result.evaluatorResults.find((r) => r.evaluator === 'ai')!;
    expect(aiResult.passed).toBe(true);
    expect(aiResult.error).toBeUndefined();
  });

  it('should gracefully handle AI failure and still return deterministic result', async () => {
    const failingAI: AIProvider = {
      name: 'failing-ai',
      evaluate: async (): Promise<AIProviderResponse> => {
        throw new Error('AI service unavailable');
      },
    };

    const composite = new CompositeEvaluator(
      new DeterministicEvaluator(),
      failingAI
    );

    const result = await composite.evaluate(makeSubmission(), 'Parking Lot');

    // Should not throw
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.criteria).toHaveLength(5);

    // AI result should record the error
    const aiResult = result.evaluatorResults.find((r) => r.evaluator === 'ai')!;
    expect(aiResult.passed).toBe(false);
    expect(aiResult.error).toContain('AI service unavailable');

    // Deterministic should still be present
    const detResult = result.evaluatorResults.find((r) => r.evaluator === 'deterministic')!;
    expect(detResult.passed).toBe(true);
  });

  it('should merge AI strengths and improvements with deterministic results', async () => {
    const composite = new CompositeEvaluator(
      new DeterministicEvaluator(),
      new MockAIProvider()
    );

    const result = await composite.evaluate(makeSubmission(), 'Parking Lot');

    // MockAIProvider adds [AI Mock] prefixed items
    const aiStrengths = result.strengths.filter((s) => s.includes('[AI Mock]'));
    expect(aiStrengths.length).toBeGreaterThan(0);
  });
});

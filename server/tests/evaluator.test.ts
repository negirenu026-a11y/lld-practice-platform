import { describe, it, expect } from 'vitest';
import { DeterministicEvaluator } from '../src/evaluators/DeterministicEvaluator.js';
import type { ISubmission } from '../src/models/Submission.js';

function makeSubmission(overrides: Partial<{
  classes: ISubmission['classes'];
  interfaces: ISubmission['interfaces'];
  relationships: string[];
  explanation: string;
}>): ISubmission {
  return {
    _id: 'test-id',
    problemId: 'parking-lot',
    attemptNumber: 1,
    status: 'SUBMITTED',
    classes: overrides.classes ?? [],
    interfaces: overrides.interfaces ?? [],
    relationships: overrides.relationships ?? [],
    explanation: overrides.explanation ?? '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as unknown as ISubmission;
}

describe('DeterministicEvaluator', () => {
  const evaluator = new DeterministicEvaluator();

  it('should return a low score for an empty submission', async () => {
    const sub = makeSubmission({});
    const result = await evaluator.evaluate(sub);

    expect(result.overallScore).toBeLessThan(30);
    expect(result.criteria).toHaveLength(5);
    expect(result.evaluatorResults).toHaveLength(1);
    expect(result.evaluatorResults[0].evaluator).toBe('deterministic');
  });

  it('should score higher with multiple classes', async () => {
    const sub = makeSubmission({
      classes: [
        { name: 'ParkingLot', responsibilities: 'manages floors', methods: 'park, unpark' },
        { name: 'Vehicle', responsibilities: 'vehicle data', methods: 'getType' },
        { name: 'Spot', responsibilities: 'single spot', methods: 'isAvailable, assign' },
      ],
      explanation: 'Design uses composition. ParkingLot has floors, each with spots.',
    });

    const empty = await evaluator.evaluate(makeSubmission({}));
    const result = await evaluator.evaluate(sub);

    expect(result.overallScore).toBeGreaterThan(empty.overallScore);
  });

  it('should reward interface usage in Abstraction score', async () => {
    const withoutIface = makeSubmission({
      classes: [{ name: 'A', responsibilities: 'a', methods: 'doA' }],
      explanation: 'Minimal design.',
    });
    const withIface = makeSubmission({
      classes: [{ name: 'A', responsibilities: 'a', methods: 'doA' }],
      interfaces: [{ name: 'IStrategy', methods: 'execute' }],
      explanation: 'Minimal design.',
    });

    const r1 = await evaluator.evaluate(withoutIface);
    const r2 = await evaluator.evaluate(withIface);

    const abstractionWithout = r1.criteria.find((c) => c.name === 'Abstraction')!;
    const abstractionWith = r2.criteria.find((c) => c.name === 'Abstraction')!;

    expect(abstractionWith.score).toBeGreaterThan(abstractionWithout.score);
  });

  it('should add improvement when explanation is too brief', async () => {
    const sub = makeSubmission({
      classes: [{ name: 'A', responsibilities: 'a', methods: 'doA' }],
      relationships: ['A uses B'],
      explanation: 'Short.',
    });

    const result = await evaluator.evaluate(sub);
    const hasExplanationImprovement = result.improvements.some(
      (i) => i.observation.toLowerCase().includes('explanation')
    );

    expect(hasExplanationImprovement).toBe(true);
  });

  it('should add strength when explanation is thorough', async () => {
    const sub = makeSubmission({
      classes: [{ name: 'A', responsibilities: 'a', methods: 'doA' }],
      relationships: ['A uses B'],
      explanation:
        'This design uses the Strategy pattern to allow for multiple pricing algorithms without modifying the core ParkingLot class. Composition is used instead of inheritance to keep the design flexible.',
    });

    const result = await evaluator.evaluate(sub);
    const hasExplanationStrength = result.strengths.some(
      (s) => s.toLowerCase().includes('explanation')
    );

    expect(hasExplanationStrength).toBe(true);
  });

  it('should penalize classes with too many methods', async () => {
    const sub = makeSubmission({
      classes: [
        {
          name: 'GodClass',
          responsibilities: 'everything',
          methods: 'a, b, c, d, e, f, g',
        },
      ],
      relationships: ['GodClass does everything'],
      explanation: 'One class to rule them all.',
    });

    const result = await evaluator.evaluate(sub);
    const sepCriterion = result.criteria.find(
      (c) => c.name === 'Responsibility Separation'
    )!;

    expect(sepCriterion.score).toBeLessThanOrEqual(40);
    expect(result.improvements.some((i) => i.observation.includes('many methods'))).toBe(
      true
    );
  });

  it('should reward well-defined relationships', async () => {
    const fewRels = makeSubmission({
      classes: [{ name: 'A', responsibilities: 'a', methods: 'doA' }],
      relationships: ['A uses B'],
      explanation: 'Basic.',
    });
    const manyRels = makeSubmission({
      classes: [{ name: 'A', responsibilities: 'a', methods: 'doA' }],
      relationships: [
        'A has-many B (composition)',
        'A uses C (dependency)',
        'B implements D (inheritance)',
        'C uses E (association)',
      ],
      explanation: 'Rich relationships.',
    });

    const r1 = await evaluator.evaluate(fewRels);
    const r2 = await evaluator.evaluate(manyRels);

    const relScore1 = r1.criteria.find((c) => c.name === 'Relationships')!.score;
    const relScore2 = r2.criteria.find((c) => c.name === 'Relationships')!.score;

    expect(relScore2).toBeGreaterThan(relScore1);
  });

  it('should have 5 weighted criteria summing to 100%', async () => {
    const sub = makeSubmission({
      classes: [{ name: 'A', responsibilities: 'a', methods: 'doA' }],
      explanation: 'Test.',
    });

    const result = await evaluator.evaluate(sub);
    const totalWeight = result.criteria.reduce((sum, c) => sum + c.weight, 0);

    expect(result.criteria).toHaveLength(5);
    expect(totalWeight).toBe(100);
  });
});

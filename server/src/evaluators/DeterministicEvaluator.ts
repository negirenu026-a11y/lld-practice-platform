import type { ISubmission, ICriterionScore, IImprovement } from '../models/index.js';
import type { Evaluator, EvaluationResult } from './types.js';

/**
 * DeterministicEvaluator scores submissions using rule-based heuristics.
 * No external dependencies — always available, always deterministic.
 */
export class DeterministicEvaluator implements Evaluator {
  readonly name = 'deterministic';

  async evaluate(submission: ISubmission): Promise<EvaluationResult> {
    const { classes, interfaces, relationships, explanation } = submission;
    const criteria: ICriterionScore[] = [];
    const strengths: string[] = [];
    const improvements: IImprovement[] = [];

    const classCount = classes.length;

    // 1. Requirement Coverage (25%)
    const reqScore = Math.min(classCount * 15, 80) + (explanation.length > 100 ? 20 : 0);
    criteria.push({
      name: 'Requirement Coverage',
      score: Math.min(reqScore, 100),
      maxScore: 100,
      weight: 25,
      feedback:
        classCount >= 3
          ? 'Good coverage of core requirements through your class structure.'
          : 'Consider adding more classes to cover all requirements.',
    });

    // 2. Responsibility Separation (25%)
    const avgMethods =
      classCount > 0
        ? classes.reduce(
            (sum, c) => sum + c.methods.split(',').filter((m) => m.trim()).length,
            0
          ) / classCount
        : 0;
    const sepScore =
      avgMethods > 5 ? 40 : avgMethods >= 2 ? 75 : classCount > 0 ? 55 : 10;
    criteria.push({
      name: 'Responsibility Separation',
      score: sepScore,
      maxScore: 100,
      weight: 25,
      feedback:
        avgMethods > 5
          ? 'Some classes may have too many responsibilities. Consider splitting them.'
          : 'Responsibilities are reasonably distributed across classes.',
    });

    if (avgMethods > 5) {
      improvements.push({
        observation: 'One or more classes have many methods (>5 each).',
        whyItMatters:
          'Classes with too many responsibilities are hard to test, maintain, and extend independently.',
        suggestion:
          'Apply the Single Responsibility Principle — extract related methods into separate classes.',
      });
    } else if (classCount >= 2) {
      strengths.push('Good separation of concerns across multiple classes.');
    }

    // 3. Abstraction (20%)
    const hasInterfaces = interfaces.length > 0;
    const absScore = hasInterfaces ? 70 + Math.min(interfaces.length * 10, 30) : 20;
    criteria.push({
      name: 'Abstraction',
      score: absScore,
      maxScore: 100,
      weight: 20,
      feedback: hasInterfaces
        ? 'Interfaces create useful extension points in your design.'
        : 'No interfaces defined — consider abstracting behaviours behind interfaces.',
    });

    if (hasInterfaces) {
      strengths.push(
        'Interface usage creates clear extension points, supporting the Open/Closed Principle.'
      );
    } else {
      improvements.push({
        observation: 'No interfaces defined in the design.',
        whyItMatters:
          'Without interfaces, concrete classes are tightly coupled, making it harder to swap implementations.',
        suggestion:
          'Identify behaviours that may have multiple implementations and extract them as interfaces.',
      });
    }

    // 4. Relationships (15%)
    const relCount = relationships.filter((r) => r.trim()).length;
    const relScore = Math.min(relCount * 20, 80) + (relCount >= 3 ? 20 : 0);
    criteria.push({
      name: 'Relationships',
      score: Math.min(relScore, 100),
      maxScore: 100,
      weight: 15,
      feedback:
        relCount >= 3
          ? 'Relationships are well-defined and show how classes collaborate.'
          : 'Define more relationships to clarify how components interact.',
    });

    if (relCount >= 3) {
      strengths.push('Clear relationship mapping between classes.');
    } else {
      improvements.push({
        observation: `Only ${relCount} relationship(s) defined.`,
        whyItMatters:
          'Without clear relationships, the design lacks a connected structure.',
        suggestion:
          'Map out associations, compositions, and inheritance between your classes.',
      });
    }

    // 5. Extensibility (15%)
    const extScore =
      hasInterfaces && classCount >= 3
        ? 85
        : hasInterfaces
          ? 60
          : classCount >= 3
            ? 45
            : 15;
    criteria.push({
      name: 'Extensibility',
      score: extScore,
      maxScore: 100,
      weight: 15,
      feedback:
        hasInterfaces && classCount >= 3
          ? 'Design is well-positioned for future extension.'
          : 'Consider how new features could be added without modifying existing code.',
    });

    if (!hasInterfaces && classCount < 3) {
      improvements.push({
        observation: 'Design lacks extensibility mechanisms.',
        whyItMatters: 'Real systems evolve — a rigid design requires rewriting.',
        suggestion:
          'Use interfaces and composition to allow adding new behaviour without touching existing classes.',
      });
    }

    // Overall score (weighted)
    const overallScore = Math.round(
      criteria.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0)
    );

    if (explanation.length > 100) {
      strengths.push('Thorough design explanation that justifies abstraction choices.');
    }
    if (classCount >= 1) {
      strengths.push(`Defined ${classCount} class(es) to model the domain.`);
    }
    if (explanation.length < 50) {
      improvements.push({
        observation: 'Design explanation is too brief.',
        whyItMatters:
          'Explaining reasoning demonstrates deeper understanding.',
        suggestion:
          'Provide reasoning behind your abstraction choices, trade-offs, and edge case handling.',
      });
    }

    return {
      overallScore,
      criteria,
      strengths,
      improvements,
      evaluatorResults: [
        {
          evaluator: 'deterministic',
          score: overallScore,
          passed: overallScore >= 40,
          details: `Deterministic checks passed. Overall score: ${overallScore}%.`,
        },
      ],
    };
  }
}

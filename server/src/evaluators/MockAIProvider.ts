import type { ISubmission } from '../models/index.js';
import type { AIProvider, AIProviderResponse } from './types.js';

/**
 * MockAIProvider returns canned feedback when no real AI_API_KEY is set.
 */
export class MockAIProvider implements AIProvider {
  readonly name = 'mock-ai';

  async evaluate(submission: ISubmission, _problemTitle: string): Promise<AIProviderResponse> {
    const classCount = submission.classes.length;
    const hasInterfaces = submission.interfaces.length > 0;

    const strengths: string[] = [];
    const improvements: AIProviderResponse['improvements'] = [];

    if (classCount >= 3) {
      strengths.push('[AI Mock] Your class decomposition demonstrates good domain modelling.');
    }
    if (hasInterfaces) {
      strengths.push('[AI Mock] Good use of interfaces for polymorphism.');
    }

    if (classCount < 3) {
      improvements.push({
        observation: '[AI Mock] Limited number of classes.',
        whyItMatters: 'A richer class model often leads to better separation of concerns.',
        suggestion: 'Consider breaking large classes into smaller, focused ones.',
      });
    }

    const score = Math.min(classCount * 15 + (hasInterfaces ? 20 : 0), 100);

    return { strengths, improvements, score };
  }
}

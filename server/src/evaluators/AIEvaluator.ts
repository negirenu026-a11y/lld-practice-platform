import { config } from '../config.js';
import type { ISubmission } from '../models/index.js';
import type { AIProvider, AIProviderResponse } from './types.js';

/**
 * Real AI provider — calls an OpenAI-compatible chat completion API.
 * Throws on failure (caller handles graceful degradation).
 */
export class AIEvaluator implements AIProvider {
  readonly name = 'openai';

  async evaluate(submission: ISubmission, problemTitle: string): Promise<AIProviderResponse> {
    const prompt = this.buildPrompt(submission, problemTitle);

    const res = await fetch(config.ai.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.ai.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert software architect reviewing Low-Level Design submissions. Return ONLY valid JSON matching {strengths: string[], improvements: {observation: string, whyItMatters: string, suggestion: string}[], score: number}. Score is 0-100.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`AI API returned ${res.status}: ${body}`);
    }

    const json = (await res.json()) as {
      choices: { message: { content: string } }[];
    };

    const content = json.choices?.[0]?.message?.content ?? '';
    const parsed = JSON.parse(content) as AIProviderResponse;

    return {
      strengths: parsed.strengths ?? [],
      improvements: parsed.improvements ?? [],
      score: typeof parsed.score === 'number' ? parsed.score : 50,
    };
  }

  private buildPrompt(submission: ISubmission, problemTitle: string): string {
    const classesSummary = submission.classes
      .map((c) => `- ${c.name}: ${c.responsibilities} [methods: ${c.methods}]`)
      .join('\n');
    const ifacesSummary = submission.interfaces
      .map((i) => `- ${i.name} [methods: ${i.methods}]`)
      .join('\n');
    const relsSummary = submission.relationships.join('\n- ');

    return `
Problem: ${problemTitle}

## Classes
${classesSummary || '(none)'}

## Interfaces
${ifacesSummary || '(none)'}

## Relationships
- ${relsSummary || '(none)'}

## Design Explanation
${submission.explanation || '(none provided)'}

Evaluate the above LLD submission. Focus on:
1. Requirement coverage
2. Responsibility separation (SRP)
3. Abstraction quality
4. Relationship correctness
5. Extensibility (OCP)
`.trim();
  }
}

import type {
  Problem,
  Submission,
  SubmissionData,
  Evaluation,
  LearnerProgress,
  CriterionScore,
  Improvement,
  EvaluatorResult,
} from '../types';
import { SEED_PROBLEMS } from './seedData';

// ── Toggle this flag to switch between mock and real API ──
const USE_MOCK = true;

const API_BASE = '/api';

// ── Helpers ──

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ── LocalStorage-backed store ──

const STORE_KEY = 'lld_practice_store';

interface Store {
  submissions: Submission[];
  evaluations: Evaluation[];
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch {
    /* ignore corrupt data */
  }
  return { submissions: [], evaluations: [] };
}

function saveStore(store: Store): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

// ── Mock Evaluation Engine ──

function generateMockEvaluation(
  submission: Submission,
  _problem: Problem
): Evaluation {
  const { classes, interfaces, relationships, explanation } = submission;

  // Criteria scoring
  const criteria: CriterionScore[] = [];
  const strengths: string[] = [];
  const improvements: Improvement[] = [];

  // 1. Requirement Coverage (25%)
  const classCount = classes.length;
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
  const avgMethodsPerClass =
    classCount > 0
      ? classes.reduce(
          (sum, c) =>
            sum + c.methods.split(',').filter((m) => m.trim()).length,
          0
        ) / classCount
      : 0;
  const sepScore =
    avgMethodsPerClass > 5
      ? 40
      : avgMethodsPerClass >= 2
        ? 75
        : classCount > 0
          ? 55
          : 10;
  criteria.push({
    name: 'Responsibility Separation',
    score: sepScore,
    maxScore: 100,
    weight: 25,
    feedback:
      avgMethodsPerClass > 5
        ? 'Some classes may have too many responsibilities. Consider splitting them.'
        : 'Responsibilities are reasonably distributed across classes.',
  });

  if (avgMethodsPerClass > 5) {
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
        'Without clear relationships, the design lacks a connected structure and is harder to understand.',
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
        : 'Consider how new features or variants could be added without modifying existing code.',
  });

  if (!hasInterfaces && classCount < 3) {
    improvements.push({
      observation: 'Design lacks extensibility mechanisms.',
      whyItMatters:
        'Real systems evolve — a rigid design requires rewriting instead of extending.',
      suggestion:
        'Use interfaces and composition to allow adding new behaviour without touching existing classes.',
    });
  }

  // Overall score (weighted)
  const overallScore = Math.round(
    criteria.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0)
  );

  // Generic strengths
  if (explanation.length > 100) {
    strengths.push('Thorough design explanation that justifies abstraction choices.');
  }
  if (classCount >= 1) {
    strengths.push(`Defined ${classCount} class(es) to model the domain.`);
  }

  // Missing explanation
  if (explanation.length < 50) {
    improvements.push({
      observation: 'Design explanation is too brief.',
      whyItMatters:
        'Explaining your reasoning demonstrates deeper understanding and helps reviewers follow your thought process.',
      suggestion:
        'Provide reasoning behind your abstraction choices, trade-offs, and how the design handles edge cases.',
    });
  }

  // Evaluator results
  const evaluatorResults: EvaluatorResult[] = [
    {
      evaluator: 'deterministic',
      score: overallScore,
      passed: overallScore >= 40,
      details: `Deterministic checks passed. Overall score: ${overallScore}%.`,
    },
    {
      evaluator: 'ai',
      score: 0,
      passed: false,
      details: '',
      error: 'AI evaluator is not available in demo mode.',
    },
  ];

  return {
    id: generateId(),
    submissionId: submission.id,
    overallScore,
    criteria,
    strengths,
    improvements,
    evaluatorResults,
    createdAt: new Date().toISOString(),
  };
}

// ── Mock API implementation ──

async function mockGetProblems(): Promise<Problem[]> {
  await delay(300);
  return SEED_PROBLEMS;
}

async function mockGetProblem(id: string): Promise<Problem> {
  await delay(200);
  const problem = SEED_PROBLEMS.find((p) => p.id === id);
  if (!problem) throw new Error(`Problem "${id}" not found.`);
  return problem;
}

async function mockCreateSubmission(data: SubmissionData): Promise<Submission> {
  await delay(400);
  const store = loadStore();

  const existingAttempts = store.submissions.filter(
    (s) => s.problemId === data.problemId
  );
  const attemptNumber = existingAttempts.length + 1;

  const submission: Submission = {
    id: generateId(),
    problemId: data.problemId,
    attemptNumber,
    status: 'SUBMITTED',
    classes: data.classes,
    interfaces: data.interfaces,
    relationships: data.relationships,
    explanation: data.explanation,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.submissions.push(submission);
  saveStore(store);
  return submission;
}

async function mockGetSubmission(id: string): Promise<Submission> {
  await delay(200);
  const store = loadStore();
  const sub = store.submissions.find((s) => s.id === id);
  if (!sub) throw new Error(`Submission "${id}" not found.`);
  return sub;
}

async function mockGetAttempts(problemId: string): Promise<Submission[]> {
  await delay(300);
  const store = loadStore();
  return store.submissions
    .filter((s) => s.problemId === problemId)
    .sort((a, b) => b.attemptNumber - a.attemptNumber);
}

async function mockEvaluateSubmission(id: string): Promise<Evaluation> {
  const store = loadStore();
  const sub = store.submissions.find((s) => s.id === id);
  if (!sub) throw new Error(`Submission "${id}" not found.`);

  // Mark as evaluating
  sub.status = 'EVALUATING';
  sub.updatedAt = new Date().toISOString();
  saveStore(store);

  // Simulate evaluation delay
  await delay(2000);

  const problem = SEED_PROBLEMS.find((p) => p.id === sub.problemId);
  if (!problem) throw new Error(`Problem "${sub.problemId}" not found.`);

  const evaluation = generateMockEvaluation(sub, problem);

  // Mark as completed
  sub.status = 'COMPLETED';
  sub.updatedAt = new Date().toISOString();
  store.evaluations.push(evaluation);
  saveStore(store);

  return evaluation;
}

async function mockGetEvaluation(submissionId: string): Promise<Evaluation> {
  await delay(200);
  const store = loadStore();
  const evaluation = store.evaluations.find(
    (e) => e.submissionId === submissionId
  );
  if (!evaluation)
    throw new Error(`Evaluation for submission "${submissionId}" not found.`);
  return evaluation;
}

async function mockGetLearnerProgress(): Promise<LearnerProgress> {
  await delay(200);
  const store = loadStore();
  const total = store.submissions.length;
  const completed = store.submissions.filter(
    (s) => s.status === 'COMPLETED'
  ).length;
  const latestCompleted = store.submissions
    .filter((s) => s.status === 'COMPLETED')
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];

  let latestScore: number | null = null;
  if (latestCompleted) {
    const eval_ = store.evaluations.find(
      (e) => e.submissionId === latestCompleted.id
    );
    latestScore = eval_?.overallScore ?? null;
  }

  return { totalAttempts: total, completedAttempts: completed, latestScore };
}

async function mockGetAllAttempts(): Promise<Submission[]> {
  await delay(300);
  const store = loadStore();
  return store.submissions.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ── Real API ──

// MongoDB returns _id; frontend uses id. This normalizer handles the mapping.
interface MongoDoc {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

function normalizeId<T>(doc: T): T {
  const d = doc as MongoDoc;
  if (d._id && !d.id) {
    (d as MongoDoc).id = d._id;
  }
  return doc;
}

function normalizeList<T>(docs: T[]): T[] {
  return docs.map(normalizeId);
}

async function realFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as Record<string, string>).message || `HTTP ${res.status}`
    );
  }
  return res.json() as Promise<T>;
}

// ── Public API surface ──

export const api = {
  getProblems: (): Promise<Problem[]> =>
    USE_MOCK
      ? mockGetProblems()
      : realFetch<Problem[]>('/problems'),

  getProblem: (id: string): Promise<Problem> =>
    USE_MOCK
      ? mockGetProblem(id)
      : realFetch<Problem>(`/problems/${id}`),

  createSubmission: (data: SubmissionData): Promise<Submission> =>
    USE_MOCK
      ? mockCreateSubmission(data)
      : realFetch<Submission>('/submissions', {
          method: 'POST',
          body: JSON.stringify(data),
        }).then(normalizeId),

  getSubmission: (id: string): Promise<Submission> =>
    USE_MOCK
      ? mockGetSubmission(id)
      : realFetch<Submission>(`/submissions/${id}`).then(normalizeId),

  getAttempts: (problemId: string): Promise<Submission[]> =>
    USE_MOCK
      ? mockGetAttempts(problemId)
      : realFetch<Submission[]>(`/problems/${problemId}/attempts`).then(normalizeList),

  evaluateSubmission: (id: string): Promise<Evaluation> =>
    USE_MOCK
      ? mockEvaluateSubmission(id)
      : realFetch<Evaluation>(`/submissions/${id}/evaluate`, {
          method: 'POST',
        }).then(normalizeId),

  getEvaluation: (submissionId: string): Promise<Evaluation> =>
    USE_MOCK
      ? mockGetEvaluation(submissionId)
      : realFetch<Evaluation>(`/submissions/${submissionId}/evaluation`).then(normalizeId),

  // Computed client-side from per-problem attempts
  getLearnerProgress: async (): Promise<LearnerProgress> => {
    if (USE_MOCK) return mockGetLearnerProgress();

    const problems = await api.getProblems();
    const allAttempts: Submission[] = [];
    for (const p of problems) {
      const attempts = await api.getAttempts(p.id);
      allAttempts.push(...attempts);
    }

    const total = allAttempts.length;
    const completed = allAttempts.filter((s) => s.status === 'COMPLETED').length;
    let latestScore: number | null = null;

    const latestCompleted = allAttempts
      .filter((s) => s.status === 'COMPLETED')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

    if (latestCompleted) {
      try {
        const ev = await api.getEvaluation(latestCompleted.id);
        latestScore = ev.overallScore;
      } catch { /* ignore */ }
    }

    return { totalAttempts: total, completedAttempts: completed, latestScore };
  },

  getAllAttempts: async (): Promise<Submission[]> => {
    if (USE_MOCK) return mockGetAllAttempts();

    const problems = await api.getProblems();
    const allAttempts: Submission[] = [];
    for (const p of problems) {
      const attempts = await api.getAttempts(p.id);
      allAttempts.push(...attempts);
    }
    return allAttempts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};

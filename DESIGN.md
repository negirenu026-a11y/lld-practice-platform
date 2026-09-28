# Design Document

## System Overview
LLD Practice Platform is a monolithic full-stack application with a React SPA frontend and Node/Express API backend, backed by MongoDB.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                    CLIENT (SPA)                  │
│  React + TypeScript + Vite + Tailwind CSS        │
│                                                  │
│  Pages: Dashboard, ProblemDetails, Practice,     │
│         Feedback, History                        │
│                                                  │
│  services/api.ts ─── USE_MOCK flag ──┐           │
│     │ (mock: localStorage)           │           │
│     │ (real: fetch /api/*)           │           │
└─────┼────────────────────────────────┼───────────┘
      │ Vite proxy /api → :4000       │
      ▼                               │
┌─────────────────────────────────────────────────┐
│                   SERVER (API)                   │
│  Node + Express + TypeScript                     │
│                                                  │
│  Routes:                                         │
│    /api/problems      ← Problem CRUD             │
│    /api/submissions   ← Submission + Evaluation  │
│                                                  │
│  Services:                                       │
│    SubmissionService ── depends on → Models       │
│    EvaluationService ── depends on → Evaluator    │
│                                                  │
│  Evaluators (Strategy + Composite):              │
│    CompositeEvaluator                            │
│    ├── DeterministicEvaluator                    │
│    └── AIProvider (interface)                    │
│        ├── AIEvaluator (OpenAI)                  │
│        └── MockAIProvider (canned)               │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │    MongoDB     │
              │  Collections:  │
              │  - problems    │
              │  - submissions │
              │  - evaluations │
              └────────────────┘
```

## Key Design Patterns Used

### 1. Strategy Pattern — Evaluators
The `Evaluator` interface allows swapping evaluation strategies:
- `DeterministicEvaluator`: Rule-based, always available
- `CompositeEvaluator`: Orchestrates deterministic + AI

The `AIProvider` interface allows swapping AI backends:
- `AIEvaluator`: Real OpenAI API calls
- `MockAIProvider`: Canned responses for development

### 2. Composite Pattern — CompositeEvaluator
Runs multiple evaluators and merges results. AI failure is isolated — deterministic result is always preserved.

### 3. Dependency Inversion — Services
`EvaluationService` depends on the `Evaluator` interface, not on concrete classes. The DI container (`container.ts`) wires implementations at startup.

### 4. Repository Pattern — Mongoose Models
Models encapsulate data access. Services operate on model interfaces, not raw MongoDB queries.

## Data Model

### Problem
```
problemId (unique), title, difficulty, concepts[], description,
requirements[], expectedFormat[]
```

### Submission
```
problemId, attemptNumber, status (DRAFT|SUBMITTED|EVALUATING|COMPLETED|FAILED),
classes[], interfaces[], relationships[], explanation
```

### Evaluation
```
submissionId (unique, ref Submission), overallScore, criteria[],
strengths[], improvements[], evaluatorResults[]
```

## Error Handling Strategy

1. **AI failure** → Non-fatal. Deterministic result kept, AI error stored, status = COMPLETED
2. **Validation errors** → 400 with friendly message
3. **Not found** → 404 with message
4. **Server errors** → 500, no stack traces to client
5. **Frontend** → Error/loading/empty states on every page, no stack traces shown

## Extensibility Points

- **New problems**: Add to seed data, no code changes needed
- **New vehicle types / states**: The LLD problems themselves test extensibility
- **New AI provider**: Implement `AIProvider` interface, register in `container.ts`
- **New evaluation criteria**: Add to `DeterministicEvaluator.evaluate()`
- **Authentication**: Add middleware layer, associate submissions with user IDs

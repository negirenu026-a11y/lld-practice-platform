# LLD Practice Platform

An interactive Low-Level Design practice platform where learners solve real-world system design problems, submit structured solutions (classes, interfaces, relationships, explanations), and receive instant evaluation feedback.

## Architecture

```
client/          → React + TypeScript + Vite + Tailwind CSS (SPA)
server/          → Node + Express + TypeScript + MongoDB (API)
```

### Learner Journey
```
Dashboard → Problem List → Problem Details → Start Practice → Submit → Evaluation → Feedback → Attempt History → Retry
```

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (default: `mongodb://localhost:27017/lld-practice`)

### 1. Backend
```bash
cd server
cp .env.example .env     # edit if needed
npm install
npm run seed             # seed 3 problems into MongoDB
npm run dev              # starts on http://localhost:4000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev              # starts on http://localhost:5173, proxies /api → :4000
```

### 3. Mock-only Mode (no MongoDB needed)
Set `USE_MOCK = true` in `client/src/services/api.ts` and skip the backend entirely. The frontend runs fully standalone with localStorage persistence.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/problems` | List all problems |
| GET | `/api/problems/:id` | Get problem by ID |
| POST | `/api/submissions` | Create a submission |
| GET | `/api/submissions/:id` | Get submission by ID |
| GET | `/api/problems/:id/attempts` | Get attempts for a problem |
| POST | `/api/submissions/:id/evaluate` | Trigger evaluation |
| GET | `/api/submissions/:id/evaluation` | Get evaluation result |
| GET | `/api/health` | Health check |

## Evaluator Architecture

```
CompositeEvaluator
├── DeterministicEvaluator  (always runs, rule-based scoring)
└── AIProvider              (optional, graceful failure)
    ├── AIEvaluator          (real OpenAI API)
    └── MockAIProvider       (canned feedback when no API key)
```

**Key design decision**: AI failure never fails the submission. The deterministic result is kept, the AI error is stored, and the submission is marked COMPLETED.

## Testing

```bash
cd server
npm test    # 11 tests (Vitest)
```

## Environment Variables

See [.env.example](server/.env.example) for all options. Key ones:
- `MONGODB_URI` — MongoDB connection string
- `AI_API_KEY` — OpenAI API key (empty = MockAIProvider)

## Project Structure

```
client/src/
├── components/     7 reusable components
├── hooks/          useAsync generic fetcher
├── pages/          5 pages (Dashboard, ProblemDetails, Practice, Feedback, History)
├── services/       api.ts (mock+real), seedData.ts
├── types/          Domain types
└── App.tsx         Router + Navbar

server/src/
├── evaluators/     Evaluator interface + 4 implementations
├── models/         Problem, Submission, Evaluation (Mongoose)
├── routes/         Express routes
├── services/       SubmissionService, EvaluationService
├── container.ts    DI wiring
├── config.ts       Env loading
├── db.ts           MongoDB connection
├── index.ts        Express server
└── seed.ts         Database seeder
```

# AI Usage Documentation

## Where AI is Used

### 1. Submission Evaluation (Optional)
The platform includes an AI evaluation pipeline as part of the `CompositeEvaluator`:

```
CompositeEvaluator
├── DeterministicEvaluator  ← Always runs (no AI)
└── AIProvider              ← Optional AI layer
    ├── AIEvaluator          (real API call)
    └── MockAIProvider       (fallback when no API key)
```

### 2. AI Provider Configuration
- **AI_API_KEY** environment variable controls which provider is used
- If `AI_API_KEY` is empty or missing → `MockAIProvider` is used automatically
- If `AI_API_KEY` is set → `AIEvaluator` calls the configured OpenAI-compatible API

### 3. What AI Evaluates
When active, the AI receives:
- The problem title
- The learner's class definitions (names, responsibilities, methods)
- Interface definitions
- Relationships
- Design explanation

It returns:
- Additional strengths (e.g., "good use of Factory pattern")
- Additional improvements (observation / why it matters / suggestion)
- An AI-specific score (0-100)

### 4. AI Failure Handling
**Critical design decision**: AI failure NEVER fails the submission.

If the AI call fails (timeout, rate limit, invalid response):
1. The deterministic evaluation result is preserved
2. The AI error message is stored in `evaluatorResults[].error`
3. The submission status is still set to `COMPLETED`
4. The frontend shows "AI feedback unavailable" with the error reason

### 5. AI Prompt Design
The prompt sent to the AI is structured and focused:
- System message establishes the AI as an expert software architect
- User message contains the submission in a readable format
- Response format is constrained to JSON matching our `AIProviderResponse` type
- Temperature is set to 0.3 for consistent, focused feedback
- Max tokens is 1024 to keep responses concise

### 6. AI Model
Default: `gpt-4o-mini` (configured via `AI_MODEL` env var)
Chosen for:
- Cost efficiency for educational feedback
- Sufficient quality for design review
- Fast response times

## AI in Development

### Code Generation
This project was built with AI assistance (Antigravity IDE). AI was used for:
- Initial code scaffolding and boilerplate
- Iterating on component designs
- Writing test cases
- Documentation generation

All AI-generated code was reviewed, tested, and validated before inclusion.

## Privacy & Data
- No learner data is sent to external AI services unless `AI_API_KEY` is explicitly configured
- Mock mode (default) operates entirely locally
- When AI is enabled, only the submission content is sent — no personal data

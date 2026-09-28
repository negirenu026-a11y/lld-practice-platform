import { Router, type Request, type Response } from 'express';

const router = Router();

// POST /api/submissions
router.post('/', async (req: Request, res: Response) => {
  try {
    const { submissionService } = await import('../container.js');
    const { problemId, classes, interfaces, relationships, explanation } = req.body as Record<string, unknown>;

    if (!problemId || !Array.isArray(classes) || !Array.isArray(relationships) || typeof explanation !== 'string') {
      res.status(400).json({ message: 'Missing required fields: problemId, classes, relationships, explanation.' });
      return;
    }

    const submission = await submissionService.create({
      problemId: problemId as string,
      classes: classes as { name: string; responsibilities: string; methods: string }[],
      interfaces: (interfaces ?? []) as { name: string; methods: string }[],
      relationships: relationships as string[],
      explanation: explanation as string,
    });

    res.status(201).json(submission);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    const status = msg.includes('not found') ? 404 : 500;
    res.status(status).json({ message: msg });
  }
});

// GET /api/submissions/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { submissionService } = await import('../container.js');
    const submission = await submissionService.getById(id);
    res.json(submission);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(404).json({ message: msg });
  }
});

// POST /api/submissions/:id/evaluate
router.post('/:id/evaluate', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { submissionService, evaluationService } = await import('../container.js');

    const submission = await submissionService.getById(id);

    if (submission.status !== 'SUBMITTED') {
      res.status(400).json({ message: `Submission is in "${submission.status}" state, expected "SUBMITTED".` });
      return;
    }

    await submissionService.updateStatus(id, 'EVALUATING');

    try {
      const evaluation = await evaluationService.evaluate(submission);
      await submissionService.updateStatus(id, 'COMPLETED');
      res.json(evaluation);
    } catch (evalErr) {
      await submissionService.updateStatus(id, 'FAILED');
      throw evalErr;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    const status = msg.includes('not found') ? 404 : 500;
    res.status(status).json({ message: msg });
  }
});

// GET /api/submissions/:id/evaluation
router.get('/:id/evaluation', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { evaluationService } = await import('../container.js');
    const evaluation = await evaluationService.getBySubmissionId(id);
    res.json(evaluation);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(404).json({ message: msg });
  }
});

export default router;

import { Router, type Request, type Response } from 'express';
import { Problem } from '../models/index.js';

const router = Router();

// GET /api/problems
router.get('/', async (_req: Request, res: Response) => {
  try {
    const problems = await Problem.find().sort({ difficulty: 1 });
    const mapped = problems.map((p) => ({
      id: p.problemId,
      title: p.title,
      difficulty: p.difficulty,
      concepts: p.concepts,
      description: p.description,
      requirements: p.requirements,
      expectedFormat: p.expectedFormat,
    }));
    res.json(mapped);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: msg });
  }
});

// GET /api/problems/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const problem = await Problem.findOne({ problemId: id });
    if (!problem) {
      res.status(404).json({ message: `Problem "${id}" not found.` });
      return;
    }
    res.json({
      id: problem.problemId,
      title: problem.title,
      difficulty: problem.difficulty,
      concepts: problem.concepts,
      description: problem.description,
      requirements: problem.requirements,
      expectedFormat: problem.expectedFormat,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: msg });
  }
});

// GET /api/problems/:problemId/attempts
router.get('/:problemId/attempts', async (req: Request, res: Response) => {
  try {
    const problemId = req.params.problemId as string;
    const { submissionService } = await import('../container.js');
    const attempts = await submissionService.getAttempts(problemId);
    res.json(attempts);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: msg });
  }
});

export default router;

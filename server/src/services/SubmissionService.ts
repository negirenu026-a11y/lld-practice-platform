import { Submission, Problem } from '../models/index.js';
import type { ISubmission } from '../models/index.js';

export interface CreateSubmissionDTO {
  problemId: string;
  classes: ISubmission['classes'];
  interfaces: ISubmission['interfaces'];
  relationships: string[];
  explanation: string;
}

export class SubmissionService {
  async create(data: CreateSubmissionDTO): Promise<ISubmission> {
    // Validate problem exists
    const problem = await Problem.findOne({ problemId: data.problemId });
    if (!problem) {
      throw new Error(`Problem "${data.problemId}" not found.`);
    }

    // Auto-increment attempt number for this problem
    const lastAttempt = await Submission.findOne({ problemId: data.problemId })
      .sort({ attemptNumber: -1 })
      .select('attemptNumber');

    const attemptNumber = (lastAttempt?.attemptNumber ?? 0) + 1;

    const submission = await Submission.create({
      problemId: data.problemId,
      attemptNumber,
      status: 'SUBMITTED',
      classes: data.classes,
      interfaces: data.interfaces,
      relationships: data.relationships,
      explanation: data.explanation,
    });

    return submission;
  }

  async getById(id: string): Promise<ISubmission> {
    const sub = await Submission.findById(id);
    if (!sub) throw new Error(`Submission "${id}" not found.`);
    return sub;
  }

  async getAttempts(problemId: string): Promise<ISubmission[]> {
    return Submission.find({ problemId })
      .sort({ attemptNumber: -1 })
      .exec();
  }

  async updateStatus(id: string, status: ISubmission['status']): Promise<ISubmission> {
    const sub = await Submission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!sub) throw new Error(`Submission "${id}" not found.`);
    return sub;
  }
}

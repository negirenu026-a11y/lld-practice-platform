import type { Difficulty, SubmissionStatus } from './types';

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'Easy':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'Medium':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'Hard':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

export function getStatusColor(status: SubmissionStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    case 'SUBMITTED':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'EVALUATING':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    case 'COMPLETED':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'FAILED':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

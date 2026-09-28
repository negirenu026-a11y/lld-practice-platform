import { useNavigate } from 'react-router-dom';
import { Eye, RotateCcw } from 'lucide-react';
import type { Submission } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils';

interface AttemptCardProps {
  attempt: Submission;
  problemTitle: string;
  score?: number | null;
}

export function AttemptCard({ attempt, problemTitle, score }: AttemptCardProps) {
  const navigate = useNavigate();

  const canViewFeedback = attempt.status === 'COMPLETED';
  const canRetry = attempt.status === 'COMPLETED' || attempt.status === 'FAILED';

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-mono text-slate-500">
            #{attempt.attemptNumber}
          </span>
          <h4 className="text-sm font-semibold text-slate-200 truncate">
            {problemTitle}
          </h4>
          <StatusBadge status={attempt.status} />
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{formatDate(attempt.createdAt)}</span>
          {score != null && (
            <span className="text-indigo-400 font-medium">Score: {score}%</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {canViewFeedback && (
          <button
            onClick={() => navigate(`/feedback/${attempt.id}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                       bg-indigo-500/10 text-indigo-400 border border-indigo-500/20
                       hover:bg-indigo-500/20 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            View Feedback
          </button>
        )}
        {canRetry && (
          <button
            onClick={() => navigate(`/practice/${attempt.problemId}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                       bg-slate-600/30 text-slate-300 border border-slate-600/40
                       hover:bg-slate-600/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

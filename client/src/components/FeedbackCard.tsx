import type { Improvement } from '../types';
import { AlertTriangle, Lightbulb, HelpCircle } from 'lucide-react';

interface FeedbackCardProps {
  improvement: Improvement;
}

export function FeedbackCard({ improvement }: FeedbackCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-slate-200">
            {improvement.observation}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 pl-1">
        <HelpCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-sm text-slate-400">{improvement.whyItMatters}</p>
      </div>

      <div className="flex items-start gap-2 pl-1">
        <Lightbulb className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-sm text-indigo-300">{improvement.suggestion}</p>
      </div>
    </div>
  );
}

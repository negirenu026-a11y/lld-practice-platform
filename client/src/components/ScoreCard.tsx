import type { CriterionScore } from '../types';

interface ScoreCardProps {
  overallScore: number;
  criteria: CriterionScore[];
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

function getScoreRingColor(score: number): string {
  if (score >= 75) return 'stroke-emerald-500';
  if (score >= 50) return 'stroke-amber-500';
  return 'stroke-red-500';
}

function getBarColor(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

export function ScoreCard({ overallScore, criteria }: ScoreCardProps) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-6 fade-in">
      {/* Overall Score with ring */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 score-reveal">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60" cy="60" r="54"
              fill="none" stroke="#1e293b" strokeWidth="8"
            />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              className={getScoreRingColor(overallScore)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>
        <span className="text-sm text-slate-400 mt-2">Overall Score</span>
      </div>

      {/* Criteria Bars */}
      <div className="space-y-4">
        {criteria.map((c) => (
          <div key={c.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-300">{c.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${getScoreColor(c.score)}`}>
                  {c.score}%
                </span>
                <span className="text-xs text-slate-600">
                  ×{c.weight}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bar-fill ${getBarColor(c.score)}`}
                style={{ width: `${c.score}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{c.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

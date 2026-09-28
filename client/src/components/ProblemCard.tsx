import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import type { Problem } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

interface ProblemCardProps {
  problem: Problem;
}

const gradients: Record<string, string> = {
  'parking-lot': 'from-blue-500/10 to-cyan-500/5',
  'vending-machine': 'from-emerald-500/10 to-teal-500/5',
  'elevator-system': 'from-purple-500/10 to-pink-500/5',
};

const iconColors: Record<string, string> = {
  'parking-lot': 'text-blue-400 bg-blue-500/10 border-blue-500/15',
  'vending-machine': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15',
  'elevator-system': 'text-purple-400 bg-purple-500/10 border-purple-500/15',
};

export function ProblemCard({ problem }: ProblemCardProps) {
  const navigate = useNavigate();
  const gradient = gradients[problem.id] ?? 'from-slate-500/10 to-slate-500/5';
  const iconColor = iconColors[problem.id] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/15';

  return (
    <div
      onClick={() => navigate(`/problems/${problem.id}`)}
      className={`group relative bg-gradient-to-br ${gradient} bg-slate-800/40 backdrop-blur-sm
                 border border-slate-700/40 rounded-xl p-6 cursor-pointer
                 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5
                 transition-all duration-300 fade-in`}
    >
      {/* Subtle top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${iconColor}`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-slate-100 group-hover:text-white transition-colors">
            {problem.title}
          </h3>
        </div>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
        {problem.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {problem.concepts.map((concept) => (
          <span
            key={concept}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md
                       bg-indigo-500/8 text-indigo-300/80 border border-indigo-500/15"
          >
            <Sparkles className="w-2.5 h-2.5" />
            {concept}
          </span>
        ))}
      </div>

      <div className="flex items-center text-sm text-indigo-400 group-hover:text-indigo-300 font-medium transition-colors">
        <span>Start Solving</span>
        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

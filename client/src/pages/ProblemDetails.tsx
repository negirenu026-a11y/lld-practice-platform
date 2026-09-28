import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  CheckSquare,
  FileText,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { DifficultyBadge } from '../components/DifficultyBadge';

export function ProblemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problem = useAsync(() => api.getProblem(id!), [id]);

  if (problem.status === 'loading') {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (problem.status === 'error') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400 text-sm">{problem.error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (problem.status !== 'success') return null;

  const p = problem.data;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">{p.title}</h1>
        <DifficultyBadge difficulty={p.difficulty} />
      </div>

      {/* Description */}
      <p className="text-slate-400 mb-8 leading-relaxed">{p.description}</p>

      {/* Concepts */}
      <div className="flex flex-wrap gap-2 mb-8">
        {p.concepts.map((c) => (
          <span
            key={c}
            className="px-3 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
          >
            {c}
          </span>
        ))}
      </div>

      {/* Requirements */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Requirements
          </h2>
        </div>
        <ul className="space-y-2">
          {p.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Expected Submission Format */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Expected Submission Format
          </h2>
        </div>
        <ul className="space-y-2">
          {p.expectedFormat.map((fmt, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
              <Layers className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
              {fmt}
            </li>
          ))}
        </ul>
      </div>

      {/* Start Practice */}
      <button
        onClick={() => navigate(`/practice/${p.id}`)}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                   bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer"
      >
        <Play className="w-4 h-4" />
        Start Practice
      </button>
    </div>
  );
}

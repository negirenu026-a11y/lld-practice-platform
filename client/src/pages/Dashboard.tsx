import { BarChart3, CheckCircle2, TrendingUp, Info, Boxes } from 'lucide-react';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { ProblemCard } from '../components/ProblemCard';

export function Dashboard() {
  const problems = useAsync(() => api.getProblems(), []);
  const progress = useAsync(() => api.getLearnerProgress(), []);

  return (
    <div className="max-w-5xl mx-auto fade-in">
      {/* Hero Section */}
      <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600/20 via-slate-800/50 to-purple-600/10 border border-indigo-500/10 p-8 sm:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/20">
              <Boxes className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              LLD <span className="text-indigo-400">Practice</span>
            </h1>
          </div>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Sharpen your Low-Level Design skills by solving real-world system design
            problems. Define classes, interfaces, map relationships, and get instant
            structured feedback on your designs.
          </p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/10">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400">Total Attempts</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {progress.status === 'success' ? progress.data.totalAttempts : '—'}
          </p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400">Completed</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {progress.status === 'success' ? progress.data.completedAttempts : '—'}
          </p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 hover:border-indigo-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/10">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-sm text-slate-400">Latest Score</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {progress.status === 'success' && progress.data.latestScore != null
              ? `${progress.data.latestScore}%`
              : '—'}
          </p>
        </div>
      </div>

      {/* Demo notice */}
      <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
        <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="text-xs text-indigo-300/70">
          Demo data — progress stored locally in your browser. Start solving to see your stats!
        </span>
      </div>

      {/* Problem Grid */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-200">Practice Problems</h2>
        <span className="text-xs text-slate-500">
          {problems.status === 'success' ? `${problems.data.length} problems` : ''}
        </span>
      </div>

      {problems.status === 'loading' && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin pulse-glow" />
        </div>
      )}

      {problems.status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400 text-sm">{problems.error}</p>
        </div>
      )}

      {problems.status === 'success' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.data.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}

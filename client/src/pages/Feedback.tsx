import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { ScoreCard } from '../components/ScoreCard';
import { FeedbackCard } from '../components/FeedbackCard';

export function Feedback() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const submission = useAsync(
    () => api.getSubmission(submissionId!),
    [submissionId]
  );
  const evaluation = useAsync(
    () => api.getEvaluation(submissionId!),
    [submissionId]
  );

  // Loading state (evaluating)
  if (
    submission.status === 'loading' ||
    evaluation.status === 'loading'
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Evaluating your design…</p>
      </div>
    );
  }

  // Error
  if (submission.status === 'error' || evaluation.status === 'error') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400 text-sm">
            {submission.error || evaluation.error}
          </p>
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

  if (submission.status !== 'success' || evaluation.status !== 'success')
    return null;

  const sub = submission.data;
  const eval_ = evaluation.data;

  const deterministicResults = eval_.evaluatorResults.filter(
    (r) => r.evaluator === 'deterministic'
  );
  const aiResults = eval_.evaluatorResults.filter(
    (r) => r.evaluator === 'ai'
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(`/problems/${sub.problemId}`)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Problem
      </button>

      <h1 className="text-2xl font-bold text-slate-100 mb-1">
        Feedback — Attempt #{sub.attemptNumber}
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        Review your evaluation results below.
      </p>

      {/* Score */}
      <ScoreCard overallScore={eval_.overallScore} criteria={eval_.criteria} />

      {/* Strengths */}
      {eval_.strengths.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Strengths
          </h2>
          <div className="space-y-2">
            {eval_.strengths.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-4 py-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm text-emerald-300">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {eval_.improvements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Areas for Improvement
          </h2>
          <div className="space-y-3">
            {eval_.improvements.map((imp, i) => (
              <FeedbackCard key={i} improvement={imp} />
            ))}
          </div>
        </div>
      )}

      {/* Deterministic Checks */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Deterministic Checks
        </h2>
        <div className="space-y-2">
          {deterministicResults.map((r, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 rounded-lg px-4 py-3 border ${
                r.passed
                  ? 'bg-emerald-500/5 border-emerald-500/15'
                  : 'bg-red-500/5 border-red-500/15'
              }`}
            >
              {r.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              )}
              <span
                className={`text-sm ${r.passed ? 'text-emerald-300' : 'text-red-300'}`}
              >
                {r.details}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Feedback Section */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          AI Feedback
        </h2>
        {aiResults.length > 0 && aiResults[0].error ? (
          <div className="flex items-start gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3">
            <ShieldAlert className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <span className="text-xs text-slate-500">
              AI feedback unavailable — {aiResults[0].error}
            </span>
          </div>
        ) : aiResults.length > 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3">
            <p className="text-sm text-slate-300">{aiResults[0].details}</p>
          </div>
        ) : (
          <div className="flex items-start gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3">
            <ShieldAlert className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <span className="text-xs text-slate-500">
              AI feedback unavailable.
            </span>
          </div>
        )}
      </div>

      {/* Guidance Banner */}
      <div className="mt-8 flex items-start gap-2 bg-indigo-500/5 border border-indigo-500/15 rounded-xl px-5 py-4">
        <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-sm text-indigo-300">
          Feedback is guidance. Multiple LLD solutions can be valid. Use this
          evaluation to identify patterns for improvement, not as a definitive
          score.
        </p>
      </div>

      {/* Try Again */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate(`/practice/${sub.problemId}`)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium
                     bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

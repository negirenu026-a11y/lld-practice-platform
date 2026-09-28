import { useMemo } from 'react';
import { ClipboardList, Inbox } from 'lucide-react';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { AttemptCard } from '../components/AttemptCard';
import { SEED_PROBLEMS } from '../services/seedData';

export function History() {
  const attempts = useAsync(() => api.getAllAttempts(), []);
  const evaluations = useAsync(
    () =>
      attempts.status === 'success'
        ? Promise.all(
            attempts.data
              .filter((a) => a.status === 'COMPLETED')
              .map((a) =>
                api
                  .getEvaluation(a.id)
                  .then((e) => ({ submissionId: a.id, score: e.overallScore }))
                  .catch(() => ({ submissionId: a.id, score: null }))
              )
          )
        : Promise.resolve([]),
    [attempts.status, attempts.status === 'success' ? attempts.data.length : 0]
  );

  const scoreMap = useMemo(() => {
    if (evaluations.status !== 'success') return new Map<string, number>();
    const map = new Map<string, number>();
    for (const e of evaluations.data) {
      if (e.score != null) map.set(e.submissionId, e.score);
    }
    return map;
  }, [evaluations.status, evaluations.data]);

  const problemTitleMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of SEED_PROBLEMS) {
      map.set(p.id, p.title);
    }
    return map;
  }, []);

  if (attempts.status === 'loading') {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (attempts.status === 'error') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400 text-sm">{attempts.error}</p>
        </div>
      </div>
    );
  }

  if (attempts.status !== 'success') return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList className="w-6 h-6 text-indigo-400" />
        <h1 className="text-2xl font-bold text-slate-100">Attempt History</h1>
      </div>

      {attempts.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-400 mb-1">
            No attempts yet
          </h3>
          <p className="text-sm text-slate-600">
            Start practicing a problem to see your attempts here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.data.map((attempt) => (
            <AttemptCard
              key={attempt.id}
              attempt={attempt}
              problemTitle={
                problemTitleMap.get(attempt.problemId) ?? attempt.problemId
              }
              score={scoreMap.get(attempt.id) ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

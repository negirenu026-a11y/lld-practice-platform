import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { SolutionEditor } from '../components/SolutionEditor';
import type { ClassDefinition, InterfaceDefinition } from '../types';

export function Practice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problem = useAsync(() => api.getProblem(id!), [id]);

  const [classes, setClasses] = useState<ClassDefinition[]>([
    { name: '', responsibilities: '', methods: '' },
  ]);
  const [interfaces, setInterfaces] = useState<InterfaceDefinition[]>([]);
  const [relationships, setRelationships] = useState<string[]>(['']);
  const [explanation, setExplanation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const errs: Record<string, string> = {};

    const validClasses = classes.filter((c) => c.name.trim());
    if (validClasses.length === 0) {
      errs.classes = 'Add at least one class with a name.';
    }

    const validRels = relationships.filter((r) => r.trim());
    if (validRels.length === 0) {
      errs.relationships = 'Add at least one relationship.';
    }

    if (!explanation.trim()) {
      errs.explanation = 'Provide a design explanation.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const submission = await api.createSubmission({
        problemId: id!,
        classes: classes.filter((c) => c.name.trim()),
        interfaces: interfaces.filter((i) => i.name.trim()),
        relationships: relationships.filter((r) => r.trim()),
        explanation: explanation.trim(),
      });

      // Trigger evaluation and navigate to feedback
      const evaluation = await api.evaluateSubmission(submission.id);
      void evaluation; // used implicitly — feedback page loads it
      navigate(`/feedback/${submission.id}`);
    } catch (err) {
      setErrors({
        submit:
          err instanceof Error ? err.message : 'Submission failed. Try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

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
        </div>
      </div>
    );
  }

  if (problem.status !== 'success') return null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(`/problems/${id}`)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Problem
      </button>

      <h1 className="text-2xl font-bold text-slate-100 mb-2">
        {problem.data.title}
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        Design your solution below. Fill in classes, interfaces, relationships,
        and explain your reasoning.
      </p>

      <SolutionEditor
        classes={classes}
        interfaces={interfaces}
        relationships={relationships}
        explanation={explanation}
        errors={errors}
        onClassesChange={setClasses}
        onInterfacesChange={setInterfaces}
        onRelationshipsChange={setRelationships}
        onExplanationChange={setExplanation}
      />

      {/* Submit Error */}
      {errors.submit && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-sm text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-8">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium
                     bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50
                     disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit
            </>
          )}
        </button>
      </div>
    </div>
  );
}

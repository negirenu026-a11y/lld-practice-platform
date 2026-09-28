import { Plus, Trash2 } from 'lucide-react';
import type { ClassDefinition, InterfaceDefinition } from '../types';

interface SolutionEditorProps {
  classes: ClassDefinition[];
  interfaces: InterfaceDefinition[];
  relationships: string[];
  explanation: string;
  errors: Record<string, string>;
  onClassesChange: (classes: ClassDefinition[]) => void;
  onInterfacesChange: (interfaces: InterfaceDefinition[]) => void;
  onRelationshipsChange: (relationships: string[]) => void;
  onExplanationChange: (explanation: string) => void;
}

export function SolutionEditor({
  classes,
  interfaces,
  relationships,
  explanation,
  errors,
  onClassesChange,
  onInterfacesChange,
  onRelationshipsChange,
  onExplanationChange,
}: SolutionEditorProps) {
  // ── Class helpers ──
  const addCls = () =>
    onClassesChange([...classes, { name: '', responsibilities: '', methods: '' }]);
  const removeCls = (i: number) =>
    onClassesChange(classes.filter((_, idx) => idx !== i));
  const updateCls = (i: number, field: keyof ClassDefinition, value: string) =>
    onClassesChange(classes.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  // ── Interface helpers ──
  const addIface = () =>
    onInterfacesChange([...interfaces, { name: '', methods: '' }]);
  const removeIface = (i: number) =>
    onInterfacesChange(interfaces.filter((_, idx) => idx !== i));
  const updateIface = (i: number, field: keyof InterfaceDefinition, value: string) =>
    onInterfacesChange(
      interfaces.map((iface, idx) => (idx === i ? { ...iface, [field]: value } : iface))
    );

  // ── Relationship helpers ──
  const addRel = () => onRelationshipsChange([...relationships, '']);
  const removeRel = (i: number) =>
    onRelationshipsChange(relationships.filter((_, idx) => idx !== i));
  const updateRel = (i: number, value: string) =>
    onRelationshipsChange(relationships.map((r, idx) => (idx === i ? value : r)));

  const inputClass =
    'w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-colors';

  return (
    <div className="space-y-8">
      {/* ── CLASSES ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Classes
          </h3>
          <button
            onClick={addCls}
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Class
          </button>
        </div>
        {errors.classes && (
          <p className="text-xs text-red-400 mb-2">{errors.classes}</p>
        )}
        {classes.length === 0 && (
          <p className="text-sm text-slate-600 italic">
            No classes yet. Add at least one class to describe your design.
          </p>
        )}
        <div className="space-y-4">
          {classes.map((cls, i) => (
            <div
              key={i}
              className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Class #{i + 1}
                </span>
                <button
                  onClick={() => removeCls(i)}
                  className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                className={inputClass}
                placeholder="Class name (e.g. ParkingLot)"
                value={cls.name}
                onChange={(e) => updateCls(i, 'name', e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Responsibilities (e.g. manages floors, tracks capacity)"
                value={cls.responsibilities}
                onChange={(e) => updateCls(i, 'responsibilities', e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Methods (comma-separated, e.g. parkVehicle, removeVehicle)"
                value={cls.methods}
                onChange={(e) => updateCls(i, 'methods', e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── INTERFACES ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Interfaces
          </h3>
          <button
            onClick={addIface}
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Interface
          </button>
        </div>
        {interfaces.length === 0 && (
          <p className="text-sm text-slate-600 italic">
            No interfaces yet. Interfaces help define extension points.
          </p>
        )}
        <div className="space-y-4">
          {interfaces.map((iface, i) => (
            <div
              key={i}
              className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Interface #{i + 1}
                </span>
                <button
                  onClick={() => removeIface(i)}
                  className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                className={inputClass}
                placeholder="Interface name (e.g. PricingStrategy)"
                value={iface.name}
                onChange={(e) => updateIface(i, 'name', e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Methods (e.g. calculateFee, getRate)"
                value={iface.methods}
                onChange={(e) => updateIface(i, 'methods', e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── RELATIONSHIPS ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Relationships
          </h3>
          <button
            onClick={addRel}
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Relationship
          </button>
        </div>
        {errors.relationships && (
          <p className="text-xs text-red-400 mb-2">{errors.relationships}</p>
        )}
        {relationships.length === 0 && (
          <p className="text-sm text-slate-600 italic">
            No relationships yet. Describe how your classes connect.
          </p>
        )}
        <div className="space-y-2">
          {relationships.map((rel, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`${inputClass} flex-1`}
                placeholder="e.g. ParkingLot has-many Floor (composition)"
                value={rel}
                onChange={(e) => updateRel(i, e.target.value)}
              />
              <button
                onClick={() => removeRel(i)}
                className="text-slate-600 hover:text-red-400 transition-colors shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPLANATION ── */}
      <section>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Design Explanation
        </h3>
        {errors.explanation && (
          <p className="text-xs text-red-400 mb-2">{errors.explanation}</p>
        )}
        <textarea
          className={`${inputClass} min-h-[120px] resize-y`}
          placeholder="Explain your design decisions — why you chose these abstractions, trade-offs, how it handles edge cases..."
          value={explanation}
          onChange={(e) => onExplanationChange(e.target.value)}
        />
      </section>
    </div>
  );
}

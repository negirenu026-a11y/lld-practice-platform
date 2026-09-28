import type { Difficulty } from '../types';
import { getDifficultyColor } from '../utils';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(difficulty)}`}
    >
      {difficulty}
    </span>
  );
}

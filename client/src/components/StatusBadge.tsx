import type { SubmissionStatus } from '../types';
import { getStatusColor } from '../utils';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}
    >
      {status}
    </span>
  );
}

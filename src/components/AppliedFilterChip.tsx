import { XMarkIcon } from '@heroicons/react/24/outline';
import type { FC } from 'react';

interface AppliedFilterChipProps {
  label: string;
  onRemove: () => void;
}

const AppliedFilterChip: FC<AppliedFilterChipProps> = ({ label, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-text-secondary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        aria-label={`Remove filter ${label}`}
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    </span>
  );
};

export default AppliedFilterChip;

import { ChevronDownIcon, FunnelIcon, StarIcon } from '@heroicons/react/24/outline';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';

interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: 'calendar' | 'star' | 'funnel';
  active?: boolean;
  count?: number;
}

const iconMap = {
  calendar: (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
      />
    </svg>
  ),
  star: <StarIcon className="h-4 w-4" />,
  funnel: <FunnelIcon className="h-4 w-4" />
};

const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ label, icon, active, count, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary transition',
          active ? 'bg-gray-100' : 'bg-white hover:bg-gray-100',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
          className
        )}
        {...rest}
      >
        {icon ? <span className="text-text-secondary">{iconMap[icon]}</span> : null}
        <span>{label}</span>
        {typeof count === 'number' ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-text-secondary">{count}</span>
        ) : null}
        <ChevronDownIcon className="h-4 w-4 text-text-secondary" />
      </button>
    );
  }
);

FilterChip.displayName = 'FilterChip';

export default FilterChip;

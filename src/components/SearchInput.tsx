import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { ChangeEventHandler, FC } from 'react';

interface SearchInputProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  onSubmit: () => void;
}

const SearchInput: FC<SearchInputProps> = ({ value, onChange, onClear, onSubmit }) => {
  return (
    <div className="relative flex w-full max-w-md items-center">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 h-4 w-4 text-text-secondary" />
      <input
        value={value}
        onChange={onChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Search by any order parameter…"
        className="w-full rounded-lg border border-border-subtle bg-white py-2 pl-9 pr-9 text-sm text-text-primary shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
        aria-label="Search orders"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className={clsx(
            'absolute right-2 flex h-6 w-6 items-center justify-center rounded-full text-text-secondary hover:text-text-primary',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
          )}
          aria-label="Clear search"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

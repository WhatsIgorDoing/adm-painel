import type { SortingState } from '@tanstack/react-table';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, Transition, Menu } from '@headlessui/react';
import {
  ChevronRightIcon,
  FunnelIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { parse } from 'date-fns';
import Layout from '../components/Layout';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import FilterChip from '../components/FilterChip';
import AppliedFilterChip from '../components/AppliedFilterChip';
import OrdersTable from '../components/OrdersTable';
import Drawer from '../components/Drawer';
import CreateOrderForm from '../components/CreateOrderForm';
import { ORDERS } from '../data/orders';
import { useDebounce } from '../hooks/useDebounce';
import { applyFilters, defaultFilterState } from '../utils/filtering';
import { exportCSV, exportJSON, exportXLSX } from '../utils/exporters';
import { statusPriority } from '../utils/status';
import type { FilterState, Order, SavedFilter } from '../types';

const datePresets = [
  { label: 'Today', offset: 0 },
  { label: 'Last 7', offset: 7 },
  { label: 'This month', offset: 30 },
  { label: 'Custom', offset: null }
];

const statuses = ['Booked', 'In Cart', 'Cancelled', 'Closed', 'Dropped', 'Request', 'Test'];
const departments = ['Grøubøgata 1', 'Avdeling 16', 'Ekebergveien 65', 'Ekeberg Logistikk', 'Distribution Hub'];
const deliveryStatuses = [
  'Ready to pickup',
  'Picked up',
  'Returned',
  'Delayed',
  'Cancelled',
  'To transport',
  'On checking',
  '—'
];
const createdByOptions = ['Camilla', 'Sindre', 'Jonas', 'System', 'Helga'];
const productTags = ['Road bike', 'E-bike', 'Accessories', 'Components', 'Subscription', 'Logistics'];

const createId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const OrdersPage = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selection, setSelection] = useState<string[]>([]);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [connectionLost] = useState(false);

  const filtersWithSearch = useMemo<FilterState>(() => ({
    ...filters,
    search: debouncedSearch
  }), [filters, debouncedSearch]);

  const filtered = useMemo(() => applyFilters(ORDERS, filtersWithSearch), [filtersWithSearch]);
  const sorted = useMemo(() => sortOrders(filtered, sorting), [filtered, sorting]);

  const pageCount = Math.ceil(sorted.length / pageSize) || 1;
  const normalizedPageIndex = Math.min(pageIndex, pageCount - 1);
  const pageData = useMemo<Order[]>(() => {
    const start = normalizedPageIndex * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, normalizedPageIndex, pageSize]);

  const appliedChips = buildAppliedChips(filtersWithSearch);
  const totalResults = sorted.length;
  const resultsLabel = useMemo(() => {
    if (!totalResults) return 'Showing 0 results';
    const start = normalizedPageIndex * pageSize + 1;
    const end = Math.min(totalResults, start + pageSize - 1);
    return `Showing ${start}\u2013${end} of ${totalResults} results`;
  }, [normalizedPageIndex, pageSize, totalResults]);

  const tabCounts = [
    { label: 'ALL', count: 64, active: true },
    { label: 'PICKUPS', count: 30, active: false },
    { label: 'RETURNS', count: 34, active: false }
  ];

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPageIndex(0);
    setSelection([]);
  }, [filtersWithSearch, pageSize]);

  const handleExport = (format: 'csv' | 'xlsx' | 'json') => {
    const rows = selection.length > 0 ? sorted.filter((order) => selection.includes(order.ref)) : sorted;
    if (format === 'csv') exportCSV(rows);
    if (format === 'xlsx') exportXLSX(rows);
    if (format === 'json') exportJSON(rows);
  };

  const handleSaveFilter = () => {
    const name = window.prompt('Save current filters as…');
    if (name) {
      setSavedFilters((prev) => [
        ...prev,
        {
          id: createId(),
          name,
          state: filtersWithSearch
        }
      ]);
    }
  };

  const handleApplySavedFilter = (saved: SavedFilter) => {
    setFilters(saved.state);
    setSearchTerm(saved.state.search);
  };

  const handleRemoveChip = (key: string, value?: string) => {
    setFilters((prev) => removeFilterChip(prev, key, value));
  };

  const handleCreateOrder = () => setCreateOrderOpen(true);

  const handleNewOrder = (payload: any) => {
    console.info('New order payload', payload);
  };

  return (
    <Layout
      header={<Header onPrint={() => window.print()} onExport={handleExport} onCreateOrder={handleCreateOrder} />}
      toolbar={
        <div className="mt-6 space-y-3">
          {connectionLost ? (
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              <span>Connection lost. Retrying…</span>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onClear={() => setSearchTerm('')}
              onSubmit={() => setFilters((prev) => ({ ...prev, search: searchTerm }))}
            />
            <DateRangeFilter value={filters.dateRange} onChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))} />
            <StatusFilter
              selected={filters.statuses}
              onChange={(list) => setFilters((prev) => ({ ...prev, statuses: list }))}
            />
            <DepartmentFilter
              selected={filters.departments}
              onChange={(list) => setFilters((prev) => ({ ...prev, departments: list }))}
            />
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button as={Fragment}>
                <FilterChip label={`Saved filters (${savedFilters.length})`} icon="star" />
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-lg border border-border-subtle bg-white p-2 shadow-lg focus:outline-none">
                  <button
                    type="button"
                    onClick={handleSaveFilter}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
                  >
                    <StarIcon className="h-4 w-4" /> Save current filters
                  </button>
                  <div className="mt-2 space-y-1">
                    {savedFilters.length === 0 ? (
                      <span className="block px-3 py-2 text-xs text-text-secondary">No saved filters yet</span>
                    ) : (
                      savedFilters.map((item) => (
                        <Menu.Item key={item.id}>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={() => handleApplySavedFilter(item)}
                              className={clsx(
                                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-text-primary',
                                active ? 'bg-gray-100' : ''
                              )}
                            >
                              <span>{item.name}</span>
                              <ChevronRightIcon className="h-4 w-4 text-text-secondary" />
                            </button>
                          )}
                        </Menu.Item>
                      ))
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <FilterChip label="More filters" icon="funnel" onClick={() => setMoreFiltersOpen(true)} />
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-text-secondary">
            <span className="font-semibold text-text-primary">{resultsLabel}</span>
            <nav className="flex items-center gap-6 text-sm font-medium uppercase tracking-wide">
              {tabCounts.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  className={clsx(
                    'flex items-center gap-2 text-text-secondary',
                    tab.active ? 'text-text-primary font-semibold' : 'font-medium'
                  )}
                  aria-pressed={tab.active}
                >
                  {tab.label}
                  <span className="text-gray-500">{tab.count}</span>
                </button>
              ))}
            </nav>
          </div>
          {appliedChips.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {appliedChips.map((chip) => (
                <AppliedFilterChip
                  key={chip.key + chip.label}
                  label={chip.label}
                  onRemove={() => handleRemoveChip(chip.key, chip.value)}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  setFilters(defaultFilterState);
                  setSearchTerm('');
                }}
                className="text-xs font-medium text-emerald-600 hover:underline"
              >
                Clear all
              </button>
            </div>
          ) : null}
        </div>
      }
    >
      <div className="flex h-full flex-col gap-4 p-6">
        {selection.length > 0 ? (
          <BulkActions
            count={selection.length}
            onClear={() => setSelection([])}
            onAction={(action) => console.info('Bulk action', action)}
          />
        ) : null}
        {pageData.length === 0 ? (
          <EmptyState onReset={() => {
            setFilters(defaultFilterState);
            setSearchTerm('');
          }} />
        ) : (
          <OrdersTable
            data={pageData}
            total={sorted.length}
            pageIndex={normalizedPageIndex}
            pageSize={pageSize}
            onPageChange={(page) => setPageIndex(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageIndex(0);
            }}
            sorting={sorting as any}
            onSortingChange={setSorting as any}
            selectedRefs={selection}
            onSelectionChange={setSelection}
          />
        )}
      </div>
      <Drawer
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        title="More filters"
        description="Refine orders by additional attributes"
      >
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">Delivery status</h4>
          <div className="flex flex-wrap gap-2">
            {deliveryStatuses.map((status) => {
              const checked = filters.deliveryStatuses.includes(status as any);
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      deliveryStatuses: toggle(prev.deliveryStatuses, status as any)
                    }))
                  }
                  className={clsx(
                    'rounded-full border px-3 py-1 text-xs font-medium',
                    checked
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-border-subtle text-text-secondary hover:bg-gray-100'
                  )}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">Price range (NOK)</h4>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-text-secondary">
              Min
              <input
                type="number"
                value={filters.priceRange?.[0] ?? ''}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [event.target.value ? Number(event.target.value) : null, prev.priceRange?.[1] ?? null]
                  }))
                }
                className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-text-secondary">
              Max
              <input
                type="number"
                value={filters.priceRange?.[1] ?? ''}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange?.[0] ?? null, event.target.value ? Number(event.target.value) : null]
                  }))
                }
                className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </label>
          </div>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">Created by</h4>
          <div className="grid grid-cols-2 gap-2">
            {createdByOptions.map((user) => {
              const checked = filters.createdBy?.includes(user) ?? false;
              return (
                <label key={user} className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        createdBy: toggle(prev.createdBy ?? [], user)
                      }))
                    }
                    className="h-4 w-4 rounded border-border-subtle text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  />
                  {user}
                </label>
              );
            })}
          </div>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">Product tag</h4>
          <div className="grid grid-cols-2 gap-2">
            {productTags.map((tag) => {
              const checked = filters.productTags?.includes(tag) ?? false;
              return (
                <label key={tag} className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        productTags: toggle(prev.productTags ?? [], tag)
                      }))
                    }
                    className="h-4 w-4 rounded border-border-subtle text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  />
                  {tag}
                </label>
              );
            })}
          </div>
        </section>
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">Distribution</h4>
          <div className="grid grid-cols-1 gap-2">
            {departments.map((department) => {
              const checked = filters.distribution?.includes(department) ?? false;
              return (
                <label key={department} className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        distribution: toggle(prev.distribution ?? [], department)
                      }))
                    }
                    className="h-4 w-4 rounded border-border-subtle text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  />
                  {department}
                </label>
              );
            })}
          </div>
        </section>
      </Drawer>
      <CreateOrderForm
        open={createOrderOpen}
        onClose={() => setCreateOrderOpen(false)}
        onSubmit={handleNewOrder}
      />
    </Layout>
  );
};

const toggle = <T,>(list: T[], value: T) => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

const buildAppliedChips = (state: FilterState) => {
  const chips: { key: string; label: string; value?: string }[] = [];
  if (state.search) chips.push({ key: 'search', label: `Search: ${state.search}` });
  if (state.dateRange) chips.push({ key: 'dateRange', label: `Date: ${state.dateRange.label}` });
  if (state.statuses.length)
    state.statuses.forEach((status) => chips.push({ key: 'statuses', label: `Status: ${status}`, value: status }));
  if (state.departments.length)
    state.departments.forEach((department) =>
      chips.push({ key: 'departments', label: `Department: ${department}`, value: department })
    );
  if (state.deliveryStatuses.length)
    state.deliveryStatuses.forEach((delivery) =>
      chips.push({ key: 'deliveryStatuses', label: `Delivery: ${delivery}`, value: delivery })
    );
  if (state.priceRange?.[0]) chips.push({ key: 'priceMin', label: `Min ${state.priceRange[0]} NOK` });
  if (state.priceRange?.[1]) chips.push({ key: 'priceMax', label: `Max ${state.priceRange[1]} NOK` });
  state.createdBy?.forEach((user) => chips.push({ key: 'createdBy', label: `Created by: ${user}`, value: user }));
  state.productTags?.forEach((tag) => chips.push({ key: 'productTags', label: `Tag: ${tag}`, value: tag }));
  state.distribution?.forEach((dist) => chips.push({ key: 'distribution', label: `Distribution: ${dist}`, value: dist }));
  return chips;
};

const removeFilterChip = (state: FilterState, key: string, value?: string): FilterState => {
  if (key === 'search') return { ...state, search: '' };
  if (key === 'dateRange') return { ...state, dateRange: null };
  if (key === 'statuses' && value)
    return { ...state, statuses: state.statuses.filter((status) => status !== value) };
  if (key === 'departments' && value)
    return { ...state, departments: state.departments.filter((department) => department !== value) };
  if (key === 'deliveryStatuses' && value)
    return { ...state, deliveryStatuses: state.deliveryStatuses.filter((delivery) => delivery !== value) };
  if (key === 'priceMin') return { ...state, priceRange: [null, state.priceRange?.[1] ?? null] };
  if (key === 'priceMax') return { ...state, priceRange: [state.priceRange?.[0] ?? null, null] };
  if (key === 'createdBy' && value)
    return { ...state, createdBy: (state.createdBy ?? []).filter((user) => user !== value) };
  if (key === 'productTags' && value)
    return { ...state, productTags: (state.productTags ?? []).filter((tag) => tag !== value) };
  if (key === 'distribution' && value)
    return { ...state, distribution: (state.distribution ?? []).filter((dist) => dist !== value) };
  return state;
};

interface DateRangeFilterProps {
  value: FilterState['dateRange'];
  onChange: (value: FilterState['dateRange']) => void;
}

const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const [customFrom, setCustomFrom] = useState<string>('');
  const [customTo, setCustomTo] = useState<string>('');

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            as={Fragment}
          >
            <FilterChip label={value?.label ?? 'Date range'} icon="calendar" active={open} />
          </Popover.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="absolute left-0 z-20 mt-2 w-80 rounded-xl border border-border-subtle bg-white p-4 shadow-lg">
              <h4 className="mb-2 text-sm font-semibold text-text-primary">Select date range</h4>
              <div className="flex flex-wrap gap-2">
                {datePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      if (preset.offset === null) {
                        onChange({ label: 'Custom', from: customFrom ? new Date(customFrom) : null, to: customTo ? new Date(customTo) : null });
                      } else {
                        const to = new Date();
                        const from = new Date();
                        from.setDate(from.getDate() - preset.offset);
                        onChange({ label: preset.label, from, to });
                      }
                      close();
                    }}
                    className={clsx(
                      'rounded-full border px-3 py-1 text-xs font-medium',
                      value?.label === preset.label
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                        : 'border-border-subtle text-text-secondary hover:bg-gray-100'
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs text-text-secondary">
                  From
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(event) => setCustomFrom(event.target.value)}
                    className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-text-secondary">
                  To
                  <input
                    type="date"
                    value={customTo}
                    onChange={(event) => setCustomTo(event.target.value)}
                    className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-border-subtle px-3 py-1.5 text-sm text-text-secondary hover:bg-gray-100"
                  onClick={() => onChange(null)}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-600"
                  onClick={() => {
                    onChange({
                      label: 'Custom',
                      from: customFrom ? new Date(customFrom) : null,
                      to: customTo ? new Date(customTo) : null
                    });
                    close();
                  }}
                >
                  Apply
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

const StatusFilter = ({ selected, onChange }: { selected: string[]; onChange: (value: string[]) => void }) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button as={Fragment}>
            <FilterChip label="Status" active={open} />
          </Popover.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="absolute left-0 z-20 mt-2 w-56 rounded-xl border border-border-subtle bg-white p-4 shadow-lg">
              <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
                {statuses.map((status) => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(status)}
                      onChange={() => onChange(toggle(selected, status))}
                      className="h-4 w-4 rounded border-border-subtle text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

const DepartmentFilter = ({
  selected,
  onChange
}: {
  selected: string[];
  onChange: (value: string[]) => void;
}) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button as={Fragment}>
            <FilterChip label="Department" active={open} />
          </Popover.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="absolute left-0 z-20 mt-2 w-64 rounded-xl border border-border-subtle bg-white p-4 shadow-lg">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Groups</p>
              <div className="space-y-3 text-sm text-text-secondary">
                {departments.map((department) => (
                  <label key={department} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(department)}
                      onChange={() => onChange(toggle(selected, department))}
                      className="h-4 w-4 rounded border-border-subtle text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    />
                    {department}
                  </label>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

const BulkActions = ({ count, onAction, onClear }: { count: number; onAction: (action: string) => void; onClear: () => void }) => {
  const actions = ['Change status', 'Change delivery status', 'Assign department', 'Export selected', 'Delete'];
  return (
    <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      <span className="font-medium">{count} selected</span>
      <div className="flex items-center gap-3">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => onAction(action)}
            className="rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            {action}
          </button>
        ))}
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700 hover:bg-white"
        >
          Clear
        </button>
      </div>
    </div>
  );
};


const parseOrderDate = (value: string) => {
  if (value === '—') return 0;
  const parsed = parse(value, 'dd MMM yyyy HH:mm', new Date());
  return parsed.getTime();
};

const numericPrice = (price: string) => Number(price.replace(/[^0-9.,-]/g, '').replace(',', ''));

const sortOrders = (orders: Order[], sorting: SortingState) => {
  if (!sorting.length) return orders;
  const sorted = [...orders];
  sorted.sort((a, b) => {
    for (const sort of sorting) {
      const dir = sort.desc ? -1 : 1;
      let compare = 0;
      switch (sort.id) {
        case 'ref':
          compare = a.ref.localeCompare(b.ref);
          break;
        case 'created':
          compare = parseOrderDate(a.created) - parseOrderDate(b.created);
          break;
        case 'customer':
          compare = a.customer.localeCompare(b.customer);
          break;
        case 'products':
          compare = a.products.localeCompare(b.products);
          break;
        case 'start':
          compare = parseOrderDate(a.start) - parseOrderDate(b.start);
          break;
        case 'end':
          compare = parseOrderDate(a.end) - parseOrderDate(b.end);
          break;
        case 'distribution':
          compare = a.distribution.localeCompare(b.distribution);
          break;
        case 'status':
          compare = statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status);
          break;
        case 'delivery':
          compare = a.delivery.localeCompare(b.delivery);
          break;
        case 'price':
          compare = numericPrice(a.price) - numericPrice(b.price);
          break;
        default:
          compare = 0;
      }
      if (compare !== 0) {
        return compare * dir;
      }
    }
    return 0;
  });
  return sorted;
};

const EmptyState = ({ onReset }: { onReset: () => void }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-white p-12 text-center">
      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        <FunnelIcon className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">No orders match your filters</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        Try adjusting your filters or clear them to see all available orders.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        Clear filters
      </button>
    </div>
  );
};

export default OrdersPage;

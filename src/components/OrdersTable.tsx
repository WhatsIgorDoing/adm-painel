import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import StatusPill from './StatusPill';
import type { Order } from '../types';

interface OrdersTableProps {
  data: Order[];
  total: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sorting: SortingState;
  onSortingChange: (state: SortingState) => void;
  selectedRefs: string[];
  onSelectionChange: (refs: string[]) => void;
}

const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        aria-label="Select all orders"
        className="h-4 w-4 rounded border-border-subtle text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label={`Select order ${row.original.ref}`}
        className="h-4 w-4 rounded border-border-subtle text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        checked={row.getIsSelected()}
        onChange={(event) => row.toggleSelected(event.target.checked)}
      />
    ),
    size: 48,
    enableSorting: false
  },
  {
    accessorKey: 'ref',
    header: 'Ref.',
    cell: ({ row }) => (
      <Link
        to={`/orders/${row.original.ref}`}
        className="font-mono text-sm font-semibold text-emerald-700 hover:underline"
      >
        {row.original.ref}
      </Link>
    ),
    size: 120
  },
  {
    accessorKey: 'created',
    header: 'Created',
    cell: ({ getValue }) => <span className="text-sm text-text-secondary">{getValue<string>()}</span>,
    size: 180
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ getValue }) => <span className="text-sm font-medium">{getValue<string>()}</span>,
    size: 200
  },
  {
    accessorKey: 'products',
    header: 'Products',
    cell: ({ row }) => {
      const tooltip = row.original.notes?.replace('tooltip: ', '');
      const isRecurring = row.original.ref === 'QH29';
      const label = isRecurring ? row.original.products.replace(' 🔁', '') : row.original.products;
      return (
        <span className="inline-flex items-center gap-2 text-sm text-text-primary">
          <span>{label}</span>
          {isRecurring && tooltip ? (
            <span
              role="img"
              aria-label={tooltip}
              title={tooltip}
              className="cursor-help text-base leading-none"
            >
              🔁
            </span>
          ) : null}
        </span>
      );
    },
    size: 240
  },
  {
    accessorKey: 'start',
    header: 'Start time',
    cell: ({ getValue }) => <span className="text-sm text-text-secondary">{getValue<string>()}</span>,
    size: 180
  },
  {
    accessorKey: 'end',
    header: 'End time',
    cell: ({ getValue }) => <span className="text-sm text-text-secondary">{getValue<string>()}</span>,
    size: 180
  },
  {
    accessorKey: 'distribution',
    header: 'Distribution',
    cell: ({ getValue }) => <span className="text-sm text-text-secondary">{getValue<string>()}</span>,
    size: 220
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusPill type="status" value={getValue<any>()} />,
    size: 140
  },
  {
    accessorKey: 'delivery',
    header: 'Delivery status',
    cell: ({ getValue }) => <StatusPill type="delivery" value={getValue<any>()} />,
    size: 160
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ getValue }) => (
      <span className="block w-full text-right font-mono text-sm font-semibold text-text-primary">
        {getValue<string>()}
      </span>
    ),
    size: 140
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <RowActions refId={row.original.ref} status={row.original.status} />,
    size: 48,
    enableSorting: false
  }
];

const RowActions = ({ refId, status }: { refId: string; status: Order['status'] }) => {
  const isLocked = ['Closed', 'Dropped', 'Test'].includes(status);
  const actions = [
    { label: 'View', value: 'view' },
    { label: 'Edit', value: 'edit', disabled: isLocked },
    { label: 'Duplicate', value: 'duplicate' },
    { label: 'Cancel', value: 'cancel', disabled: status === 'Cancelled' || isLocked },
    { label: 'Close', value: 'close', disabled: isLocked || status === 'Closed' }
  ];
  return (
    <Menu as="div" className="relative flex justify-end">
      <Menu.Button
        className="inline-flex items-center rounded-full px-2 py-1 text-base text-text-secondary opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 hover:bg-gray-100 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        aria-label={`Actions for order ${refId}`}
      >
        ⋯
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-1 w-40 origin-top-right rounded-lg border border-border-subtle bg-white shadow-lg focus:outline-none">
          {actions.map((action) => (
            <Menu.Item key={action.value} disabled={action.disabled}>
              {({ active, disabled }) => (
                <button
                  type="button"
                  disabled={disabled}
                  className={clsx(
                    'flex w-full items-center px-4 py-2 text-left text-sm',
                    active ? 'bg-gray-100' : '',
                    disabled ? 'cursor-not-allowed text-gray-300' : 'text-text-primary'
                  )}
                >
                  {action.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const OrdersTable = ({
  data,
  total,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortingChange,
  selectedRefs,
  onSelectionChange
}: OrdersTableProps) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection: selectedRefs.reduce<Record<string, boolean>>((acc, ref) => {
        const rowIndex = data.findIndex((row) => row.ref === ref);
        if (rowIndex >= 0) acc[rowIndex] = true;
        return acc;
      }, {})
    },
    enableMultiSort: true,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(table.getState().rowSelection) : updater;
      const refs = Object.keys(newSelection)
        .filter((key) => newSelection[Number(key)])
        .map((key) => data[Number(key)]?.ref)
        .filter(Boolean) as string[];
      onSelectionChange(refs);
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 56,
    overscan: 8
  });

  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border-subtle bg-white">
      <div className="relative flex-1 overflow-hidden">
        <div ref={containerRef} className="scrollbar-thin h-full overflow-auto bg-white">
          <table role="table" className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-white shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortState = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        className={clsx(
                          'bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary',
                          header.column.id === 'select' ? 'w-12' : ''
                        )}
                      >
                        {canSort ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className="group inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                            aria-sort={sortState ? (sortState === 'asc' ? 'ascending' : 'descending') : undefined}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span className="inline-flex h-3 w-3 items-center justify-center">
                              {sortState ? (
                                <ChevronDownIcon
                                  className={clsx(
                                    'h-3 w-3 text-gray-400 transition-opacity duration-150',
                                    sortState === 'asc' ? 'rotate-180' : '',
                                    'opacity-100'
                                  )}
                                  aria-hidden
                                />
                              ) : (
                                <ChevronUpDownIcon
                                  className="h-3 w-3 text-gray-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                                  aria-hidden
                                />
                              )}
                            </span>
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const row = rows[virtualRow.index];
                      if (!row) return null;
                      const isSelected = selectedRefs.includes(row.original.ref);
                      const zebra = virtualRow.index % 2 === 1 ? '#FAFAFA' : '#FFFFFF';
                      const isDelayed = row.original.delivery === 'Delayed';
                      const backgroundColor = isDelayed ? '#FFF7ED' : zebra;
                      return (
                        <div
                          key={row.id}
                          data-index={virtualRow.index}
                          ref={rowVirtualizer.measureElement}
                          className="group flex min-h-[52px]"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualRow.start}px)`,
                            backgroundColor,
                            boxShadow: isSelected ? 'inset 0 0 0 1px #10B981' : undefined
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <div
                              key={cell.id}
                              className={clsx(
                                'flex items-center px-4 text-sm text-text-primary',
                                cell.column.id === 'select'
                                  ? 'w-12 justify-center'
                                  : cell.column.id === 'price'
                                  ? 'justify-end'
                                  : 'justify-start'
                              )}
                              role="cell"
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <footer className="border-t border-border-subtle bg-white px-6 py-3">
        <div className="grid grid-cols-3 items-center text-sm text-text-secondary">
          <button
            type="button"
            className="justify-self-start rounded-lg border border-border-subtle px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
            onClick={() => onPageChange(Math.max(pageIndex - 1, 0))}
            disabled={pageIndex === 0}
          >
            PREVIOUS
          </button>
          <span className="justify-self-center text-sm font-semibold text-text-primary">
            {pageIndex + 1} of {pageCount}
          </span>
          <button
            type="button"
            className="justify-self-end rounded-lg border border-border-subtle px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
            onClick={() => onPageChange(Math.min(pageIndex + 1, pageCount - 1))}
            disabled={pageIndex + 1 >= pageCount}
          >
            NEXT
          </button>
        </div>
        <div className="mt-2 flex items-center justify-end gap-2 text-xs text-text-secondary">
          <span>Results per page:</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-border-subtle px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </footer>
    </div>
  );
};

export default OrdersTable;

import {
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, type FC } from 'react';
import clsx from 'clsx';

interface HeaderProps {
  onPrint: () => void;
  onExport: (format: 'csv' | 'xlsx' | 'json') => void;
  onCreateOrder: () => void;
  extraActions?: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ onPrint, onExport, onCreateOrder, extraActions }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Orders</h1>
      </div>
      <div className="flex items-center gap-3">
        {extraActions}
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <PrinterIcon className="h-4 w-4" />
          PRINT
        </button>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
            <ArrowDownTrayIcon className="h-4 w-4" />
            EXPORT
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
            <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-lg border border-border-subtle bg-white shadow-lg focus:outline-none">
              {[
                { label: 'Export CSV', value: 'csv' },
                { label: 'Export XLSX', value: 'xlsx' },
                { label: 'Export JSON', value: 'json' }
              ].map((item) => (
                <Menu.Item key={item.value}>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => onExport(item.value as 'csv' | 'xlsx' | 'json')}
                      className={clsx(
                        'flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-text-primary',
                        active ? 'bg-gray-100' : ''
                      )}
                    >
                      <DocumentDuplicateIcon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        <button
          type="button"
          onClick={onCreateOrder}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          + CREATE ORDER
        </button>
      </div>
    </div>
  );
};

export default Header;

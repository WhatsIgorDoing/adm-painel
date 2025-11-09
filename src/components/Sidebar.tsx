import {
  AdjustmentsHorizontalIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
  CubeIcon,
  RectangleGroupIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import type { FC } from 'react';

const navItems = [
  { to: '/dashboard', icon: RectangleGroupIcon, label: 'Dashboard' },
  { to: '/orders', icon: ArchiveBoxIcon, label: 'Orders' },
  { to: '/customers', icon: UsersIcon, label: 'Customers' },
  { to: '/products', icon: CubeIcon, label: 'Products' },
  { to: '/reports', icon: AdjustmentsHorizontalIcon, label: 'Reports' },
  { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' }
];

const Sidebar: FC = () => {
  const { pathname } = useLocation();
  return (
    <aside className="flex w-16 flex-col items-center bg-white py-6 shadow-sm">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-sm font-semibold text-text-primary">
        OR
      </div>
      <nav className="flex flex-1 flex-col items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to === '/orders' ? '/orders' : '#'}
              className={clsx(
                'relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors',
                isActive
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'hover:bg-gray-100 hover:text-text-primary'
              )}
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

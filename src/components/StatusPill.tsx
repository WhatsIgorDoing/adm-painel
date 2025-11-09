import clsx from 'clsx';
import type { FC } from 'react';
import { deliveryTokens, statusTokens } from '../utils/status';
import type { DeliveryStatus, OrderStatus } from '../types';

interface StatusPillProps {
  value: OrderStatus | DeliveryStatus | '—';
  type: 'status' | 'delivery';
}

const StatusPill: FC<StatusPillProps> = ({ value, type }) => {
  const tokens = type === 'status' ? statusTokens[value as OrderStatus] : deliveryTokens[value];
  if (!tokens) return <span>{value}</span>;
  return (
    <span
      className={clsx(
        'inline-flex min-w-[96px] items-center justify-center rounded-full px-3 py-1 text-xs font-medium',
        'border'
      )}
      style={{
        backgroundColor: tokens.bg,
        color: tokens.text,
        borderColor: tokens.border
      }}
    >
      {value}
    </span>
  );
};

export default StatusPill;

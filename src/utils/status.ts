import { DeliveryStatus, OrderStatus } from '../types';

export const statusTokens: Record<
  OrderStatus,
  { bg: string; text: string; border: string }
> = {
  Booked: { bg: '#E0EAFF', text: '#1E40AF', border: '#2563EB' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#DC2626' },
  Closed: { bg: '#E5E7EB', text: '#374151', border: '#6B7280' },
  Dropped: { bg: '#E5E7EB', text: '#4B5563', border: '#4B5563' },
  'In Cart': { bg: '#EDE9FE', text: '#7C3AED', border: '#7C3AED' },
  Request: { bg: '#FEF3C7', text: '#92400E', border: '#92400E' },
  Test: { bg: '#F3F4F6', text: '#4B5563', border: '#9CA3AF' }
};

export const deliveryTokens: Record<
  DeliveryStatus | '—',
  { bg: string; text: string; border: string }
> = {
  'Ready to pickup': { bg: '#D1FAE5', text: '#047857', border: '#059669' },
  'Picked up': { bg: '#D1FAE5', text: '#047857', border: '#059669' },
  Returned: { bg: '#D1FAE5', text: '#047857', border: '#059669' },
  Delayed: { bg: '#FFEDD5', text: '#B45309', border: '#D97706' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#DC2626' },
  'To transport': { bg: '#FEF3C7', text: '#92400E', border: '#B45309' },
  'On checking': { bg: '#FEF3C7', text: '#92400E', border: '#B45309' },
  '—': { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' }
};

export const statusPriority: OrderStatus[] = [
  'Booked',
  'In Cart',
  'Cancelled',
  'Closed',
  'Dropped',
  'Request',
  'Test'
];

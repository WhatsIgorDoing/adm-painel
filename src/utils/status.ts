import { DeliveryStatus, OrderStatus } from '../types';

export const statusTokens: Record<OrderStatus, { bg: string; text: string }> = {
  Booked: { bg: '#E0EAFF', text: '#1E40AF' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  Closed: { bg: '#E5E7EB', text: '#374151' },
  Dropped: { bg: '#E5E7EB', text: '#4B5563' },
  'In Cart': { bg: '#EDE9FE', text: '#5B21B6' },
  Request: { bg: '#FEF3C7', text: '#92400E' },
  Test: { bg: '#F3F4F6', text: '#374151' }
};

export const deliveryTokens: Record<DeliveryStatus | '—', { bg: string; text: string }> = {
  'Ready to pickup': { bg: '#D1FAE5', text: '#065F46' },
  'Picked up': { bg: '#D1FAE5', text: '#065F46' },
  Returned: { bg: '#D1FAE5', text: '#065F46' },
  Delayed: { bg: '#FFEDD5', text: '#92400E' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B' },
  'To transport': { bg: '#FEF3C7', text: '#92400E' },
  'On checking': { bg: '#FEF3C7', text: '#92400E' },
  '—': { bg: '#F3F4F6', text: '#6B7280' }
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

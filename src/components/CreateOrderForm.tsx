import { FormEvent, useState } from 'react';
import Modal from './Modal';
import type { OrderStatus, DeliveryStatus } from '../types';

interface CreateOrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    customer: string;
    products: string;
    startTime: string;
    endTime?: string;
    distribution?: string;
    status: OrderStatus;
    deliveryStatus: DeliveryStatus | '—';
    price?: string;
    notes?: string;
  }) => void;
}

const statuses: OrderStatus[] = ['Booked', 'In Cart', 'Cancelled', 'Closed', 'Dropped', 'Request', 'Test'];
const deliveryStatuses: (DeliveryStatus | '—')[] = [
  'Ready to pickup',
  'Picked up',
  'Returned',
  'Delayed',
  'Cancelled',
  'To transport',
  'On checking',
  '—'
];

const CreateOrderForm = ({ open, onClose, onSubmit }: CreateOrderFormProps) => {
  const [form, setForm] = useState({
    customer: '',
    products: '',
    startTime: '',
    endTime: '',
    distribution: '',
    status: 'Booked' as OrderStatus,
    deliveryStatus: 'Ready to pickup' as DeliveryStatus | '—',
    price: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.customer.trim()) newErrors.customer = 'Customer is required';
    if (!form.products.trim()) newErrors.products = 'Product is required';
    if (!form.startTime.trim()) newErrors.startTime = 'Start time is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        customer: form.customer,
        products: form.products,
        startTime: form.startTime,
        endTime: form.endTime,
        distribution: form.distribution,
        status: form.status,
        deliveryStatus: form.deliveryStatus,
        price: form.price,
        notes: form.notes
      });
      onClose();
      setForm({
        customer: '',
        products: '',
        startTime: '',
        endTime: '',
        distribution: '',
        status: 'Booked',
        deliveryStatus: 'Ready to pickup',
        price: '',
        notes: ''
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create new order"
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-order"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Create order
          </button>
        </>
      }
    >
      <form id="create-order" className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div className="col-span-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
            Customer*
            <input
              type="text"
              value={form.customer}
              onChange={(event) => setForm((prev) => ({ ...prev, customer: event.target.value }))}
              className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            />
            {errors.customer ? <span className="text-xs text-red-600">{errors.customer}</span> : null}
          </label>
        </div>
        <div className="col-span-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
            Product(s)*
            <input
              type="text"
              value={form.products}
              onChange={(event) => setForm((prev) => ({ ...prev, products: event.target.value }))}
              className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            />
            {errors.products ? <span className="text-xs text-red-600">{errors.products}</span> : null}
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
          Start time*
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(event) => setForm((prev) => ({ ...prev, startTime: event.target.value }))}
            className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
          {errors.startTime ? <span className="text-xs text-red-600">{errors.startTime}</span> : null}
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
          End time
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(event) => setForm((prev) => ({ ...prev, endTime: event.target.value }))}
            className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
          Distribution
          <input
            type="text"
            value={form.distribution}
            onChange={(event) => setForm((prev) => ({ ...prev, distribution: event.target.value }))}
            className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
          Status*
          <select
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value as OrderStatus }))
            }
            className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
          Delivery status*
          <select
            value={form.deliveryStatus}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, deliveryStatus: event.target.value as DeliveryStatus | '—' }))
            }
            className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          >
            {deliveryStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
          Price
          <input
            type="text"
            value={form.price}
            placeholder="0.00 NOK"
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
        </label>
        <div className="col-span-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-text-primary">
            Notes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="rounded-lg border border-border-subtle px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            />
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrderForm;

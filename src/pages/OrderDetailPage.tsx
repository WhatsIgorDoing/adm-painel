import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowUturnLeftIcon, DocumentDuplicateIcon, PrinterIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Layout from '../components/Layout';
import StatusPill from '../components/StatusPill';
import { ORDERS } from '../data/orders';

const OrderDetailPage = () => {
  const params = useParams<{ ref: string }>();
  const navigate = useNavigate();
  const order = useMemo(() => ORDERS.find((item) => item.ref === params.ref), [params.ref]);

  if (!order) {
    return (
      <Layout
        header={
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-text-primary">Order not found</h1>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="rounded-lg border border-border-subtle px-4 py-2 text-sm text-text-primary"
            >
              Back to orders
            </button>
          </div>
        }
      >
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-text-secondary">The requested order was not found.</p>
        </div>
      </Layout>
    );
  }

  const canCancel = !['Closed', 'Dropped', 'Test', 'Cancelled'].includes(order.status);
  const canClose = !['Closed', 'Dropped', 'Test'].includes(order.status);

  return (
    <Layout
      header={
        <div className="flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" /> Back
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-text-primary">Order {order.ref}</h1>
              <StatusPill type="status" value={order.status} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-border-subtle px-3 py-2 text-sm font-medium text-text-primary hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={!canCancel}
              className={clsx(
                'rounded-lg border px-3 py-2 text-sm font-medium',
                canCancel
                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                  : 'cursor-not-allowed border-border-subtle text-text-secondary'
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canClose}
              className={clsx(
                'rounded-lg border px-3 py-2 text-sm font-medium',
                canClose
                  ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  : 'cursor-not-allowed border-border-subtle text-text-secondary'
              )}
            >
              Close
            </button>
          </div>
        </div>
      }
      toolbar={
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => console.info('Duplicate order', order.ref)}
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary hover:bg-gray-100"
          >
            <DocumentDuplicateIcon className="h-4 w-4" /> Duplicate order
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary hover:bg-gray-100"
          >
            <PrinterIcon className="h-4 w-4" /> Print
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard?.writeText) {
                navigator.clipboard
                  .writeText(JSON.stringify(order, null, 2))
                  .catch((error) => console.error('Copy failed', error));
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm text-text-primary hover:bg-gray-100"
          >
            Export JSON
          </button>
        </div>
      }
    >
      <div className="grid flex-1 grid-cols-12 gap-6 p-6">
        <section className="col-span-4 rounded-2xl border border-border-subtle bg-white p-6">
          <h2 className="text-sm font-semibold text-text-secondary">Customer</h2>
          <div className="mt-4 space-y-2 text-sm text-text-primary">
            <p className="text-base font-semibold text-text-primary">{order.customer}</p>
            <p>Email: customer@example.com</p>
            <p>Phone: +47 45 33 22 11</p>
          </div>
        </section>
        <section className="col-span-4 rounded-2xl border border-border-subtle bg-white p-6">
          <h2 className="text-sm font-semibold text-text-secondary">Products</h2>
          <ul className="mt-4 space-y-2 text-sm text-text-primary">
            {order.products.split(',').map((product) => (
              <li key={product.trim()} className="flex items-center justify-between">
                <span>{product.trim()}</span>
                <span className="text-xs text-text-secondary">Qty 1</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="col-span-4 rounded-2xl border border-border-subtle bg-white p-6">
          <h2 className="text-sm font-semibold text-text-secondary">Logistics</h2>
          <div className="mt-4 space-y-2 text-sm text-text-primary">
            <p>
              Distribution
              <br />
              <span className="text-text-secondary">{order.distribution}</span>
            </p>
            <p>
              Delivery status
              <br />
              <span className="text-text-secondary">{order.delivery}</span>
            </p>
            <p>
              Start time
              <br />
              <span className="text-text-secondary">{order.start}</span>
            </p>
            <p>
              End time
              <br />
              <span className="text-text-secondary">{order.end}</span>
            </p>
          </div>
        </section>
        <section className="col-span-8 rounded-2xl border border-border-subtle bg-white p-6">
          <h2 className="text-sm font-semibold text-text-secondary">Timeline</h2>
          <ol className="mt-4 space-y-4 border-l border-border-subtle pl-4 text-sm text-text-secondary">
            <li>
              <span className="font-medium text-text-primary">{order.created}</span>
              <p>Order created by {order.createdBy}</p>
            </li>
            <li>
              <span className="font-medium text-text-primary">{order.start}</span>
              <p>Status changed to {order.status}</p>
            </li>
            <li>
              <span className="font-medium text-text-primary">Latest update</span>
              <p>Distribution set to {order.distribution}</p>
            </li>
          </ol>
        </section>
        <section className="col-span-4 rounded-2xl border border-border-subtle bg-white p-6">
          <h2 className="text-sm font-semibold text-text-secondary">Billing</h2>
          <div className="mt-4 text-sm text-text-secondary">
            <p className="text-2xl font-semibold text-text-primary">{order.price}</p>
            <p className="mt-1">Currency: NOK</p>
            <p>Payment method: Invoice</p>
          </div>
        </section>
        <section className="col-span-12 rounded-2xl border border-border-subtle bg-white p-6">
          <h2 className="text-sm font-semibold text-text-secondary">Notes</h2>
          <p className="mt-4 text-sm text-text-secondary">
            {order.notes ? order.notes.replace('tooltip: ', '') : 'No notes added.'}
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default OrderDetailPage;

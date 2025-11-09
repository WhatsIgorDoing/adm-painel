import { Order } from '../types';

const headers = [
  'ref',
  'created',
  'customer',
  'products',
  'start',
  'end',
  'distribution',
  'status',
  'delivery',
  'price',
  'department',
  'createdBy',
  'productTag'
];

const serialize = (order: Order) => headers.map((key) => (order as never)[key]);

export const exportCSV = (orders: Order[]) => {
  const rows = [headers.join(',')].concat(
    orders.map((order) =>
      serialize(order)
        .map((field) =>
          typeof field === 'string' && field.includes(',') ? `"${field}"` : field ?? ''
        )
        .join(',')
    )
  );
  triggerDownload(rows.join('\n'), 'text/csv', 'orders.csv');
};

export const exportJSON = (orders: Order[]) => {
  triggerDownload(JSON.stringify(orders, null, 2), 'application/json', 'orders.json');
};

export const exportXLSX = (orders: Order[]) => {
  const headerRow = headers.join('\t');
  const rows = orders.map((order) => serialize(order).join('\t'));
  triggerDownload([headerRow, ...rows].join('\n'), 'application/vnd.ms-excel', 'orders.xls');
};

const triggerDownload = (content: string, mime: string, filename: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

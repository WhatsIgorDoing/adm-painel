import { addDays, format, parse } from 'date-fns';
import { DeliveryStatus, Order, OrderStatus } from '../types';

const baseSample: Order[] = [
  {
    id: '11',
    ref: 'QH29',
    created: '15 Jul 2020 22:00',
    customer: 'Peter Kristiansen',
    products: 'Orbea Orca M30 🔁',
    start: '08 Aug 2020 14:00',
    end: '12 Aug 2020 14:00',
    distribution: 'Grøubøgata 1, Oslo',
    status: 'Cancelled',
    delivery: 'Cancelled',
    price: '800.00 NOK',
    notes: 'tooltip: Renewing subscription',
    department: 'Grøubøgata 1',
    createdBy: 'Camilla',
    productTag: 'Subscription',
    delayed: false
  },
  {
    id: '12',
    ref: 'VB58',
    created: '15 Jul 2020 21:00',
    customer: 'Ola Nordmann',
    products: 'Pinarello Gan Disk',
    start: '07 Aug 2020 14:00',
    end: '16 Aug 2020 14:00',
    distribution: 'Avdeling 16, Oslo',
    status: 'Booked',
    delivery: 'Ready to pickup',
    price: '1,600.00 NOK',
    department: 'Avdeling 16',
    createdBy: 'Sindre',
    productTag: 'Road bike'
  },
  {
    id: '13',
    ref: 'LH44',
    created: '14 Jul 2020 20:00',
    customer: 'Viggo Aukland',
    products: 'S-Works Tarmac SL7',
    start: '05 Aug 2020 14:00',
    end: '08 Aug 2020 14:00',
    distribution: 'Grøubøgata 1',
    status: 'Booked',
    delivery: 'Delayed',
    price: '645.00 NOK',
    department: 'Grøubøgata 1',
    createdBy: 'Camilla',
    productTag: 'Road bike',
    delayed: true
  },
  {
    id: '14',
    ref: 'TS49',
    created: '13 Jul 2020 20:00',
    customer: 'Merethe Meinig',
    products: 'Elite Direto XR, Schwalbe Ins…',
    start: '06 Aug 2020 14:00',
    end: '06 Aug 2020 20:00',
    distribution: 'Avdeling 16, Svolvær',
    status: 'In Cart',
    delivery: '—',
    price: '199.99 NOK',
    department: 'Avdeling 16',
    createdBy: 'Jonas',
    productTag: 'Accessories'
  },
  {
    id: '15',
    ref: 'QE50',
    created: '13 Jul 2020 20:00',
    customer: 'Edvin Joanssen',
    products: 'FELT Sport E-50 ⚡',
    start: '05 Aug 2020 14:00',
    end: '—',
    distribution: 'Grøubøgata 1',
    status: 'Closed',
    delivery: 'Picked up',
    price: '399.00 NOK',
    department: 'Grøubøgata 1',
    createdBy: 'Camilla',
    productTag: 'E-bike'
  },
  {
    id: '16',
    ref: 'ZM94',
    created: '03 Aug 2020 10:21',
    customer: 'Admin',
    products: 'BH Atom 29',
    start: '04 Aug 2020 08:45',
    end: '—',
    distribution: 'Grøubøgata 1',
    status: 'Dropped',
    delivery: 'Cancelled',
    price: '485.00 NOK',
    department: 'Grøubøgata 1',
    createdBy: 'System',
    productTag: 'Mountain'
  },
  {
    id: '17',
    ref: 'MV33',
    created: '28 Jul 2020 18:02',
    customer: 'Thorbjørn Bernsen',
    products: 'HJC Atara, Abus Hyban+',
    start: '01 Aug 2020 12:30',
    end: '03 Aug 2020 09:45',
    distribution: 'Avdeling 16, Oslo',
    status: 'Booked',
    delivery: 'Delayed',
    price: '845.00 NOK',
    department: 'Avdeling 16',
    createdBy: 'Sindre',
    productTag: 'Accessories',
    delayed: true
  },
  {
    id: '18',
    ref: 'AA23',
    created: '28 Jul 2020 18:00',
    customer: 'Admin',
    products: 'Shimano 105 ST-R7000',
    start: '29 Jul 2020 12:00',
    end: '—',
    distribution: 'Ekebergveien 65',
    status: 'Test',
    delivery: 'Returned',
    price: '399.00 NOK',
    department: 'Ekebergveien 65',
    createdBy: 'System',
    productTag: 'Components'
  },
  {
    id: '19',
    ref: 'GR88',
    created: '27 Jul 2020 19:40',
    customer: 'Per Thue',
    products: 'EYEN Kort 2-Pack',
    start: '01 Aug 2020 12:30',
    end: '03 Aug 2020 09:45',
    distribution: 'Grøubøgata 1',
    status: 'Request',
    delivery: 'To transport',
    price: '512.00 NOK',
    department: 'Grøubøgata 1',
    createdBy: 'Camilla',
    productTag: 'Accessories'
  },
  {
    id: '20',
    ref: 'NL06',
    created: '27 Jul 2020 19:40',
    customer: 'Hallgrim Haukland',
    products: 'S-Works Shiv TT Disc',
    start: '26 Jul 2020 12:00',
    end: '24 Aug 2020 12:00',
    distribution: 'Grøubøgata 1',
    status: 'Booked',
    delivery: 'On checking',
    price: '1,249.00 NOK',
    department: 'Grøubøgata 1',
    createdBy: 'Camilla',
    productTag: 'Triathlon'
  }
];

const departments = ['Grøubøgata 1', 'Avdeling 16', 'Ekebergveien 65', 'Ekeberg Logistikk', 'Distribution Hub'];
const creators = ['Camilla', 'Sindre', 'Jonas', 'System', 'Helga'];
const tags = ['Road bike', 'E-bike', 'Accessories', 'Components', 'Subscription', 'Logistics'];
const statusOrder: OrderStatus[] = ['Booked', 'In Cart', 'Cancelled', 'Closed', 'Dropped', 'Request', 'Test'];
const deliveryValues: (DeliveryStatus | '—')[] = [
  'Ready to pickup',
  'Picked up',
  'Returned',
  'Delayed',
  'Cancelled',
  'To transport',
  'On checking',
  '—'
];

const dateTemplate = parse('01 Jul 2020 08:00', 'dd MMM yyyy HH:mm', new Date());

const generated: Order[] = Array.from({ length: 64 }, (_, index) => {
  if (index >= 10 && index < 20) {
    return baseSample[index - 10];
  }

  const ref = `GEN${(index + 1).toString().padStart(2, '0')}`;
  const createdDate = addDays(dateTemplate, index);
  const created = format(createdDate, 'dd MMM yyyy HH:mm');
  const start = format(addDays(createdDate, 10), 'dd MMM yyyy HH:mm');
  const end = index % 3 === 0 ? '—' : format(addDays(createdDate, 15), 'dd MMM yyyy HH:mm');
  const status = statusOrder[index % statusOrder.length];
  const delivery = deliveryValues[index % deliveryValues.length];
  const department = departments[index % departments.length];
  const createdBy = creators[index % creators.length];
  const productTag = tags[index % tags.length];
  return {
    id: String(index + 1),
    ref,
    created,
    customer: `Customer ${index + 1}`,
    products: `Product bundle ${index + 1}`,
    start,
    end,
    distribution: `${department}, Oslo`,
    status,
    delivery,
    price: `${(500 + index * 5).toFixed(2)} NOK`,
    department,
    createdBy,
    productTag,
    delayed: delivery === 'Delayed'
  };
});

export const ORDERS: Order[] = generated;

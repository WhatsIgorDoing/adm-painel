export type OrderStatus =
  | 'Booked'
  | 'Cancelled'
  | 'Closed'
  | 'Dropped'
  | 'In Cart'
  | 'Request'
  | 'Test';

export type DeliveryStatus =
  | 'Ready to pickup'
  | 'Picked up'
  | 'Returned'
  | 'Delayed'
  | 'Cancelled'
  | 'To transport'
  | 'On checking';

export interface Order {
  id: string;
  ref: string;
  created: string;
  customer: string;
  products: string;
  start: string;
  end: string;
  distribution: string;
  status: OrderStatus;
  delivery: DeliveryStatus | '—';
  price: string;
  notes?: string;
  department: string;
  createdBy: string;
  productTag?: string;
  delayed?: boolean;
}

export interface FilterState {
  search: string;
  dateRange: { label: string; from?: Date | null; to?: Date | null } | null;
  statuses: OrderStatus[];
  departments: string[];
  deliveryStatuses: (DeliveryStatus | '—')[];
  priceRange?: [number | null, number | null];
  createdBy?: string[];
  productTags?: string[];
  distribution?: string[];
}

export interface SavedFilter {
  id: string;
  name: string;
  state: FilterState;
}

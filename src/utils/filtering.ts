import { isWithinInterval, parse } from 'date-fns';
import { FilterState, Order } from '../types';

const parseDate = (value: string) => {
  if (value === '—') return null;
  try {
    return parse(value, 'dd MMM yyyy HH:mm', new Date());
  } catch {
    return null;
  }
};

export const defaultFilterState: FilterState = {
  search: '',
  dateRange: null,
  statuses: [],
  departments: [],
  deliveryStatuses: [],
  priceRange: [null, null],
  createdBy: [],
  productTags: [],
  distribution: []
};

const searchTokens = (order: Order, term: string) => {
  const normalized = term.toLowerCase();
  return (
    order.ref.toLowerCase().includes(normalized) ||
    order.customer.toLowerCase().includes(normalized) ||
    order.products.toLowerCase().includes(normalized) ||
    order.status.toLowerCase().includes(normalized) ||
    order.delivery.toLowerCase().includes(normalized) ||
    order.distribution.toLowerCase().includes(normalized) ||
    order.created.toLowerCase().includes(normalized)
  );
};

const parsePrice = (price: string) => {
  return Number(price.replace(/[^0-9.,]/g, '').replace(',', ''));
};

export const applyFilters = (orders: Order[], filters: FilterState) => {
  return orders.filter((order) => {
    if (filters.search && !searchTokens(order, filters.search)) {
      return false;
    }

    if (filters.dateRange?.from || filters.dateRange?.to) {
      const createdDate = parseDate(order.created);
      if (!createdDate) return false;
      const from = filters.dateRange.from ?? new Date(-8640000000000000);
      const to = filters.dateRange.to ?? new Date(8640000000000000);
      if (!isWithinInterval(createdDate, { start: from, end: to })) {
        return false;
      }
    }

    if (filters.statuses.length > 0 && !filters.statuses.includes(order.status)) {
      return false;
    }

    if (filters.departments.length > 0 && !filters.departments.includes(order.department)) {
      return false;
    }

    if (
      filters.deliveryStatuses.length > 0 &&
      !filters.deliveryStatuses.includes(order.delivery)
    ) {
      return false;
    }

    if (filters.priceRange && (filters.priceRange[0] || filters.priceRange[1])) {
      const price = parsePrice(order.price);
      const [min, max] = filters.priceRange;
      if ((min !== null && price < min) || (max !== null && price > max)) {
        return false;
      }
    }

    if (filters.createdBy && filters.createdBy.length > 0) {
      if (!filters.createdBy.includes(order.createdBy)) {
        return false;
      }
    }

    if (filters.productTags && filters.productTags.length > 0) {
      if (!order.productTag || !filters.productTags.includes(order.productTag)) {
        return false;
      }
    }

    if (filters.distribution && filters.distribution.length > 0) {
      if (!filters.distribution.some((d) => order.distribution.includes(d))) {
        return false;
      }
    }

    return true;
  });
};

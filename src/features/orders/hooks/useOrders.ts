import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';
import { useOrderFiltersStore } from '../store/orderFilters.store';

export function useOrders() {
  const filters = useOrderFiltersStore((s) => s.filters);

  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getList(filters),
    placeholderData: (prev) => prev,
  });
}

import { create } from 'zustand';
import type { OrderFilters } from '../types/order.types';

interface OrderFiltersState {
  filters: OrderFilters;
  setSearch: (search: string) => void;
  setStatus: (status: OrderFilters['status']) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: OrderFilters = {
  search: '',
  status: 'all',
  page: 1,
  limit: 20,
};

export const useOrderFiltersStore = create<OrderFiltersState>((set) => ({
  filters: DEFAULT_FILTERS,
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
  setStatus: (status) => set((s) => ({ filters: { ...s.filters, status, page: 1 } })),
  setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));

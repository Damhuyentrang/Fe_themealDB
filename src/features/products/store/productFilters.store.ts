import { create } from 'zustand';
import type { ProductFilters } from '../types/product.types';

interface ProductFiltersState {
  filters: ProductFilters;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: ProductFilters = { search: '', page: 1, limit: 20 };

export const useProductFiltersStore = create<ProductFiltersState>((set) => ({
  filters: DEFAULT_FILTERS,
  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
  setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
}));

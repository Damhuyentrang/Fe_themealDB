export interface Product {
  id: string;
  name: string;
  image?: string;
  availableQty: number;
  category?: string;
  brand?: string;
  createdAt: string;
  sku?: string;
  status: 'active' | 'inactive';
}

export interface ProductFilters {
  search: string;
  channel?: string;
  category?: string;
  tag?: string;
  page: number;
  limit: number;
}

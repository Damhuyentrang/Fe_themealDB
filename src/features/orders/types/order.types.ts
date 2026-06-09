export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'partial';
export type OrderSource = 'Website' |  'Facebook' | 'Shopee' | 'TikTok' | 'Admin';

export interface Order {
  id: string;
  code: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    phone?: string;
  };
  source: OrderSource;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingService?: string;
}

export interface OrderFilters {
  search: string;
  status: OrderStatus | 'all';
  source?: OrderSource;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import OrderFilters from '../components/OrderFilters';
import OrderTable from '../components/OrderTable';
import OrderMoreFiltersDrawer from '../components/OrderMoreFiltersDrawer';
import { useOrderFiltersStore } from '../store/orderFilters.store';
import { ROUTES } from '../../../constants/routes';
import type { Order } from '../types/order.types';

const MOCK_ORDERS: Order[] = [
  {
    id: '1004', code: '#1004', createdAt: '2026-06-05T16:23:00',
    customer: { id: '3', name: '---' },
    source: 'Admin', total: 1_000_000,
    paymentStatus: 'unpaid', orderStatus: 'pending',
  },
  {
    id: '1003', code: '#1003', createdAt: '2026-06-03T14:18:00',
    customer: { id: '2', name: 'Trang Cute' },
    source: 'Website', total: 4_040_000,
    paymentStatus: 'unpaid', orderStatus: 'pending',
  },
  {
    id: '1002', code: '#1002', createdAt: '2026-06-03T13:46:00',
    customer: { id: '1', name: 'Đặng Hiếu' },
    source: 'Website', total: 2_040_000,
    paymentStatus: 'unpaid', orderStatus: 'pending',
  },
  {
    id: '1001', code: '#1001', createdAt: '2026-06-03T13:42:00',
    customer: { id: '1', name: 'Đặng Hiếu' },
    source: 'Admin', total: 2_000_000,
    paymentStatus: 'paid', orderStatus: 'completed',
  },
];

export default function OrderListPage() {
  const { filters, setPage } = useOrderFiltersStore();
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  const filtered = MOCK_ORDERS.filter((o) => {
    if (filters.status !== 'all' && o.orderStatus !== filters.status) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        o.code.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const total = filtered.length;
  const start = (filters.page - 1) * filters.limit + 1;
  const end = Math.min(filters.page * filters.limit, total);
  const totalPages = Math.ceil(total / filters.limit);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Danh sách đơn hàng: <span className="font-normal">Cửa hàng chính</span>
        </h1>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
            Xử lý đơn hàng
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
            Thao tác khác ▾
          </button>
          <Link
            to={ROUTES.ORDER_CREATE}
            className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
          >
            + Tạo đơn hàng
          </Link>
        </div>
      </div>

      {/* Filters */}
      <OrderFilters onMoreFilters={() => setMoreFiltersOpen(true)} />

      {/* Table */}
      <OrderTable orders={filtered} isLoading={false} />

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Từ {total > 0 ? start : 0} đến {end} trên tổng {total}</span>
        <div className="flex items-center gap-2">
          <span>Hiển thị</span>
          <select className="border border-gray-200 rounded px-2 py-1">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>Kết quả</span>
          <div className="flex gap-1 ml-4">
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-sm ${
                  p === filters.page ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">
        Tìm hiểu về{' '}
        <button className="text-blue-500 hover:underline">đơn hàng</button>
      </p>

      {/* More filters drawer */}
      <OrderMoreFiltersDrawer
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        onApply={() => {}}
        onClear={() => {}}
      />
    </div>
  );
}

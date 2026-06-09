import { useState } from 'react';
import { Link } from 'react-router-dom';

type EmailStatus = 'not_sent' | 'sent';
type OrderStatus = 'incomplete' | 'completed';

interface IncompleteOrder {
  id: string;
  code: string;
  createdAt: string;
  customer: string;
  emailStatus: EmailStatus;
  orderStatus: OrderStatus;
  total: number;
}

const EMAIL_STATUS_CFG: Record<EmailStatus, { label: string; className: string }> = {
  not_sent: { label: 'Chưa gửi',  className: 'bg-yellow-50 text-yellow-600 border border-yellow-300' },
  sent:     { label: 'Đã gửi',    className: 'bg-green-50 text-green-600 border border-green-300' },
};

const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; className: string }> = {
  incomplete: { label: 'Chưa hoàn tất', className: 'bg-orange-50 text-orange-500 border border-orange-300' },
  completed:  { label: 'Đã hoàn tất',   className: 'bg-green-50 text-green-600 border border-green-300' },
};

const MOCK_INCOMPLETE: IncompleteOrder[] = [
  {
    id: '88995993', code: '88995993',
    createdAt: '2026-06-05T16:57:00',
    customer: 'damtrang@gmail.com',
    emailStatus: 'not_sent',
    orderStatus: 'incomplete',
    total: 4_000_000,
  },
];

function Badge({ config }: { config: { label: string; className: string } }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function IncompleteOrderListPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_INCOMPLETE.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.code.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
  });

  const toggleAll = (c: boolean) => setSelected(c ? new Set(filtered.map((o) => o.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh sách đơn chưa hoàn tất</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tab */}
        <div className="border-b border-gray-200 px-4">
          <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-blue-500 text-blue-600 -mb-px">
            Tất cả
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, SĐT, email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Ngày tạo ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Trạng thái đặt hàng ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            🔍 Bộ lọc khác
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Lưu bộ lọc
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left">Mã đơn hàng</th>
              <th className="px-4 py-3 text-left">Ngày tạo đơn</th>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Trạng thái email</th>
              <th className="px-4 py-3 text-left">Trạng thái đặt hàng</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggleOne(order.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/orders/incomplete/${order.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {order.code}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-gray-700">{order.customer}</td>
                <td className="px-4 py-3">
                  <Badge config={EMAIL_STATUS_CFG[order.emailStatus]} />
                </td>
                <td className="px-4 py-3">
                  <Badge config={ORDER_STATUS_CFG[order.orderStatus]} />
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">
                  {order.total.toLocaleString('vi-VN')}đ
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy đơn hàng chưa hoàn tất
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
          <span>Từ {filtered.length > 0 ? 1 : 0} đến {filtered.length} trên tổng {filtered.length}</span>
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-sm">
              <option>20</option><option>50</option><option>100</option>
            </select>
            <span>Kết quả</span>
            <div className="ml-4">
              <button className="w-8 h-8 rounded bg-blue-600 text-white text-sm font-medium">1</button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">
        Tìm hiểu về{' '}
        <button className="text-blue-500 hover:underline">đơn chưa hoàn tất</button>
      </p>
    </div>
  );
}

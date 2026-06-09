import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  orderCount: number;
  lastOrder: string | null;
  totalSpent: number;
  avatarColor: string;
  initials: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Chị Đan',    email: 'linhdan@gmail.com',         phone: '+84886010207',  orderCount: 1, lastOrder: '1005', totalSpent: 0, avatarColor: 'bg-purple-400', initials: 'CH' },
  { id: '2', name: 'Hiêu Đặng',  email: null,                        phone: '+84812102205',  orderCount: 0, lastOrder: null,   totalSpent: 0, avatarColor: 'bg-green-400',  initials: 'HI' },
  { id: '3', name: 'Trang Cute',  email: 'damtrang@gmail.com',        phone: null,            orderCount: 1, lastOrder: '1003', totalSpent: 0, avatarColor: 'bg-teal-400',   initials: 'TR' },
  { id: '4', name: 'Đặng Hiêu',  email: 'hieuvandang1306@gmail.com', phone: null,            orderCount: 2, lastOrder: '1002', totalSpent: 0, avatarColor: 'bg-orange-400', initials: 'DA' },
];

function Avatar({ color, initials }: { color: string; initials: string }) {
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export default function CustomerListPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
    );
  });

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(filtered.map((c) => c.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Khách hàng</h1>
        <div className="flex items-center gap-2">
          <Link
            to="/customers/create"
            className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium flex items-center gap-1"
          >
            ＋ Thêm khách hàng
          </Link>
        </div>
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
              placeholder="Tìm kiếm khách hàng"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Nhóm khách hàng ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Trạng thái ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Đã được tag với ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            🔍 Bộ lọc khác
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
              <th className="px-4 py-3 text-left">Tên khách hàng</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Điện thoại</th>
              <th className="px-4 py-3 text-center">Đơn hàng</th>
              <th className="px-4 py-3 text-left">Đơn hàng gần nhất</th>
              <th className="px-4 py-3 text-right">Tổng chi tiêu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(customer.id)}
                    onChange={() => toggleOne(customer.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar color={customer.avatarColor} initials={customer.initials} />
                    <Link
                      to={`/customers/${customer.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {customer.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{customer.email ?? ''}</td>
                <td className="px-4 py-3 text-gray-600">{customer.phone ?? ''}</td>
                <td className="px-4 py-3 text-center text-gray-700">{customer.orderCount}</td>
                <td className="px-4 py-3">
                  {customer.lastOrder ? (
                    <Link
                      to={`/orders/${customer.lastOrder}`}
                      className="text-blue-600 hover:underline"
                    >
                      #{customer.lastOrder}
                    </Link>
                  ) : (
                    <span className="text-gray-400">---</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {customer.totalSpent > 0
                    ? `${customer.totalSpent.toLocaleString('vi-VN')}đ`
                    : '0đ'}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy khách hàng nào
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
        Tìm hiểu thêm về{' '}
        <button className="text-blue-500 hover:underline">khách hàng</button>
      </p>
    </div>
  );
}

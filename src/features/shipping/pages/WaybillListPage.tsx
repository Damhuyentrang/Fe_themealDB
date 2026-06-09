import { useState } from 'react';
import { Link } from 'react-router-dom';

type WaybillStatus = 'pending' | 'picked' | 'delivering' | 'delivered' | 'cancelled' | 'returning';

interface Waybill {
  id: string;
  code: string;
  orderCode: string;
  carrier: string;
  customer: string;
  address: string;
  cod: number;
  status: WaybillStatus;
  createdAt: string;
}

const STATUS_CONFIG: Record<WaybillStatus, { label: string; className: string }> = {
  pending:    { label: 'Chờ lấy hàng',    className: 'text-yellow-600 bg-yellow-50 border border-yellow-300' },
  picked:     { label: 'Đã lấy hàng',     className: 'text-blue-600 bg-blue-50 border border-blue-300' },
  delivering: { label: 'Đang giao hàng',  className: 'text-purple-600 bg-purple-50 border border-purple-300' },
  delivered:  { label: 'Đã giao hàng',    className: 'text-green-600 bg-green-50 border border-green-300' },
  cancelled:  { label: 'Huỷ giao hàng',   className: 'text-red-600 bg-red-50 border border-red-300' },
  returning:  { label: 'Đang hoàn hàng',  className: 'text-orange-600 bg-orange-50 border border-orange-300' },
};

const MOCK_WAYBILLS: Waybill[] = [];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export default function WaybillListPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_WAYBILLS.filter(
    (w) =>
      w.code.toLowerCase().includes(search.toLowerCase()) ||
      w.orderCode.toLowerCase().includes(search.toLowerCase()) ||
      w.customer.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(filtered.map((w) => w.id)) : new Set());

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh sách vận đơn</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-4 flex gap-1 overflow-x-auto">
          {['Tất cả', 'Chờ lấy hàng', 'Đã lấy hàng', 'Đang giao hàng', 'Đã giao hàng', 'Huỷ giao hàng', 'Đang hoàn hàng'].map(
            (tab, i) => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap -mb-px border-b-2 ${
                  i === 0
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm kiếm theo mã vận đơn, mã đơn hàng, khách hàng"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Đối tác vận chuyển ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Ngày tạo ▾
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
              <th className="px-4 py-3 text-left">Mã vận đơn</th>
              <th className="px-4 py-3 text-left">Mã đơn hàng</th>
              <th className="px-4 py-3 text-left">Đối tác vận chuyển</th>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Địa chỉ giao</th>
              <th className="px-4 py-3 text-right">Tiền COD</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((waybill) => {
              const status = STATUS_CONFIG[waybill.status];
              return (
                <tr key={waybill.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(waybill.id)}
                      onChange={() => toggleOne(waybill.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-600 hover:underline cursor-pointer">
                    {waybill.code}
                  </td>
                  <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                    {waybill.orderCode}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{waybill.carrier}</td>
                  <td className="px-4 py-3 text-gray-700">{waybill.customer}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{waybill.address}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {waybill.cod > 0 ? `${waybill.cod.toLocaleString('vi-VN')}đ` : '---'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(waybill.createdAt)}</td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-5xl">📦</span>
                    <p className="font-medium text-gray-700 mt-2">Cửa hàng của bạn chưa có vận đơn nào</p>
                    <p className="text-sm text-gray-400">Tạo mới vận đơn của bạn</p>
                    <Link
                      to="/orders/create"
                      className="mt-2 inline-flex items-center gap-1 text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
                    >
                      ＋ Tạo đơn hàng
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
            <span>Từ 1 đến {filtered.length} trên tổng {filtered.length}</span>
            <div className="flex items-center gap-2">
              <span>Hiển thị</span>
              <select className="border border-gray-200 rounded px-2 py-1 text-sm">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span>Kết quả</span>
              <div className="ml-4">
                <button className="w-8 h-8 rounded bg-blue-600 text-white text-sm font-medium">1</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-400">
        Tìm hiểu thêm về{' '}
        <button className="text-blue-500 hover:underline">vận đơn</button>
      </p>
    </div>
  );
}

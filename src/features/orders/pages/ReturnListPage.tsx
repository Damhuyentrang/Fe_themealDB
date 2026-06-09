import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReturnMoreFiltersDrawer from '../components/ReturnMoreFiltersDrawer';

type ReturnRefundStatus = 'refunded' | 'pending_refund' | 'no_refund';
type ReturnReceiveStatus = 'received' | 'pending' | 'failed' | 'lost';
type ReturnOrderStatus = 'archived' | 'open' | 'cancelled';

interface ReturnOrder {
  id: string;
  code: string;
  createdAt: string;
  customer: string;
  orderId: string;
  orderCode: string;
  refundStatus: ReturnRefundStatus;
  receiveStatus: ReturnReceiveStatus;
  productCount: number;
  orderStatus: ReturnOrderStatus;
}

const REFUND_STATUS_CFG: Record<ReturnRefundStatus, { label: string; className: string }> = {
  refunded:       { label: 'Đã hoàn trả',    className: 'bg-green-50 text-green-600 border border-green-300' },
  pending_refund: { label: 'Chờ hoàn tiền',  className: 'bg-yellow-50 text-yellow-600 border border-yellow-300' },
  no_refund:      { label: 'Không hoàn tiền', className: 'bg-gray-50 text-gray-500 border border-gray-300' },
};

const RECEIVE_STATUS_CFG: Record<ReturnReceiveStatus, { label: string; className: string }> = {
  received: { label: 'Đã nhận hàng',  className: 'bg-green-50 text-green-600 border border-green-300' },
  pending:  { label: 'Chờ nhận hàng', className: 'bg-yellow-50 text-yellow-600 border border-yellow-300' },
  failed:   { label: 'Thất bại',      className: 'bg-red-50 text-red-500 border border-red-300' },
  lost:     { label: 'Thất lạc',      className: 'bg-orange-50 text-orange-500 border border-orange-300' },
};

const ORDER_STATUS_CFG: Record<ReturnOrderStatus, { label: string; className: string }> = {
  archived:  { label: 'Đã lưu trữ', className: 'bg-gray-100 text-gray-500 border border-gray-300' },
  open:      { label: 'Đang mở',    className: 'bg-blue-50 text-blue-500 border border-blue-300' },
  cancelled: { label: 'Đã hủy',     className: 'bg-red-50 text-red-500 border border-red-300' },
};

const MOCK_RETURNS: ReturnOrder[] = [
  {
    id: 'r1', code: '#1001-R1',
    createdAt: '2026-06-05T16:43:00',
    customer: 'Đặng Hiếu',
    orderId: '1001', orderCode: '#1001',
    refundStatus: 'refunded',
    receiveStatus: 'received',
    productCount: 1,
    orderStatus: 'archived',
  },
];

const STAT_PERIODS = ['7 ngày qua', '30 ngày qua', 'Tháng này'];

function Badge({ config }: { config: { label: string; className: string } }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ReturnListPage() {
  const [period, setPeriod] = useState('7 ngày qua');
  const [activeTab, setActiveTab] = useState<'all' | 'returning'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = MOCK_RETURNS.filter((r) => {
    if (activeTab === 'returning' && r.receiveStatus !== 'pending') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.customer.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.orderCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleAll = (c: boolean) => setSelected(c ? new Set(filtered.map((r) => r.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-6 text-sm">
          {/* Period selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-blue-400 text-gray-500"
          >
            {STAT_PERIODS.map((p) => <option key={p}>{p}</option>)}
          </select>

          {[
            { label: 'Yêu cầu trả hàng', value: 0 },
            { label: 'Chỉ hoàn tiền',     value: 0 },
            { label: 'Đang trả lại',       value: 0, dropdown: true },
            { label: 'Chờ xác nhận hàng hoàn', value: 0, dropdown: true },
            { label: 'Trả lại thất bại',   value: 0 },
            { label: 'Thất lạc',           value: 0 },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-start">
              <span className="text-xs text-gray-500 whitespace-nowrap">{stat.label}</span>
              <span className="font-semibold text-gray-800 text-sm flex items-center gap-0.5">
                {stat.value}
                {stat.dropdown && <span className="text-gray-400 text-xs ml-0.5">▾</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Tổng quan trả hàng: <span className="font-normal">Cửa hàng chính</span>
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-4 flex">
          {[{ key: 'all', label: 'Tất cả' }, { key: 'returning', label: 'Đang hoàn trả' }].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'all' | 'returning')}
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">
            ✕
          </button>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm kiếm theo khách hàng, số điện thoại khách hàng, mã đơn trả hàng, mã đơn hàng"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Lưu bộ lọc
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Sắp xếp ▾
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
          <button
            onClick={() => setFiltersOpen(true)}
            className="text-sm border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 flex items-center gap-1.5"
          >
            🔍 Xem tất cả
          </button>
          <button className="text-sm border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50">
            Ngày tạo ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 whitespace-nowrap">
            Chi nhánh nhận hàng ▾
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="w-8 px-3 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th className="px-3 py-3 text-left">Mã đơn trả</th>
              <th className="px-3 py-3 text-left">Ngày tạo ▾</th>
              <th className="px-3 py-3 text-left">Khách hàng</th>
              <th className="px-3 py-3 text-left">Mã đơn hàng</th>
              <th className="px-3 py-3 text-left">Trạng thái hoàn trả</th>
              <th className="px-3 py-3 text-left">Trạng thái nhận hàng</th>
              <th className="px-3 py-3 text-left">Sản phẩm ▾</th>
              <th className="px-3 py-3 text-left">Trạng thái đơn trả</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3">
                  <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} />
                </td>
                <td className="px-3 py-3">
                  <Link to={`/orders/returns/${r.id}`} className="text-blue-600 hover:underline font-medium">
                    {r.code}
                  </Link>
                </td>
                <td className="px-3 py-3 text-gray-600">{formatDate(r.createdAt)}</td>
                <td className="px-3 py-3 text-gray-700">{r.customer}</td>
                <td className="px-3 py-3">
                  <Link to={`/orders/${r.orderId}`} className="text-blue-600 hover:underline">
                    {r.orderCode}
                  </Link>
                </td>
                <td className="px-3 py-3">
                  <Badge config={REFUND_STATUS_CFG[r.refundStatus]} />
                </td>
                <td className="px-3 py-3">
                  <Badge config={RECEIVE_STATUS_CFG[r.receiveStatus]} />
                </td>
                <td className="px-3 py-3 text-gray-600">{r.productCount} sản phẩm</td>
                <td className="px-3 py-3">
                  <Badge config={ORDER_STATUS_CFG[r.orderStatus]} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy đơn trả hàng nào
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
        <button className="text-blue-500 hover:underline">đơn trả hàng</button>
      </p>

      <ReturnMoreFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={() => {}}
        onClear={() => {}}
      />
    </div>
  );
}

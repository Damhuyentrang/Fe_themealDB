import { useState } from 'react';

type Status = 'pending' | 'approved' | 'paid' | 'rejected';

interface Commission {
  id: string;
  orderId: string;
  customer: string;
  orderValue: number;
  rate: number;
  amount: number;
  date: string;
  paidAt?: string;
  status: Status;
}

const COMMISSIONS: Commission[] = [
  { id: 'C001', orderId: 'ORD-8801', customer: 'Nguyễn Thị Lan',  orderValue: 3_500_000, rate: 10, amount: 350_000, date: '2026-06-07', status: 'pending' },
  { id: 'C002', orderId: 'ORD-8755', customer: 'Lê Văn Dũng',     orderValue: 2_100_000, rate: 10, amount: 210_000, date: '2026-06-05', status: 'approved' },
  { id: 'C003', orderId: 'ORD-8701', customer: 'Phạm Quang Huy',  orderValue: 1_750_000, rate: 10, amount: 175_000, date: '2026-06-03', paidAt: '2026-06-05', status: 'paid' },
  { id: 'C004', orderId: 'ORD-8642', customer: 'Trần Thị Mai',    orderValue: 4_200_000, rate: 10, amount: 420_000, date: '2026-06-01', paidAt: '2026-06-03', status: 'paid' },
  { id: 'C005', orderId: 'ORD-8590', customer: 'Vũ Minh Tuấn',    orderValue: 1_950_000, rate: 10, amount: 195_000, date: '2026-05-30', paidAt: '2026-06-01', status: 'paid' },
  { id: 'C006', orderId: 'ORD-8540', customer: 'Đặng Thùy Linh',  orderValue: 5_800_000, rate: 10, amount: 580_000, date: '2026-05-28', status: 'approved' },
  { id: 'C007', orderId: 'ORD-8490', customer: 'Hoàng Đức Long',  orderValue: 2_800_000, rate: 10, amount: 280_000, date: '2026-05-25', paidAt: '2026-05-28', status: 'paid' },
  { id: 'C008', orderId: 'ORD-8430', customer: 'Bùi Thị Hồng',   orderValue: 980_000,   rate: 10, amount: 98_000,  date: '2026-05-22', status: 'rejected' },
];

const STATUS_CFG: Record<Status, { label: string; className: string }> = {
  pending:  { label: 'Chờ duyệt',       className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved: { label: 'Đã duyệt',        className: 'bg-blue-50 text-blue-700 border-blue-200' },
  paid:     { label: 'Đã thanh toán',   className: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Từ chối',         className: 'bg-red-50 text-red-700 border-red-200' },
};

const TABS: { key: Status | 'all'; label: string }[] = [
  { key: 'all',      label: 'Tất cả' },
  { key: 'pending',  label: 'Chờ duyệt' },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'paid',     label: 'Đã thanh toán' },
  { key: 'rejected', label: 'Từ chối' },
];

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + '₫';
}

export default function PortalCommissionsPage() {
  const [activeTab, setActiveTab] = useState<Status | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = COMMISSIONS.filter((c) => {
    const matchTab = activeTab === 'all' || c.status === activeTab;
    const matchSearch = !search || c.orderId.toLowerCase().includes(search.toLowerCase()) || c.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalPaid     = COMMISSIONS.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
  const totalApproved = COMMISSIONS.filter((c) => c.status === 'approved').reduce((s, c) => s + c.amount, 0);
  const totalPending  = COMMISSIONS.filter((c) => c.status === 'pending').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Lịch sử hoa hồng</h1>
        <p className="text-sm text-gray-500 mt-0.5">Theo dõi trạng thái hoa hồng từ các đơn hàng giới thiệu</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Đã thanh toán</p>
          <p className="text-2xl font-bold text-green-600">{fmt(totalPaid)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{COMMISSIONS.filter((c) => c.status === 'paid').length} đơn</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Đã duyệt, chờ TT</p>
          <p className="text-2xl font-bold text-blue-600">{fmt(totalApproved)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{COMMISSIONS.filter((c) => c.status === 'approved').length} đơn</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Chờ duyệt</p>
          <p className="text-2xl font-bold text-yellow-600">{fmt(totalPending)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{COMMISSIONS.filter((c) => c.status === 'pending').length} đơn</p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 space-y-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã đơn hoặc khách hàng..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const count = tab.key === 'all' ? COMMISSIONS.length : COMMISSIONS.filter((c) => c.status === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-30"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <p className="text-sm">Không có hoa hồng nào</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left px-4 py-2.5 font-medium">Mã đơn hàng</th>
                <th className="text-left px-4 py-2.5 font-medium">Khách hàng</th>
                <th className="text-right px-4 py-2.5 font-medium">Giá trị đơn</th>
                <th className="text-right px-4 py-2.5 font-medium">Tỷ lệ</th>
                <th className="text-right px-4 py-2.5 font-medium">Hoa hồng</th>
                <th className="text-left px-4 py-2.5 font-medium">Ngày giới thiệu</th>
                <th className="text-center px-4 py-2.5 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => {
                const s = STATUS_CFG[c.status];
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <span className="text-blue-600 font-mono text-xs">{c.orderId}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.customer}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(c.orderValue)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{c.rate}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">{fmt(c.amount)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      <div>{c.date}</div>
                      {c.paidAt && <div className="text-green-500">TT: {c.paidAt}</div>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${s.className}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Hiển thị {filtered.length} / {COMMISSIONS.length} bản ghi</span>
            <span>
              Tổng hoa hồng lọc: <strong className="text-gray-700">{fmt(filtered.reduce((s, c) => s + c.amount, 0))}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

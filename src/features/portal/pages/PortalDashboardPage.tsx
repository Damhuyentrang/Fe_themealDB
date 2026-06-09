import { useState } from 'react';
import { usePortalAuthStore } from '../stores/portalAuth.store';

const MOCK_STATS = {
  totalEarned: 4_250_000,
  pendingPayout: 820_000,
  totalOrders: 47,
  totalClicks: 312,
  thisMonth: 1_150_000,
  conversionRate: 15.1,
};

const RECENT_COMMISSIONS = [
  { id: 'C001', orderId: 'ORD-8801', customer: 'Nguyễn Thị Lan', amount: 350_000, date: '2026-06-07', status: 'pending' },
  { id: 'C002', orderId: 'ORD-8755', customer: 'Lê Văn Dũng',    amount: 210_000, date: '2026-06-05', status: 'approved' },
  { id: 'C003', orderId: 'ORD-8701', customer: 'Phạm Quang Huy', amount: 175_000, date: '2026-06-03', status: 'paid' },
  { id: 'C004', orderId: 'ORD-8642', customer: 'Trần Thị Mai',   amount: 420_000, date: '2026-06-01', status: 'approved' },
  { id: 'C005', orderId: 'ORD-8590', customer: 'Vũ Minh Tuấn',   amount: 195_000, date: '2026-05-30', status: 'paid' },
];

const STATUS_CFG = {
  pending:  { label: 'Chờ duyệt', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved: { label: 'Đã duyệt',  className: 'bg-blue-50 text-blue-700 border-blue-200' },
  paid:     { label: 'Đã thanh toán', className: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Từ chối',   className: 'bg-red-50 text-red-700 border-red-200' },
};

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + '₫';
}

export default function PortalDashboardPage() {
  const { member } = usePortalAuthStore();
  const [copied, setCopied] = useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(`https://shop.example.com?ref=${member?.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  return (
    <div className="space-y-6">
      {/* Header greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{greeting}, {member?.name?.split(' ').pop()} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Mã CTV: <span className="font-medium text-gray-700">{member?.code}</span> · Tỷ lệ hoa hồng: <span className="font-medium text-blue-600">{member?.commissionRate}%</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">Link giới thiệu của bạn</p>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-600 font-mono">...?ref={member?.referralCode}</span>
            <button
              onClick={copyRef}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
            >
              {copied ? '✓ Đã copy' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Tổng hoa hồng tích lũy</p>
          <p className="text-2xl font-bold text-gray-900">{fmt(MOCK_STATS.totalEarned)}</p>
          <p className="text-xs text-gray-400 mt-1">Tất cả thời gian</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Hoa hồng tháng này</p>
          <p className="text-2xl font-bold text-blue-600">{fmt(MOCK_STATS.thisMonth)}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-green-500">↑ 12%</span>
            <span className="text-xs text-gray-400">so với tháng trước</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Chờ thanh toán</p>
          <p className="text-2xl font-bold text-yellow-600">{fmt(MOCK_STATS.pendingPayout)}</p>
          <p className="text-xs text-gray-400 mt-1">Đang chờ duyệt</p>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-lg">🛒</div>
          <div>
            <p className="text-xl font-bold text-gray-900">{MOCK_STATS.totalOrders}</p>
            <p className="text-xs text-gray-500">Đơn hàng thành công</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-lg">👆</div>
          <div>
            <p className="text-xl font-bold text-gray-900">{MOCK_STATS.totalClicks}</p>
            <p className="text-xs text-gray-500">Lượt nhấp link</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-lg">📈</div>
          <div>
            <p className="text-xl font-bold text-gray-900">{MOCK_STATS.conversionRate}%</p>
            <p className="text-xs text-gray-500">Tỷ lệ chuyển đổi</p>
          </div>
        </div>
      </div>

      {/* Recent commissions */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Hoa hồng gần đây</h2>
          <a href="/portal/commissions" className="text-xs text-blue-500 hover:underline">Xem tất cả →</a>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500">
              <th className="text-left px-4 py-2.5 font-medium">Đơn hàng</th>
              <th className="text-left px-4 py-2.5 font-medium">Khách hàng</th>
              <th className="text-left px-4 py-2.5 font-medium">Ngày</th>
              <th className="text-right px-4 py-2.5 font-medium">Hoa hồng</th>
              <th className="text-center px-4 py-2.5 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {RECENT_COMMISSIONS.map((c) => {
              const s = STATUS_CFG[c.status as keyof typeof STATUS_CFG];
              return (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-blue-600 font-mono text-xs">{c.orderId}</td>
                  <td className="px-4 py-3 text-gray-700">{c.customer}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.date}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">{fmt(c.amount)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${s.className}`}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

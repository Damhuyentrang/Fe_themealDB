import { useState } from 'react';

type CommStatus = 'pending' | 'approved' | 'paid' | 'rejected';

interface CommissionItem {
  id: string;
  ctv: string;
  ctvCode: string;
  orderCode: string;
  orderValue: number;
  rate: number;
  amount: number;
  status: CommStatus;
  createdAt: string;
}

const STATUS_CFG: Record<CommStatus, { label: string; className: string }> = {
  pending:  { label: 'Chờ duyệt',    className: 'bg-yellow-50 text-yellow-600 border border-yellow-200' },
  approved: { label: 'Đã duyệt',     className: 'bg-blue-50 text-blue-600 border border-blue-200' },
  paid:     { label: 'Đã thanh toán', className: 'bg-green-50 text-green-600 border border-green-200' },
  rejected: { label: 'Từ chối',      className: 'bg-red-50 text-red-500 border border-red-200' },
};

const MOCK: CommissionItem[] = [
  { id: 'c1', ctv: 'Nguyễn Văn A', ctvCode: 'CTV001', orderCode: '#1001', orderValue: 500_000, rate: 10, amount: 50_000,  status: 'paid',     createdAt: '2026-06-01' },
  { id: 'c2', ctv: 'Nguyễn Văn A', ctvCode: 'CTV001', orderCode: '#1008', orderValue: 800_000, rate: 10, amount: 80_000,  status: 'approved', createdAt: '2026-06-05' },
  { id: 'c3', ctv: 'Trần Thị B',   ctvCode: 'CTV002', orderCode: '#1003', orderValue: 600_000, rate: 10, amount: 60_000,  status: 'pending',  createdAt: '2026-06-07' },
  { id: 'c4', ctv: 'Trần Thị B',   ctvCode: 'CTV002', orderCode: '#1005', orderValue: 400_000, rate: 10, amount: 40_000,  status: 'pending',  createdAt: '2026-06-08' },
];

type TabKey = 'all' | 'pending' | 'approved' | 'paid' | 'rejected';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',      label: 'Tất cả' },
  { key: 'pending',  label: 'Chờ duyệt' },
  { key: 'approved', label: 'Đã duyệt' },
  { key: 'paid',     label: 'Đã thanh toán' },
  { key: 'rejected', label: 'Từ chối' },
];

function Badge({ cfg }: { cfg: { label: string; className: string } }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>{cfg.label}</span>;
}

function fmt(v: number) { return `${v.toLocaleString('vi-VN')}đ`; }

export default function AffiliateCommissionsPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK.filter((c) => tab === 'all' || c.status === tab);

  const toggleAll = (ch: boolean) => setSelected(ch ? new Set(filtered.map((c) => c.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const totalPending = MOCK.filter((c) => c.status === 'pending').reduce((s, c) => s + c.amount, 0);
  const totalPaid    = MOCK.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Hoa hồng</h1>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Đã chọn {selected.size}</span>
            <button className="text-sm bg-blue-600 text-white rounded-md px-3 py-2 hover:bg-blue-700 font-medium">
              Duyệt hoa hồng
            </button>
            <button className="text-sm bg-green-600 text-white rounded-md px-3 py-2 hover:bg-green-700 font-medium">
              Đánh dấu đã thanh toán
            </button>
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Hoa hồng chờ duyệt</p>
          <p className="text-xl font-bold text-yellow-600 mt-1">{fmt(totalPending)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{MOCK.filter((c) => c.status === 'pending').length} yêu cầu</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Đã duyệt, chờ thanh toán</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{fmt(MOCK.filter((c) => c.status === 'approved').reduce((s, c) => s + c.amount, 0))}</p>
          <p className="text-xs text-gray-400 mt-0.5">{MOCK.filter((c) => c.status === 'approved').length} giao dịch</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Đã thanh toán (tổng)</p>
          <p className="text-xl font-bold text-green-600 mt-1">{fmt(totalPaid)}</p>
          <p className="text-xs text-gray-400 mt-0.5">{MOCK.filter((c) => c.status === 'paid').length} giao dịch</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 flex">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${tab === t.key ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={(e) => toggleAll(e.target.checked)} />
              </th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Cộng tác viên</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Mã đơn hàng</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Giá trị đơn</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Tỷ lệ HH</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Hoa hồng</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Trạng thái</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Ngày tạo</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3"><input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleOne(c.id)} /></td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800 text-xs">{c.ctv}</div>
                  <div className="text-gray-400 text-xs">{c.ctvCode}</div>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline">{c.orderCode}</button>
                </td>
                <td className="px-4 py-3 text-right text-gray-700">{fmt(c.orderValue)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{c.rate}%</td>
                <td className="px-4 py-3 text-right font-medium text-green-600">{fmt(c.amount)}</td>
                <td className="px-4 py-3"><Badge cfg={STATUS_CFG[c.status]} /></td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="px-4 py-3">
                  {c.status === 'pending' && (
                    <div className="flex items-center gap-1">
                      <button className="text-xs text-blue-600 hover:underline">Duyệt</button>
                      <span className="text-gray-300">|</span>
                      <button className="text-xs text-red-500 hover:underline">Từ chối</button>
                    </div>
                  )}
                  {c.status === 'approved' && (
                    <button className="text-xs text-green-600 hover:underline">Đánh dấu đã TT</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
          <span>Từ {filtered.length > 0 ? 1 : 0} đến {filtered.length} trên tổng {MOCK.length}</span>
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-sm outline-none"><option>20</option><option>50</option></select>
            <span>Kết quả</span>
            <div className="ml-4"><button className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium">1</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}

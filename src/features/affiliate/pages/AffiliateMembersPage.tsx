import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

type MemberStatus = 'active' | 'pending' | 'locked';

interface Member {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  referralCode: string;
  orders: number;
  revenue: number;
  commissionRate: number;
  commission: number;
  status: MemberStatus;
  joinedAt: string;
}

const STATUS_CFG: Record<MemberStatus, { label: string; className: string }> = {
  active:  { label: 'Đang hoạt động', className: 'bg-green-50 text-green-600 border border-green-200' },
  pending: { label: 'Chờ duyệt',      className: 'bg-yellow-50 text-yellow-600 border border-yellow-200' },
  locked:  { label: 'Đã khóa',        className: 'bg-red-50 text-red-500 border border-red-200' },
};

const MOCK: Member[] = [
  { id: 'm1', code: 'CTV001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'nva@email.com', referralCode: 'REF-NVA', orders: 7,  revenue: 2_800_000, commissionRate: 10, commission: 280_000, status: 'active',  joinedAt: '2026-04-01' },
  { id: 'm2', code: 'CTV002', name: 'Trần Thị B',   phone: '0912345678', email: 'ttb@email.com', referralCode: 'REF-TTB', orders: 5,  revenue: 2_000_000, commissionRate: 10, commission: 200_000, status: 'active',  joinedAt: '2026-04-15' },
  { id: 'm3', code: 'CTV003', name: 'Lê Văn C',     phone: '0923456789', email: 'lvc@email.com', referralCode: 'REF-LVC', orders: 0,  revenue: 0,          commissionRate: 8,  commission: 0,       status: 'pending', joinedAt: '2026-06-01' },
];

type TabKey = 'all' | 'active' | 'pending' | 'locked';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang hoạt động' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'locked', label: 'Đã khóa' },
];

function Badge({ cfg }: { cfg: { label: string; className: string } }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>{cfg.label}</span>;
}

function fmt(v: number) { return v > 0 ? `${v.toLocaleString('vi-VN')}đ` : '0đ'; }

export default function AffiliateMembersPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK.filter((m) => {
    if (tab !== 'all' && m.status !== tab) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.phone.includes(q);
    }
    return true;
  });

  const toggleAll = (c: boolean) => setSelected(c ? new Set(filtered.map((m) => m.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Cộng tác viên</h1>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5 text-gray-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Xuất file
          </button>
          <Link
            to={`${ROUTES.AFFILIATE_MEMBERS}/create`}
            className="flex items-center gap-1.5 text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
          >
            <span className="text-base leading-none">⊕</span> Thêm cộng tác viên
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 flex">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${tab === t.key ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.label}
              {t.key !== 'all' && (
                <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">
                  {MOCK.filter((m) => m.status === t.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input type="search" placeholder="Tìm theo tên, mã CTV, số điện thoại" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400" />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Trạng thái <span className="text-gray-400 text-xs">▾</span>
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Ngày tham gia <span className="text-gray-400 text-xs">▾</span>
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={(e) => toggleAll(e.target.checked)} />
              </th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Mã CTV</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Tên CTV</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Liên hệ</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Mã giới thiệu</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide">Số đơn</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide">Doanh thu</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">HH (%)</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Hoa hồng</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3"><input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleOne(m.id)} /></td>
                <td className="px-4 py-3">
                  <Link to={`${ROUTES.AFFILIATE_MEMBERS}/${m.id}`} className="text-blue-600 hover:underline font-medium">{m.code}</Link>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{m.name}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-700 text-xs">{m.phone}</div>
                  <div className="text-gray-400 text-xs">{m.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{m.referralCode}</code>
                    <button className="text-gray-400 hover:text-blue-500 text-xs" title="Sao chép">⎘</button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-700">{m.orders}</td>
                <td className="px-4 py-3 text-right text-gray-700">{fmt(m.revenue)}</td>
                <td className="px-4 py-3 text-right text-gray-700">{m.commissionRate}%</td>
                <td className="px-4 py-3 text-right font-medium text-green-600">{fmt(m.commission)}</td>
                <td className="px-4 py-3"><Badge cfg={STATUS_CFG[m.status]} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400">Không tìm thấy cộng tác viên nào</td></tr>
            )}
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

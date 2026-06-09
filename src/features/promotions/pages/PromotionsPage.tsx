import { useState } from 'react';
import { Link } from 'react-router-dom';
import PromotionsFilterDrawer, { EMPTY_FILTERS, PromotionsFilters } from '../components/PromotionsFilterDrawer';

type PromoStatus = 'active' | 'inactive' | 'stopped';
type PromoTab = 'all' | 'active' | 'inactive' | 'stopped';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: string;
  status: PromoStatus;
  usedCount: number;
  combinedWith: string | null;
  startDate: string | null;
  endDate: string | null;
}

const STATUS_CFG: Record<PromoStatus, { label: string; className: string }> = {
  active:   { label: 'Đang áp dụng',  className: 'bg-blue-50 text-blue-600 border border-blue-300' },
  inactive: { label: 'Chưa áp dụng',  className: 'bg-yellow-50 text-yellow-600 border border-yellow-300' },
  stopped:  { label: 'Ngừng áp dụng', className: 'bg-gray-100 text-gray-500 border border-gray-300' },
};

const TABS: { key: PromoTab; label: string }[] = [
  { key: 'all',      label: 'Tất cả' },
  { key: 'active',   label: 'Đang áp dụng' },
  { key: 'inactive', label: 'Chưa áp dụng' },
  { key: 'stopped',  label: 'Ngừng áp dụng' },
];

const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    name: '50%',
    description: 'Giảm 0% cho toàn bộ đơn hàng',
    type: 'Giảm giá đơn hàng',
    status: 'active',
    usedCount: 0,
    combinedWith: null,
    startDate: '2026-06-05T17:17:00',
    endDate: null,
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function PromotionsPage() {
  const [tab, setTab] = useState<PromoTab>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<PromotionsFilters>(EMPTY_FILTERS);

  const activeFilterCount = [
    activeFilters.hinhThuc.length,
    activeFilters.loaiKhuyenMai.length,
    activeFilters.trangThai.length,
    (activeFilters.ngayBatDauFrom || activeFilters.ngayBatDauTo) ? 1 : 0,
    (activeFilters.soLanMin || activeFilters.soLanMax) ? 1 : 0,
    (activeFilters.giaTriMin || activeFilters.giaTriMax) ? 1 : 0,
    activeFilters.kenhBanHang.length,
  ].reduce((a, b) => a + b, 0);

  const filtered = MOCK_PROMOTIONS.filter((p) => {
    if (tab !== 'all' && p.status !== tab) return false;
    if (search) return p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const toggleAll = (c: boolean) => setSelected(c ? new Set(filtered.map((p) => p.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh sách khuyến mại</h1>
        <div className="flex items-center gap-2">
          <Link
            to="/promotions/create"
            className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium flex items-center gap-1.5"
          >
            ＋ Tạo khuyến mại
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-4 flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors whitespace-nowrap ${
                tab === t.key
                  ? 'border-blue-500 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm kiếm khuyến mại"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Hình thức ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Loại khuyến mại ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Ngày bắt đầu ▾
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className={`text-sm border rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeFilterCount > 0 ? 'border-blue-400 text-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Bộ lọc khác
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 font-medium leading-none">{activeFilterCount}</span>
            )}
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
              <th className="px-4 py-3 text-left">Khuyến mại</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Loại khuyến mại</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Đã dùng</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Kết hợp với</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Ngày bắt đầu ↕</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Ngày kết thúc ↕</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((promo) => {
              const status = STATUS_CFG[promo.status];
              return (
                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(promo.id)}
                      onChange={() => toggleOne(promo.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-sm shrink-0 mt-0.5">
                        ✦
                      </div>
                      <div>
                        <Link
                          to={`/promotions/${promo.id}`}
                          className="text-blue-600 hover:underline font-medium block"
                        >
                          {promo.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{promo.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{promo.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">{promo.usedCount}</td>
                  <td className="px-4 py-3 text-gray-400">{promo.combinedWith ?? '---'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {promo.startDate ? formatDate(promo.startDate) : '---'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{promo.endDate ? formatDate(promo.endDate) : '---'}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy khuyến mại nào
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
        <button className="text-blue-500 hover:underline">khuyến mại</button>
      </p>

      <PromotionsFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={setActiveFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
}

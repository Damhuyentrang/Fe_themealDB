import { useState } from 'react';
import { Link } from 'react-router-dom';
import DraftMoreFiltersDrawer from '../components/DraftMoreFiltersDrawer';

type DraftStatus = 'incomplete' | 'complete';

interface DraftOrder {
  id: string;
  code: string;
  customCode?: string;
  updatedAt: string;
  customer?: string;
  status: DraftStatus;
  total: number;
}

const STATUS_CONFIG: Record<DraftStatus, { label: string; className: string }> = {
  incomplete: { label: 'Chưa hoàn thành', className: 'text-yellow-600 border border-yellow-400 bg-yellow-50' },
  complete:   { label: 'Hoàn thành',      className: 'text-green-600 border border-green-400 bg-green-50' },
};

const MOCK_DRAFTS: DraftOrder[] = [
  { id: 'd3', code: '#D3', updatedAt: '2026-06-05T16:23:00', status: 'incomplete', total: 1_000_000 },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function DraftOrderListPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  const filtered = MOCK_DRAFTS.filter(
    (d) =>
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      (d.customer ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(filtered.map((d) => d.id)) : new Set());

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh sách đơn hàng nháp</h1>
        <div className="flex items-center gap-2">
          <Link
            to="/orders/draft/create"
            className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium flex items-center gap-1"
          >
            ＋ Thêm đơn hàng nháp
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
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
              placeholder="Tìm kiếm theo mã đơn hàng nháp, SĐT khách hàng,..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Ngày tạo ▾
          </button>
          <button
            onClick={() => setMoreFiltersOpen(true)}
            className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap"
          >
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
              <th className="px-4 py-3 text-left">Mã đơn nháp</th>
              <th className="px-4 py-3 text-left">Mã đơn tùy chỉnh</th>
              <th className="px-4 py-3 text-left">Ngày cập nhật</th>
              <th className="px-4 py-3 text-left">Khách hàng</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((draft) => {
              const status = STATUS_CONFIG[draft.status];
              return (
                <tr key={draft.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(draft.id)}
                      onChange={() => toggleOne(draft.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/orders/draft/${draft.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {draft.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{draft.customCode ?? ''}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(draft.updatedAt)}</td>
                  <td className="px-4 py-3 text-gray-500">{draft.customer ?? '---'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {draft.total.toLocaleString('vi-VN')}đ
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy đơn hàng nháp nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
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
      </div>

      <DraftMoreFiltersDrawer
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        onApply={() => {}}
        onClear={() => {}}
      />
    </div>
  );
}

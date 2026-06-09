import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  quantity: number;
  condition: 'manual' | 'auto' | null;
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Cân',   quantity: 0, condition: null },
  { id: '2', name: 'Vòngd', quantity: 0, condition: null },
  { id: '3', name: 'Nhẫn',  quantity: 1, condition: null },
  { id: '4', name: 'Combo', quantity: 1, condition: null },
];

function ImagePlaceholder() {
  return (
    <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-300 shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    </div>
  );
}

export default function ProductCategoriesPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(filtered.map((c) => c.id)) : new Set());

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
        <h1 className="text-xl font-semibold text-gray-800">Danh mục sản phẩm</h1>
        <Link
          to="/products/categories/create"
          className="flex items-center gap-1.5 text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
        >
          <span className="text-base leading-none">⊕</span> Thêm danh mục
        </Link>
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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Tìm kiếm danh mục sản phẩm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Loại danh mục <span className="text-gray-400">▾</span>
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Kênh bán hàng <span className="text-gray-400">▾</span>
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Lưu bộ lọc
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th className="w-10 px-2 py-3" />
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Danh mục</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Số lượng</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Điều kiện áp dụng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(cat.id)}
                    onChange={() => toggleOne(cat.id)}
                  />
                </td>
                <td className="px-2 py-3">
                  <ImagePlaceholder />
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/products/categories/${cat.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {cat.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{cat.quantity}</td>
                <td className="px-4 py-3 text-gray-400">—</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy danh mục nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
          <span>
            Từ {filtered.length > 0 ? 1 : 0} đến {filtered.length} trên tổng {MOCK_CATEGORIES.length}
          </span>
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-sm outline-none">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>Kết quả</span>
            <div className="ml-4">
              <button className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                1
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">
        Tìm hiểu thêm về{' '}
        <button className="text-blue-500 hover:underline">danh mục sản phẩm</button>
      </p>
    </div>
  );
}

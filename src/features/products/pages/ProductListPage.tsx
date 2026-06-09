import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductFiltersStore } from '../store/productFilters.store';
import type { Product } from '../types/product.types';
import MoreFiltersDrawer from '../components/MoreFiltersDrawer';

// Mock data — replace with React Query + API later
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Vòng H59', availableQty: 10, category: 'Vòng', variants: ['vàng', 'bạc', 'đỏ'], createdAt: '2026-06-09', status: 'active' },
  { id: '2', name: 'ring R10', availableQty: 30, category: 'Nhẫn', variants: ['to', 'nhỏ'], createdAt: '2026-06-08', status: 'active' },
  { id: '3', name: 'nhẫn', availableQty: 0, category: 'Nhẫn', createdAt: '2026-06-03', status: 'active' },
  { id: '4', name: 'Cân', availableQty: 49, category: 'Cân', createdAt: '2026-06-03', status: 'active' },
  { id: '5', name: 'Vòng tay', availableQty: 95, category: 'Vòng', variants: ['xanh', 'đỏ', 'vàng', 'trắng'], createdAt: '2026-06-03', status: 'active' },
  { id: '6', name: 'The Ring', availableQty: 0, category: 'Nhẫn', createdAt: '2026-06-03', status: 'active' },
];

function ProductImagePlaceholder() {
  return (
    <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-300 text-lg shrink-0">
      🖼
    </div>
  );
}

export default function ProductListPage() {
  const { filters, setSearch, setPage } = useProductFiltersStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  const filtered = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(filters.search.toLowerCase()),
  );

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(filtered.map((p) => p.id)) : new Set());
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh sách sản phẩm</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex">
            <Link
              to="/products/create"
              className="text-sm bg-blue-600 text-white rounded-l-md px-4 py-2 hover:bg-blue-700 font-medium flex items-center gap-1"
            >
              ＋ Thêm sản phẩm
            </Link>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="text-sm bg-blue-600 text-white rounded-r-md px-2 py-2 hover:bg-blue-700 border-l border-blue-500"
            >
              ▾
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg text-sm w-48 z-10">
                <Link to="/products/create" className="block px-4 py-2 hover:bg-gray-50">
                  Thêm sản phẩm
                </Link>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Nhập từ file</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-4">
          <div className="flex">
            <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-blue-500 text-blue-600 -mb-px">
              Tất cả
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Kênh bán hàng ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Loại sản phẩm ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
            Tag ▾
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
              <th className="px-4 py-3 text-left">Sản phẩm</th>
              <th className="px-4 py-3 text-center">Có thể bán</th>
              <th className="px-4 py-3 text-left">Loại</th>
              <th className="px-4 py-3 text-left">Danh mục</th>
              <th className="px-4 py-3 text-left">Ngày khởi tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={() => toggleOne(product.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductImagePlaceholder />
                    <Link
                      to={`/products/${product.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {product.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-700">{product.availableQty}</td>
                <td className="px-4 py-3 text-gray-500">
                  {product.variants?.join(', ') ?? ''}
                </td>
                <td className="px-4 py-3 text-gray-500">{product.category ?? ''}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(product.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
          <span>
            Từ {filtered.length > 0 ? (filters.page - 1) * filters.limit + 1 : 0} đến{' '}
            {Math.min(filters.page * filters.limit, filtered.length)} trên tổng {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-sm">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>Kết quả</span>
            <div className="ml-4">
              <button
                onClick={() => setPage(1)}
                className="w-8 h-8 rounded bg-blue-600 text-white text-sm font-medium"
              >
                1
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-center text-sm text-gray-400">
        Tìm hiểu thêm về{' '}
        <button className="text-blue-500 hover:underline">sản phẩm</button>
      </p>

      <MoreFiltersDrawer
        open={moreFiltersOpen}
        onClose={() => setMoreFiltersOpen(false)}
        onApply={() => {}}
        onClear={() => {}}
      />
    </div>
  );
}

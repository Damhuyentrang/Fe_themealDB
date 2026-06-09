import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Supplier {
  id: string;
  code: string;
  name: string;
  status: 'active' | 'inactive';
  phone: string;
  email: string;
}

const MOCK: Supplier[] = [
  { id: 's1', code: 'SUP00001', name: 'ABC', status: 'active', phone: '', email: '' },
];

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return status === 'active' ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
      Đang hoạt động
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
      Ngừng hoạt động
    </span>
  );
}

export default function SupplierListPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.phone.includes(q);
  });

  const toggleAll = (c: boolean) => setSelected(c ? new Set(filtered.map((s) => s.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh sách nhà cung cấp</h1>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 whitespace-nowrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Xuất file
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 whitespace-nowrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Nhập file
          </button>
          <Link
            to="/inventory/suppliers/create"
            className="flex items-center gap-1.5 text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium whitespace-nowrap"
          >
            <span className="text-base leading-none">⊕</span> Thêm nhà cung cấp
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tab */}
        <div className="border-b border-gray-200 px-4">
          <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-blue-500 text-blue-600 -mb-px">
            Tất cả
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="search"
              placeholder="Tìm kiếm theo tên, mã, SĐT nhà cung cấp"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Ngày tạo <span className="text-gray-400 text-xs">▾</span>
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Nhân viên phụ trách <span className="text-gray-400 text-xs">▾</span>
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Tags <span className="text-gray-400 text-xs">▾</span>
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
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Mã NCC</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Tên NCC</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Trạng thái</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Số điện thoại</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleOne(s.id)} />
                </td>
                <td className="px-4 py-3">
                  <Link to={`/inventory/suppliers/${s.id}`} className="text-blue-600 hover:underline font-medium">
                    {s.code}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{s.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3 text-gray-500">{s.phone || ''}</td>
                <td className="px-4 py-3 text-gray-500">{s.email || ''}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy nhà cung cấp nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
          <span>Từ {filtered.length > 0 ? 1 : 0} đến {filtered.length} trên tổng {MOCK.length}</span>
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-sm outline-none">
              <option>20</option><option>50</option><option>100</option>
            </select>
            <span>Kết quả</span>
            <div className="ml-4">
              <button className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium">1</button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">
        Tìm hiểu thêm về{' '}
        <button className="text-blue-500 hover:underline">nhà cung cấp</button>
      </p>
    </div>
  );
}

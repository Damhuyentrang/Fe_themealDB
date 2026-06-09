import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import PurchaseOrderFilterDrawer, { EMPTY_PO_FILTERS, PurchaseOrderFilters } from '../components/PurchaseOrderFilterDrawer';

type OrderStatus = 'processing' | 'completed' | 'cancelled';
type StockStatus = 'not_imported' | 'partial' | 'imported';

interface PurchaseOrder {
  id: string;
  code: string;
  createdAt: string;
  branch: string;
  status: OrderStatus;
  stockStatus: StockStatus;
  supplier: string;
  supplierId: string;
  createdBy: string;
  importQty: number;
  total: number;
}

const STATUS_CFG: Record<OrderStatus, { label: string; className: string }> = {
  processing: { label: 'Đang giao dịch', className: 'bg-blue-50 text-blue-600 border border-blue-200' },
  completed:  { label: 'Hoàn thành',     className: 'bg-green-50 text-green-600 border border-green-200' },
  cancelled:  { label: 'Đã hủy',         className: 'bg-red-50 text-red-500 border border-red-200' },
};

const STOCK_STATUS_CFG: Record<StockStatus, { label: string; className: string }> = {
  not_imported: { label: 'Chưa nhập',   className: 'bg-orange-50 text-orange-500 border border-orange-200' },
  partial:      { label: 'Nhập một phần', className: 'bg-blue-50 text-blue-500 border border-blue-200' },
  imported:     { label: 'Đã nhập',     className: 'bg-green-50 text-green-600 border border-green-200' },
};

const MOCK: PurchaseOrder[] = [
  {
    id: '1',
    code: 'REI00001',
    createdAt: '2026-06-08T11:15:00',
    branch: 'Cửa hàng chính',
    status: 'processing',
    stockStatus: 'not_imported',
    supplier: 'ABC',
    supplierId: 's1',
    createdBy: 'Trang Đàm',
    importQty: 10,
    total: 0,
  },
];

type TabKey = 'all' | 'processing' | 'completed';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'processing', label: 'Đang giao dịch' },
  { key: 'completed',  label: 'Hoàn thành' },
];

function Badge({ cfg }: { cfg: { label: string; className: string } }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function fmt(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function PurchaseOrderListPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<PurchaseOrderFilters>(EMPTY_PO_FILTERS);

  const activeFilterCount = [
    activeFilters.trangThai.length, activeFilters.trangThaiNhap.length,
    activeFilters.chiNhanh.length, activeFilters.nhaCungCap.length,
    (activeFilters.ngayTaoFrom || activeFilters.ngayTaoTo) ? 1 : 0,
    (activeFilters.ngayNhapFrom || activeFilters.ngayNhapTo) ? 1 : 0,
    (activeFilters.ngayHoaDonFrom || activeFilters.ngayHoaDonTo) ? 1 : 0,
    activeFilters.sanPham ? 1 : 0,
    activeFilters.nhanVienTao.length, activeFilters.nhanVienNhap.length,
    activeFilters.nhanVienPhuTrach.length, activeFilters.tags.length,
    activeFilters.trangThaiThanhToan.length, activeFilters.trangThaiHoanHang.length,
  ].reduce((a, b) => a + b, 0);

  const filtered = MOCK.filter((o) => {
    if (tab === 'processing' && o.status !== 'processing') return false;
    if (tab === 'completed' && o.status !== 'completed') return false;
    if (search) {
      const q = search.toLowerCase();
      return o.code.toLowerCase().includes(q) || o.supplier.toLowerCase().includes(q) || o.createdBy.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleAll = (c: boolean) => setSelected(c ? new Set(filtered.map((o) => o.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh sách đơn nhập hàng</h1>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5 whitespace-nowrap text-gray-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Xuất file
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5 whitespace-nowrap text-gray-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Nhập file
          </button>
          <Link
            to={ROUTES.PURCHASE_ORDER_CREATE}
            className="flex items-center gap-1.5 text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium whitespace-nowrap"
          >
            <span className="text-base leading-none">⊕</span> Tạo đơn nhập hàng
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
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
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
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="search"
              placeholder="Tìm kiếm theo mã đơn nhập, tên, SĐT, mã NCC"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Trạng thái nhập <span className="text-gray-400 text-xs">▾</span>
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Ngày tạo <span className="text-gray-400 text-xs">▾</span>
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
            Sản phẩm <span className="text-gray-400 text-xs">▾</span>
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs">
                <th className="w-8 px-3 py-3">
                  <button className="text-gray-400 hover:text-gray-600">⚙</button>
                </th>
                <th className="w-8 px-2 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
                <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Mã đơn nhập</th>
                <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Ngày tạo</th>
                <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Chi nhánh nhập</th>
                <th className="px-3 py-3 text-left font-medium uppercase tracking-wide">Trạng thái</th>
                <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Trạng thái nhập</th>
                <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Nhà cung cấp</th>
                <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Nhân viên tạo</th>
                <th className="px-3 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Số lượng nhập</th>
                <th className="px-3 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Giá trị đơn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3" />
                  <td className="px-2 py-3">
                    <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleOne(o.id)} />
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to={ROUTES.PURCHASE_ORDER_DETAIL.replace(':id', o.id)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {o.code}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{fmt(o.createdAt)}</td>
                  <td className="px-3 py-3 text-gray-700">{o.branch}</td>
                  <td className="px-3 py-3">
                    <Badge cfg={STATUS_CFG[o.status]} />
                  </td>
                  <td className="px-3 py-3">
                    <Badge cfg={STOCK_STATUS_CFG[o.stockStatus]} />
                  </td>
                  <td className="px-3 py-3">
                    <Link to={`/inventory/suppliers/${o.supplierId}`} className="text-blue-600 hover:underline">
                      {o.supplier}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-gray-700">{o.createdBy}</td>
                  <td className="px-3 py-3 text-right text-gray-700">{o.importQty}</td>
                  <td className="px-3 py-3 text-right text-gray-700">
                    {o.total > 0 ? `${o.total.toLocaleString('vi-VN')}đ` : '0đ'}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-gray-400">
                    Không tìm thấy đơn nhập hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
        <button className="text-blue-500 hover:underline">đơn nhập hàng</button>
      </p>

      <PurchaseOrderFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={setActiveFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
}

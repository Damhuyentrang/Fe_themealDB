import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type ReturnStatus = 'processing' | 'completed' | 'cancelled';
type StockStatus = 'not_exported' | 'partial' | 'exported';

interface PurchaseReturn {
  id: string;
  code: string;
  createdAt: string;
  branch: string;
  status: ReturnStatus;
  stockStatus: StockStatus;
  supplier: string;
  supplierId: string;
  createdBy: string;
  qty: number;
  total: number;
}

const STATUS_CFG: Record<ReturnStatus, { label: string; className: string }> = {
  processing: { label: 'Đang giao dịch', className: 'bg-blue-50 text-blue-600 border border-blue-200' },
  completed:  { label: 'Hoàn thành',     className: 'bg-green-50 text-green-600 border border-green-200' },
  cancelled:  { label: 'Đã hủy',         className: 'bg-red-50 text-red-500 border border-red-200' },
};

const STOCK_STATUS_CFG: Record<StockStatus, { label: string; className: string }> = {
  not_exported: { label: 'Chưa xuất',      className: 'bg-orange-50 text-orange-500 border border-orange-200' },
  partial:      { label: 'Xuất một phần',  className: 'bg-blue-50 text-blue-500 border border-blue-200' },
  exported:     { label: 'Đã xuất',        className: 'bg-green-50 text-green-600 border border-green-200' },
};

const MOCK: PurchaseReturn[] = [];

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

function EmptyState({ onDropdown }: { onDropdown: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Icon */}
      <div className="relative">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="20" width="48" height="36" rx="4" fill="#F59E0B" />
          <rect x="16" y="12" width="32" height="14" rx="3" fill="#FBBF24" />
          <path d="M24 20h16" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="48" cy="44" r="12" fill="#3B82F6" />
          <path d="M48 38v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-gray-700">Cửa hàng của bạn chưa có đơn trả hàng nhập nào</p>
        <p className="text-xs text-gray-500 max-w-sm">
          Tạo đơn trả hàng nhập từ nhà cung cấp để ghi nhận xuất kho trả hàng và nhận lại tiền hoàn
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 text-gray-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Nhập file
        </button>
        <div className="relative">
          <div className="flex">
            <button className="flex items-center gap-1.5 text-sm bg-blue-600 text-white rounded-l-md px-4 py-2 hover:bg-blue-700 font-medium whitespace-nowrap">
              <span className="text-base leading-none">⊕</span> Tạo đơn trả hàng nhập
            </button>
            <button
              onClick={onDropdown}
              className="flex items-center px-2 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 border-l border-blue-500"
            >
              <span className="text-xs">▾</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PurchaseReturnListPage() {
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = MOCK.filter((o) => {
    if (tab === 'processing' && o.status !== 'processing') return false;
    if (tab === 'completed' && o.status !== 'completed') return false;
    if (search) {
      const q = search.toLowerCase();
      return o.code.toLowerCase().includes(q) || o.supplier.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleAll = (c: boolean) => setSelected(c ? new Set(filtered.map((o) => o.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const isEmpty = MOCK.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Danh sách đơn trả hàng nhập</h1>
        {!isEmpty && (
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
            <div className="relative" ref={dropdownRef}>
              <div className="flex">
                <Link
                  to="/inventory/return-orders/create"
                  className="flex items-center gap-1.5 text-sm bg-blue-600 text-white rounded-l-md px-4 py-2 hover:bg-blue-700 font-medium whitespace-nowrap"
                >
                  <span className="text-base leading-none">⊕</span> Tạo đơn trả hàng nhập
                </Link>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center px-2 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 border-l border-blue-500"
                >
                  <span className="text-xs">▾</span>
                </button>
              </div>
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg text-sm w-52 z-20">
                  <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                    Trả hàng nhập theo đơn
                  </button>
                  <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 border-t border-gray-100">
                    Trả hàng nhập không theo đơn
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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

        {isEmpty ? (
          /* Empty state with dropdown in the middle */
          <div className="relative">
            {/* Skeleton filter bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 opacity-30 pointer-events-none select-none">
              <div className="h-8 flex-1 bg-gray-100 rounded-md" />
              <div className="h-8 w-28 bg-gray-100 rounded-md" />
              <div className="h-8 w-24 bg-gray-100 rounded-md" />
              <div className="h-8 w-20 bg-gray-100 rounded-md" />
              <div className="h-8 w-32 bg-gray-100 rounded-md" />
              <div className="h-8 w-24 bg-gray-100 rounded-md" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 opacity-20 pointer-events-none">
              <div className="h-6 w-24 bg-gray-100 rounded" />
              <div className="h-6 w-28 bg-gray-100 rounded" />
            </div>

            {/* Empty state with dropdown */}
            <div className="relative flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="20" width="48" height="36" rx="4" fill="#F59E0B" />
                  <rect x="16" y="12" width="32" height="14" rx="3" fill="#FBBF24" />
                  <path d="M24 20h16" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="48" cy="44" r="12" fill="#3B82F6" />
                  <path d="M44 44h8M48 40v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-gray-700">Cửa hàng của bạn chưa có đơn trả hàng nhập nào</p>
                <p className="text-xs text-gray-500 max-w-sm">
                  Tạo đơn trả hàng nhập từ nhà cung cấp để ghi nhận xuất kho trả hàng và nhận lại tiền hoàn
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 text-gray-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Nhập file
                </button>
                <div className="relative">
                  <div className="flex">
                    <button className="flex items-center gap-1.5 text-sm bg-blue-600 text-white rounded-l-md px-4 py-2 hover:bg-blue-700 font-medium whitespace-nowrap">
                      <span className="text-base leading-none">⊕</span> Tạo đơn trả hàng nhập
                    </button>
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      className="flex items-center px-2 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 border-l border-blue-500"
                    >
                      <span className="text-xs">▾</span>
                    </button>
                  </div>
                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg text-sm w-52 z-20">
                      <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                        Trả hàng nhập theo đơn
                      </button>
                      <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 border-t border-gray-100">
                        Trả hàng nhập không theo đơn
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Tìm kiếm theo mã đơn trả, tên, SĐT, mã NCC"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
                />
              </div>
              <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
                Trạng thái <span className="text-gray-400 text-xs">▾</span>
              </button>
              <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
                Ngày tạo <span className="text-gray-400 text-xs">▾</span>
              </button>
              <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap flex items-center gap-1">
                Sản phẩm <span className="text-gray-400 text-xs">▾</span>
              </button>
              <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
                Lưu bộ lọc
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1000px]">
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
                    <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Mã đơn trả</th>
                    <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Ngày tạo</th>
                    <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Chi nhánh</th>
                    <th className="px-3 py-3 text-left font-medium uppercase tracking-wide">Trạng thái</th>
                    <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Trạng thái xuất kho</th>
                    <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Nhà cung cấp</th>
                    <th className="px-3 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Nhân viên tạo</th>
                    <th className="px-3 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Số lượng</th>
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
                        <Link to={`/inventory/return-orders/${o.id}`} className="text-blue-600 hover:underline font-medium">
                          {o.code}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{fmt(o.createdAt)}</td>
                      <td className="px-3 py-3 text-gray-700">{o.branch}</td>
                      <td className="px-3 py-3"><Badge cfg={STATUS_CFG[o.status]} /></td>
                      <td className="px-3 py-3"><Badge cfg={STOCK_STATUS_CFG[o.stockStatus]} /></td>
                      <td className="px-3 py-3">
                        <Link to={`/inventory/suppliers/${o.supplierId}`} className="text-blue-600 hover:underline">
                          {o.supplier}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-gray-700">{o.createdBy}</td>
                      <td className="px-3 py-3 text-right text-gray-700">{o.qty}</td>
                      <td className="px-3 py-3 text-right text-gray-700">
                        {o.total > 0 ? `${o.total.toLocaleString('vi-VN')}đ` : '0đ'}
                      </td>
                    </tr>
                  ))}
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
          </>
        )}
      </div>

      <p className="text-center text-sm text-gray-400">
        Tìm hiểu thêm về{' '}
        <button className="text-blue-500 hover:underline">đơn trả hàng nhập</button>
      </p>
    </div>
  );
}

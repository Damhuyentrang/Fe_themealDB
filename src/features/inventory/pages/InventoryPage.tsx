import { useState } from 'react';
import InventoryFilterDrawer, { EMPTY_INVENTORY_FILTERS, InventoryFilters } from '../components/InventoryFilterDrawer';

type StockTab = 'all' | 'in_stock' | 'out_of_stock';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  unit: string;
  batchManaged: boolean;
  stock: number;
  available: number;
  unavailable: number;
  inTransaction: number;
  incoming: number;
  packing: number;
  location: string;
  salePrice: number;
  costPrice: number;
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'nhẫn',    sku: '', barcode: '', unit: '', batchManaged: false, stock: 0,   available: 0,  unavailable: 0, inTransaction: 0, incoming: 0, packing: 0, location: '', salePrice: 0,         costPrice: 0 },
  { id: '2', name: 'Cân',     sku: '', barcode: '', unit: '', batchManaged: false, stock: 50,  available: 49, unavailable: 0, inTransaction: 1, incoming: 0, packing: 0, location: '', salePrice: 1_000_000,  costPrice: 200_000 },
  { id: '3', name: 'Vòng tay',sku: '', barcode: '', unit: '', batchManaged: false, stock: 100, available: 95, unavailable: 0, inTransaction: 5, incoming: 0, packing: 0, location: '', salePrice: 2_000_000,  costPrice: 700_000 },
  { id: '4', name: 'The Ring',sku: '', barcode: '', unit: '', batchManaged: false, stock: 0,   available: 0,  unavailable: 0, inTransaction: 0, incoming: 0, packing: 0, location: '', salePrice: 900_000,    costPrice: 500_000 },
];

const TABS: { key: StockTab; label: string }[] = [
  { key: 'all',          label: 'Tất cả' },
  { key: 'in_stock',     label: 'Còn hàng' },
  { key: 'out_of_stock', label: 'Hết hàng' },
];

function fmt(v: number) {
  return v > 0 ? `${v.toLocaleString('vi-VN')}đ` : '0đ';
}

function EditableStock({ value }: { value: number }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
        className="w-16 text-center border border-blue-400 rounded px-1 py-0.5 text-sm outline-none"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-1 hover:text-blue-500 group"
    >
      <span>{val}</span>
      <span className="text-gray-300 group-hover:text-blue-400 text-xs">✎</span>
    </button>
  );
}

function ExpandableCount({ value }: { value: number }) {
  const [open, setOpen] = useState(false);
  if (value === 0) return <span>0</span>;
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="flex items-center gap-0.5 text-gray-700 hover:text-blue-500"
    >
      {value}
      <span className="text-gray-400 text-xs">{open ? '▲' : '▾'}</span>
    </button>
  );
}

export default function InventoryPage() {
  const [tab, setTab] = useState<StockTab>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<InventoryFilters>(EMPTY_INVENTORY_FILTERS);

  const activeFilterCount = [
    (activeFilters.ngayTaoFrom || activeFilters.ngayTaoTo) ? 1 : 0,
    (activeFilters.tonKhoMin || activeFilters.tonKhoMax) ? 1 : 0,
    (activeFilters.dangVeKhoMin || activeFilters.dangVeKhoMax) ? 1 : 0,
    (activeFilters.coTheBanMin || activeFilters.coTheBanMax) ? 1 : 0,
    (activeFilters.khongTheBanMin || activeFilters.khongTheBanMax) ? 1 : 0,
    (activeFilters.dangGiaoDichMin || activeFilters.dangGiaoDichMax) ? 1 : 0,
    (activeFilters.dangDongGoiMin || activeFilters.dangDongGoiMax) ? 1 : 0,
    activeFilters.quanLyLo.length,
    activeFilters.loaiSanPham.length,
    activeFilters.nhanHieu.length,
    activeFilters.tags.length,
  ].reduce((a, b) => a + b, 0);

  const filtered = MOCK_INVENTORY.filter((item) => {
    if (tab === 'in_stock' && item.stock <= 0) return false;
    if (tab === 'out_of_stock' && item.stock > 0) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleAll = (c: boolean) => setSelected(c ? new Set(filtered.map((i) => i.id)) : new Set());
  const toggleOne = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Quản lý kho: <span className="font-normal">Cửa hàng chính</span>
        </h1>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5 whitespace-nowrap">
            ≡ Danh sách lô - HSD
          </button>
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
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm kiếm theo mã SKU, tên sản phẩm, barcode"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Ngày tạo ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Tồn kho ▾
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

        {/* Table — horizontal scroll for many columns */}
        <div className="overflow-x-auto">
          <table className="text-sm min-w-[1400px] w-full">
            <thead>
              <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs">
                <th className="w-8 px-3 py-3 sticky left-0 bg-gray-50 z-10">
                  <button className="text-gray-400 hover:text-gray-600">⚙</button>
                </th>
                <th className="w-8 px-2 py-3 sticky left-8 bg-gray-50 z-10">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
                <th className="px-3 py-3 text-left whitespace-nowrap sticky left-16 bg-gray-50 z-10 min-w-[160px]">Sản phẩm</th>
                <th className="px-3 py-3 text-left whitespace-nowrap">SKU</th>
                <th className="px-3 py-3 text-left whitespace-nowrap">Barcode</th>
                <th className="px-3 py-3 text-left whitespace-nowrap">Đơn vị tính</th>
                <th className="px-3 py-3 text-left whitespace-nowrap">Quản lý lô - HSD</th>
                <th className="px-3 py-3 text-center whitespace-nowrap">Tồn kho ↕</th>
                <th className="px-3 py-3 text-center whitespace-nowrap">Có thể bán ↕</th>
                <th className="px-3 py-3 text-center whitespace-nowrap">Không thể bán ↕</th>
                <th className="px-3 py-3 text-center whitespace-nowrap">Đang giao dịch ↕</th>
                <th className="px-3 py-3 text-center whitespace-nowrap">Đang về kho ↕</th>
                <th className="px-3 py-3 text-center whitespace-nowrap">Đang đóng gói ↕</th>
                <th className="px-3 py-3 text-left whitespace-nowrap">Vị trí lưu kho</th>
                <th className="px-3 py-3 text-right whitespace-nowrap">Giá bán ↕</th>
                <th className="px-3 py-3 text-right whitespace-nowrap">Giá vốn ↕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 sticky left-0 bg-white" />
                  <td className="px-2 py-3 sticky left-8 bg-white">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleOne(item.id)}
                    />
                  </td>
                  <td className="px-3 py-3 sticky left-16 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-300 text-sm shrink-0">
                        🖼
                      </div>
                      <button className="text-blue-600 hover:underline text-left">{item.name}</button>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-400 text-center">{item.sku || ''}</td>
                  <td className="px-3 py-3 text-gray-400 text-center">{item.barcode || ''}</td>
                  <td className="px-3 py-3 text-gray-400 text-center">{item.unit || ''}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-blue-500">{item.batchManaged ? 'Có' : 'Không'}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <EditableStock value={item.stock} />
                  </td>
                  <td className="px-3 py-3 text-center text-gray-700">{item.available}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{item.unavailable}</td>
                  <td className="px-3 py-3 text-center">
                    {item.inTransaction > 0
                      ? <ExpandableCount value={item.inTransaction} />
                      : <span className="text-gray-700">0</span>}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={item.incoming > 0 ? 'text-blue-500' : 'text-gray-700'}>{item.incoming}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={item.packing > 0 ? 'text-blue-500' : 'text-gray-700'}>{item.packing}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-400">{item.location || ''}</td>
                  <td className="px-3 py-3 text-right text-gray-700">{fmt(item.salePrice)}</td>
                  <td className="px-3 py-3 text-right text-gray-700">{fmt(item.costPrice)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={16} className="px-4 py-12 text-center text-gray-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
        <button className="text-blue-500 hover:underline">quản lý kho</button>
      </p>

      <InventoryFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={setActiveFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
}

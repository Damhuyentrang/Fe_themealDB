import { useEffect, useRef, useState } from 'react';

interface FilterItem {
  key: string;
  label: string;
}

interface FilterGroup {
  groupLabel: string;
  items: FilterItem[];
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    groupLabel: 'Bộ lọc nổi bật',
    items: [
      { key: 'channel', label: 'Kênh bán hàng' },
      { key: 'orderDate', label: 'Ngày đặt hàng' },
    ],
  },
  {
    groupLabel: 'Thông tin đơn hàng',
    items: [
      { key: 'branch', label: 'Chi nhánh tạo đơn' },
      { key: 'customer', label: 'Khách hàng' },
      { key: 'product', label: 'Sản phẩm' },
      { key: 'productQty', label: 'Số lượng sản phẩm' },
      { key: 'preorder', label: 'Hàng đặt trước' },
      { key: 'source', label: 'Nguồn đơn' },
      { key: 'orderStatus', label: 'Trạng thái đơn hàng' },
      { key: 'processStatus', label: 'Trạng thái xử lý' },
      { key: 'returnStatus', label: 'Trạng thái trả hàng' },
      { key: 'refundStatus', label: 'Trạng thái hoàn trả' },
      { key: 'receiveStatus', label: 'Trạng thái nhận hàng' },
      { key: 'todo', label: 'Việc cần làm' },
      { key: 'packStatus', label: 'Trạng thái đóng gói' },
      { key: 'deliveryStatus', label: 'Trạng thái giao hàng' },
      { key: 'paymentStatus', label: 'Trạng thái thanh toán' },
      { key: 'printStatus', label: 'Trạng thái in' },
      { key: 'exportStatus', label: 'Trạng thái xuất hàng' },
      { key: 'createdBy', label: 'Nhân viên tạo đơn' },
      { key: 'assignedTo', label: 'Nhân viên phụ trách' },
      { key: 'createdApp', label: 'Ứng dụng tạo đơn' },
      { key: 'cancelReason', label: 'Lý do hủy đơn hàng' },
      { key: 'tag', label: 'Tag' },
    ],
  },
  {
    groupLabel: 'Thông tin giao hàng',
    items: [
      { key: 'carrier', label: 'Đối tác vận chuyển' },
      { key: 'shippingService', label: 'Dịch vụ vận chuyển' },
      { key: 'shippingStatus', label: 'Trạng thái vận chuyển' },
      { key: 'cod', label: 'Tiền thu hộ COD' },
      { key: 'deliveryDate', label: 'Ngày giao hàng' },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
}

export default function OrderMoreFiltersDrawer({ open, onClose, onApply, onClear }: Props) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const filtered = FILTER_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((g) => g.items.length > 0);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <span className="font-semibold text-gray-800 text-base">Bộ lọc khác</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              ref={inputRef}
              type="search"
              placeholder="Tìm kiếm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Filter groups */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">Không tìm thấy bộ lọc</div>
          ) : (
            filtered.map((group) => (
              <div key={group.groupLabel}>
                <p className="px-5 py-2.5 text-xs font-semibold text-gray-500 bg-gray-50 border-y border-gray-100 uppercase tracking-wide">
                  {group.groupLabel}
                </p>
                {group.items.map((item, i) => (
                  <button
                    key={item.key}
                    className={`w-full flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left ${
                      i < group.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-gray-400 text-xs">›</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-200">
          <button
            onClick={() => { onClear(); setSearch(''); }}
            className="flex-1 text-sm border border-red-400 text-red-500 rounded px-4 py-2 hover:bg-red-50 transition-colors font-medium"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={() => { onApply(); onClose(); }}
            className="flex-1 text-sm bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors font-medium"
          >
            Lọc
          </button>
        </div>
      </div>
    </>
  );
}

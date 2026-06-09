import { useEffect, useRef, useState } from 'react';

const FILTER_GROUPS = [
  {
    label: 'KHÁCH HÀNG',
    items: [
      { key: 'customerName',  label: 'Tên khách hàng' },
      { key: 'customerEmail', label: 'Email khách hàng' },
      { key: 'customerPhone', label: 'SĐT khách hàng' },
      { key: 'customerId',    label: 'ID khách hàng' },
      { key: 'customerType',  label: 'Phân loại khách hàng' },
    ],
  },
  {
    label: 'ĐỊA CHỈ THANH TOÁN',
    items: [
      { key: 'billingCountry',   label: 'Quốc gia (thanh toán)' },
      { key: 'billingProvince',  label: 'Tỉnh/thành phố (thanh toán)' },
    ],
  },
  {
    label: 'ĐỊA CHỈ GIAO HÀNG',
    items: [
      { key: 'shippingCountry',  label: 'Quốc gia (giao hàng)' },
      { key: 'shippingProvince', label: 'Tỉnh/thành phố (giao hàng)' },
    ],
  },
  {
    label: 'ĐƠN HÀNG',
    items: [
      { key: 'orderId',          label: 'ID đơn hàng' },
      { key: 'orderCode',        label: 'Mã đơn hàng' },
      { key: 'paymentStatus',    label: 'Trạng thái thanh toán' },
      { key: 'processStatus',    label: 'Trạng thái xử lý' },
      { key: 'deliveryStatus',   label: 'Trạng thái giao hàng' },
      { key: 'saleType',         label: 'Loại bán' },
      { key: 'saleTypeDetail',   label: 'Loại bán (chi tiết)' },
      { key: 'cancelledOrder',   label: 'Đơn hàng hủy' },
    ],
  },
  {
    label: 'SẢN PHẨM',
    items: [
      { key: 'productName', label: 'Tên sản phẩm' },
      { key: 'sku',         label: 'Mã SKU' },
    ],
  },
  {
    label: 'NHÂN VIÊN PHỤ TRÁCH',
    items: [
      { key: 'staffName', label: 'Tên nhân viên' },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
}

export default function RevenueFilterDrawer({ open, onClose, onApply, onClear }: Props) {
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
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200">
          <span className="font-semibold text-gray-800">Bộ lọc khác</span>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100">
          <input
            ref={inputRef}
            type="search"
            placeholder="Tìm kiếm bộ lọc"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
          />
        </div>

        {/* Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {filtered.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {group.label}
              </p>
              <div className="space-y-0">
                {group.items.map((item) => (
                  <button
                    key={item.key}
                    className="w-full text-left text-sm text-gray-700 py-2 hover:text-blue-500 transition-colors block"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Không tìm thấy bộ lọc</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-200">
          <button
            onClick={() => { onClear(); setSearch(''); }}
            className="flex-1 text-sm border border-red-400 text-red-500 rounded px-4 py-2 hover:bg-red-50 font-medium"
          >
            Xoá hết bộ lọc
          </button>
          <button
            onClick={() => { onApply(); onClose(); }}
            className="flex-1 text-sm bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 font-medium"
          >
            Lọc
          </button>
        </div>
      </div>
    </>
  );
}

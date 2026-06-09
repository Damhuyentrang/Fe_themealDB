import { useEffect, useRef } from 'react';

interface FilterOption {
  label: string;
  key: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'brand', label: 'Nhãn hiệu' },
  { key: 'createdAt', label: 'Ngày tạo' },
  { key: 'channel', label: 'Kênh bán hàng' },
  { key: 'priceBranch', label: 'Bảng giá theo chi nhánh' },
  { key: 'priceGroup', label: 'Bảng giá theo nhóm khách hàng' },
  { key: 'category', label: 'Danh mục' },
  { key: 'productType', label: 'Loại sản phẩm' },
  { key: 'taxGroup', label: 'Nhóm ngành nghề tính thuế GTGT, TNCN' },
  { key: 'tag', label: 'Tag' },
  { key: 'productForm', label: 'Hình thức sản phẩm' },
  { key: 'batchProduct', label: 'Sản phẩm lô - HSD' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
}

export default function MoreFiltersDrawer({ open, onClose, onApply, onClear }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <span className="font-semibold text-gray-800 text-base">Bộ lọc khác</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Filter list */}
        <div className="flex-1 overflow-y-auto">
          {FILTER_OPTIONS.map((opt, i) => (
            <button
              key={opt.key}
              className={`w-full flex items-center justify-between px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left ${
                i < FILTER_OPTIONS.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <span>{opt.label}</span>
              <span className="text-gray-400 text-xs">›</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-200">
          <button
            onClick={onClear}
            className="flex-1 text-sm border border-red-400 text-red-500 rounded px-4 py-2 hover:bg-red-50 transition-colors font-medium"
          >
            Xoá hết bộ lọc
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

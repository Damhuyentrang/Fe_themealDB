import { useEffect } from 'react';

const FILTER_ITEMS = [
  { key: 'updatedAt', label: 'Ngày cập nhật' },
  { key: 'createdAt', label: 'Ngày tạo' },
  { key: 'customer', label: 'Khách hàng' },
  { key: 'tag', label: 'Tag' },
  { key: 'branch', label: 'Chi nhánh' },
  { key: 'createdBy', label: 'Nhân viên tạo đơn' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
}

export default function DraftMoreFiltersDrawer({ open, onClose, onApply, onClear }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <span className="font-semibold text-gray-800 text-base">Bộ lọc khác</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Filter list */}
        <div className="flex-1 overflow-y-auto">
          {FILTER_ITEMS.map((item, i) => (
            <button
              key={item.key}
              className={`w-full flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left ${
                i < FILTER_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <span>{item.label}</span>
              <span className="text-gray-400 text-xs">›</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-gray-200">
          <button
            onClick={() => { onClear(); }}
            className="flex-1 text-sm border border-red-400 text-red-500 rounded px-4 py-2 hover:bg-red-50 transition-colors font-medium"
          >
            Xóa hết bộ lọc
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

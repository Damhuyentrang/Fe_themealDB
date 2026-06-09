import { useEffect, useState } from 'react';

export interface ColumnOption {
  key: string;
  label: string;
  defaultChecked: boolean;
}

export const ALL_COLUMNS: ColumnOption[] = [
  // col 1
  { key: 'orders',      label: 'SL đơn hàng',    defaultChecked: true },
  { key: 'customers',   label: 'SL khách hàng',   defaultChecked: false },
  { key: 'placed',      label: 'SL đặt hàng',     defaultChecked: false },
  { key: 'returns',     label: 'SL trả lại',      defaultChecked: false },
  { key: 'actual',      label: 'SL thực',         defaultChecked: false },
  { key: 'revenue',     label: 'Tiền hàng',       defaultChecked: true },
  // col 2
  { key: 'returnAmt',   label: 'Tiền hàng trả lại', defaultChecked: true },
  { key: 'discount',    label: 'Giảm giá',           defaultChecked: true },
  { key: 'netRevenue',  label: 'Doanh thu thuần',    defaultChecked: true },
  { key: 'shipping',    label: 'Phí giao hàng',      defaultChecked: true },
  { key: 'tax',         label: 'Tiền thuế',          defaultChecked: true },
  { key: 'total',       label: 'Tổng doanh thu',     defaultChecked: true },
  // col 3
  { key: 'cost',        label: 'Tiền vốn',                  defaultChecked: false },
  { key: 'grossProfit', label: 'Lợi nhuận gộp',             defaultChecked: true },
  { key: 'profitRate',  label: 'Tỉ suất lợi nhuận gộp',    defaultChecked: false },
  { key: 'avgQty',      label: 'SL sản phẩm trung bình',   defaultChecked: false },
  { key: 'avgOrder',    label: 'Giá trị đơn hàng trung bình', defaultChecked: false },
];

const DEFAULT_CHECKED = new Set(ALL_COLUMNS.filter((c) => c.defaultChecked).map((c) => c.key));

// Split into 3 columns
const COL_SIZE = Math.ceil(ALL_COLUMNS.length / 3);
const COLS = [
  ALL_COLUMNS.slice(0, COL_SIZE),
  ALL_COLUMNS.slice(COL_SIZE, COL_SIZE * 2),
  ALL_COLUMNS.slice(COL_SIZE * 2),
];

interface Props {
  open: boolean;
  selected: Set<string>;
  onClose: () => void;
  onApply: (selected: Set<string>) => void;
}

export default function ColumnSelectorModal({ open, selected: initialSelected, onClose, onApply }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  useEffect(() => {
    if (open) setSelected(new Set(initialSelected));
  }, [open, initialSelected]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const resetToDefault = () => setSelected(new Set(DEFAULT_CHECKED));

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800 text-base">Cột hiển thị thống kê</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-3 gap-0 px-6 py-5">
            {COLS.map((col, ci) => (
              <div key={ci} className="space-y-3">
                {col.map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selected.has(opt.key)}
                      onChange={() => toggle(opt.key)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Đang chọn <span className="font-semibold text-gray-700">{selected.size}</span> cột thống kê
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={resetToDefault}
                className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-600"
              >
                Quay về mặc định
              </button>
              <button
                onClick={() => { onApply(selected); onClose(); }}
                className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

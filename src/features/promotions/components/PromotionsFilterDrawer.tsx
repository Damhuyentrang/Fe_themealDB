import { useEffect, useState } from 'react';

export interface PromotionsFilters {
  hinhThuc: string[];
  loaiKhuyenMai: string[];
  trangThai: string[];
  ngayBatDauFrom: string;
  ngayBatDauTo: string;
  soLanMin: string;
  soLanMax: string;
  giaTriMin: string;
  giaTriMax: string;
  kenhBanHang: string[];
}

export const EMPTY_FILTERS: PromotionsFilters = {
  hinhThuc: [], loaiKhuyenMai: [], trangThai: [],
  ngayBatDauFrom: '', ngayBatDauTo: '',
  soLanMin: '', soLanMax: '', giaTriMin: '', giaTriMax: '',
  kenhBanHang: [],
};

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (f: PromotionsFilters) => void;
  initialFilters: PromotionsFilters;
}

const HINH_THUC_OPTIONS   = ['Mã giảm giá', 'Khuyến mại tự động'];
const LOAI_OPTIONS        = ['Giảm giá đơn hàng', 'Giảm giá sản phẩm', 'Mua X tặng Y', 'Tặng quà', 'Đồng giá'];
const TRANG_THAI_OPTIONS  = ['Đang áp dụng', 'Chưa áp dụng', 'Ngừng áp dụng'];
const KENH_OPTIONS        = ['Website', 'POS', 'Facebook', 'Shopee', 'Lazada', 'Tiki'];

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium">{title}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      {open && <div className="px-5 pb-4 space-y-2">{children}</div>}
    </div>
  );
}

function CheckGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  return (
    <>
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="w-4 h-4 accent-blue-600 rounded"
          />
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt}</span>
        </label>
      ))}
    </>
  );
}

function RangeInputs({ fromVal, toVal, onFromChange, onToChange, placeholder }: {
  fromVal: string; toVal: string;
  onFromChange: (v: string) => void; onToChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number" min="0"
        value={fromVal} onChange={(e) => onFromChange(e.target.value)}
        placeholder={placeholder ?? 'Từ'}
        className="flex-1 border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
      />
      <span className="text-gray-400 text-sm">—</span>
      <input
        type="number" min="0"
        value={toVal} onChange={(e) => onToChange(e.target.value)}
        placeholder={placeholder ?? 'Đến'}
        className="flex-1 border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
      />
    </div>
  );
}

export default function PromotionsFilterDrawer({ open, onClose, onApply, initialFilters }: Props) {
  const [f, setF] = useState<PromotionsFilters>(initialFilters);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => { setF(initialFilters); }, [initialFilters]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const setArr = (field: keyof PromotionsFilters, val: string[]) => setF((p) => ({ ...p, [field]: val }));
  const setStr = (field: keyof PromotionsFilters, val: string) => setF((p) => ({ ...p, [field]: val }));

  const countActive = [
    f.hinhThuc.length, f.loaiKhuyenMai.length, f.trangThai.length,
    (f.ngayBatDauFrom || f.ngayBatDauTo) ? 1 : 0,
    (f.soLanMin || f.soLanMax) ? 1 : 0,
    (f.giaTriMin || f.giaTriMax) ? 1 : 0,
    f.kenhBanHang.length,
  ].reduce((a, b) => a + b, 0);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-40 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-800">Bộ lọc khác</h2>
            {countActive > 0 && (
              <span className="text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5 font-medium">{countActive}</span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <Section title="Hình thức" open={!!openSections['hinhThuc']} onToggle={() => toggleSection('hinhThuc')}>
            <CheckGroup options={HINH_THUC_OPTIONS} selected={f.hinhThuc} onChange={(v) => setArr('hinhThuc', v)} />
          </Section>

          <Section title="Loại khuyến mại" open={!!openSections['loai']} onToggle={() => toggleSection('loai')}>
            <CheckGroup options={LOAI_OPTIONS} selected={f.loaiKhuyenMai} onChange={(v) => setArr('loaiKhuyenMai', v)} />
          </Section>

          <Section title="Ngày bắt đầu" open={!!openSections['ngayBatDau']} onToggle={() => toggleSection('ngayBatDau')}>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Từ ngày</label>
                <input
                  type="date" value={f.ngayBatDauFrom}
                  onChange={(e) => setStr('ngayBatDauFrom', e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Đến ngày</label>
                <input
                  type="date" value={f.ngayBatDauTo}
                  onChange={(e) => setStr('ngayBatDauTo', e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </Section>

          <Section title="Trạng thái" open={!!openSections['trangThai']} onToggle={() => toggleSection('trangThai')}>
            <CheckGroup options={TRANG_THAI_OPTIONS} selected={f.trangThai} onChange={(v) => setArr('trangThai', v)} />
          </Section>

          <Section title="Số lần sử dụng" open={!!openSections['soLan']} onToggle={() => toggleSection('soLan')}>
            <RangeInputs
              fromVal={f.soLanMin} toVal={f.soLanMax}
              onFromChange={(v) => setStr('soLanMin', v)}
              onToChange={(v) => setStr('soLanMax', v)}
            />
          </Section>

          <Section title="Kênh bán hàng" open={!!openSections['kenh']} onToggle={() => toggleSection('kenh')}>
            <CheckGroup options={KENH_OPTIONS} selected={f.kenhBanHang} onChange={(v) => setArr('kenhBanHang', v)} />
          </Section>

          <Section title="Giá trị khuyến mại" open={!!openSections['giaTri']} onToggle={() => toggleSection('giaTri')}>
            <RangeInputs
              fromVal={f.giaTriMin} toVal={f.giaTriMax}
              onFromChange={(v) => setStr('giaTriMin', v)}
              onToChange={(v) => setStr('giaTriMax', v)}
              placeholder="VND"
            />
          </Section>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-4 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={() => setF(EMPTY_FILTERS)}
            className="flex-1 border border-red-300 text-red-500 text-sm rounded-md py-2 hover:bg-red-50 transition-colors font-medium"
          >
            Xoá hết bộ lọc
          </button>
          <button
            onClick={() => { onApply(f); onClose(); }}
            className="flex-1 bg-blue-600 text-white text-sm rounded-md py-2 hover:bg-blue-700 transition-colors font-medium"
          >
            Lọc
          </button>
        </div>
      </div>
    </>
  );
}

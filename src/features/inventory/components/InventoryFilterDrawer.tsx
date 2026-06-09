import { useEffect, useState } from 'react';

export interface InventoryFilters {
  ngayTaoFrom: string;
  ngayTaoTo: string;
  tonKhoMin: string;
  tonKhoMax: string;
  dangVeKhoMin: string;
  dangVeKhoMax: string;
  coTheBanMin: string;
  coTheBanMax: string;
  khongTheBanMin: string;
  khongTheBanMax: string;
  dangGiaoDichMin: string;
  dangGiaoDichMax: string;
  dangDongGoiMin: string;
  dangDongGoiMax: string;
  quanLyLo: string[];
  loaiSanPham: string[];
  nhanHieu: string[];
  tags: string[];
}

export const EMPTY_INVENTORY_FILTERS: InventoryFilters = {
  ngayTaoFrom: '', ngayTaoTo: '',
  tonKhoMin: '', tonKhoMax: '',
  dangVeKhoMin: '', dangVeKhoMax: '',
  coTheBanMin: '', coTheBanMax: '',
  khongTheBanMin: '', khongTheBanMax: '',
  dangGiaoDichMin: '', dangGiaoDichMax: '',
  dangDongGoiMin: '', dangDongGoiMax: '',
  quanLyLo: [], loaiSanPham: [], nhanHieu: [], tags: [],
};

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (f: InventoryFilters) => void;
  initialFilters: InventoryFilters;
}

const LOAI_SP_OPTIONS = ['Sản phẩm đơn', 'Sản phẩm combo', 'Sản phẩm dịch vụ'];
const NHAN_HIEU_OPTIONS = ['Không có nhãn hiệu', 'The Meal', 'Gold Ring', 'Silver'];
const TAG_OPTIONS = ['mới', 'bán chạy', 'tồn lâu', 'hàng nhập khẩu'];

function Section({ title, open, onToggle, hasValue, children }: {
  title: string; open: boolean; onToggle: () => void; hasValue?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm hover:bg-gray-50 transition-colors"
      >
        <span className={`font-medium ${hasValue ? 'text-blue-600' : 'text-gray-700'}`}>{title}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform ${open ? 'rotate-90' : ''} ${hasValue ? 'text-blue-400' : 'text-gray-400'}`}
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
          <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="w-4 h-4 accent-blue-600" />
          <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt}</span>
        </label>
      ))}
    </>
  );
}

function RangeInputs({ fromVal, toVal, onFromChange, onToChange }: {
  fromVal: string; toVal: string; onFromChange: (v: string) => void; onToChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number" min="0" value={fromVal} onChange={(e) => onFromChange(e.target.value)}
        placeholder="Từ"
        className="flex-1 border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
      />
      <span className="text-gray-400 text-xs">—</span>
      <input
        type="number" min="0" value={toVal} onChange={(e) => onToChange(e.target.value)}
        placeholder="Đến"
        className="flex-1 border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
      />
    </div>
  );
}

export default function InventoryFilterDrawer({ open, onClose, onApply, initialFilters }: Props) {
  const [f, setF] = useState<InventoryFilters>(initialFilters);
  const [sections, setSections] = useState<Record<string, boolean>>({});

  useEffect(() => { setF(initialFilters); }, [initialFilters]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const toggle = (k: string) => setSections((p) => ({ ...p, [k]: !p[k] }));
  const setStr = (field: keyof InventoryFilters, val: string) => setF((p) => ({ ...p, [field]: val }));
  const setArr = (field: keyof InventoryFilters, val: string[]) => setF((p) => ({ ...p, [field]: val }));

  const hasRange = (min: string, max: string) => !!(min || max);
  const countActive = [
    (f.ngayTaoFrom || f.ngayTaoTo) ? 1 : 0,
    hasRange(f.tonKhoMin, f.tonKhoMax) ? 1 : 0,
    hasRange(f.dangVeKhoMin, f.dangVeKhoMax) ? 1 : 0,
    hasRange(f.coTheBanMin, f.coTheBanMax) ? 1 : 0,
    hasRange(f.khongTheBanMin, f.khongTheBanMax) ? 1 : 0,
    hasRange(f.dangGiaoDichMin, f.dangGiaoDichMax) ? 1 : 0,
    hasRange(f.dangDongGoiMin, f.dangDongGoiMax) ? 1 : 0,
    f.quanLyLo.length, f.loaiSanPham.length, f.nhanHieu.length, f.tags.length,
  ].reduce((a, b) => a + b, 0);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />
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
          <Section title="Ngày tạo" open={!!sections['ngayTao']} onToggle={() => toggle('ngayTao')} hasValue={!!(f.ngayTaoFrom || f.ngayTaoTo)}>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Từ ngày</label>
              <input type="date" value={f.ngayTaoFrom} onChange={(e) => setStr('ngayTaoFrom', e.target.value)}
                className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Đến ngày</label>
              <input type="date" value={f.ngayTaoTo} onChange={(e) => setStr('ngayTaoTo', e.target.value)}
                className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400" />
            </div>
          </Section>

          <Section title="Tồn kho" open={!!sections['tonKho']} onToggle={() => toggle('tonKho')} hasValue={hasRange(f.tonKhoMin, f.tonKhoMax)}>
            <RangeInputs fromVal={f.tonKhoMin} toVal={f.tonKhoMax} onFromChange={(v) => setStr('tonKhoMin', v)} onToChange={(v) => setStr('tonKhoMax', v)} />
          </Section>

          <Section title="Đang về kho" open={!!sections['dangVeKho']} onToggle={() => toggle('dangVeKho')} hasValue={hasRange(f.dangVeKhoMin, f.dangVeKhoMax)}>
            <RangeInputs fromVal={f.dangVeKhoMin} toVal={f.dangVeKhoMax} onFromChange={(v) => setStr('dangVeKhoMin', v)} onToChange={(v) => setStr('dangVeKhoMax', v)} />
          </Section>

          <Section title="Có thể bán" open={!!sections['coTheBan']} onToggle={() => toggle('coTheBan')} hasValue={hasRange(f.coTheBanMin, f.coTheBanMax)}>
            <RangeInputs fromVal={f.coTheBanMin} toVal={f.coTheBanMax} onFromChange={(v) => setStr('coTheBanMin', v)} onToChange={(v) => setStr('coTheBanMax', v)} />
          </Section>

          <Section title="Không thể bán" open={!!sections['khongTheBan']} onToggle={() => toggle('khongTheBan')} hasValue={hasRange(f.khongTheBanMin, f.khongTheBanMax)}>
            <RangeInputs fromVal={f.khongTheBanMin} toVal={f.khongTheBanMax} onFromChange={(v) => setStr('khongTheBanMin', v)} onToChange={(v) => setStr('khongTheBanMax', v)} />
          </Section>

          <Section title="Đang giao dịch" open={!!sections['dangGiaoDich']} onToggle={() => toggle('dangGiaoDich')} hasValue={hasRange(f.dangGiaoDichMin, f.dangGiaoDichMax)}>
            <RangeInputs fromVal={f.dangGiaoDichMin} toVal={f.dangGiaoDichMax} onFromChange={(v) => setStr('dangGiaoDichMin', v)} onToChange={(v) => setStr('dangGiaoDichMax', v)} />
          </Section>

          <Section title="Đang đóng gói" open={!!sections['dangDongGoi']} onToggle={() => toggle('dangDongGoi')} hasValue={hasRange(f.dangDongGoiMin, f.dangDongGoiMax)}>
            <RangeInputs fromVal={f.dangDongGoiMin} toVal={f.dangDongGoiMax} onFromChange={(v) => setStr('dangDongGoiMin', v)} onToChange={(v) => setStr('dangDongGoiMax', v)} />
          </Section>

          <Section title="Quản lý lô - HSD" open={!!sections['quanLyLo']} onToggle={() => toggle('quanLyLo')} hasValue={f.quanLyLo.length > 0}>
            <CheckGroup options={['Có', 'Không']} selected={f.quanLyLo} onChange={(v) => setArr('quanLyLo', v)} />
          </Section>

          <Section title="Loại sản phẩm" open={!!sections['loaiSp']} onToggle={() => toggle('loaiSp')} hasValue={f.loaiSanPham.length > 0}>
            <CheckGroup options={LOAI_SP_OPTIONS} selected={f.loaiSanPham} onChange={(v) => setArr('loaiSanPham', v)} />
          </Section>

          <Section title="Nhãn hiệu" open={!!sections['nhanHieu']} onToggle={() => toggle('nhanHieu')} hasValue={f.nhanHieu.length > 0}>
            <CheckGroup options={NHAN_HIEU_OPTIONS} selected={f.nhanHieu} onChange={(v) => setArr('nhanHieu', v)} />
          </Section>

          <Section title="Tag" open={!!sections['tag']} onToggle={() => toggle('tag')} hasValue={f.tags.length > 0}>
            <CheckGroup options={TAG_OPTIONS} selected={f.tags} onChange={(v) => setArr('tags', v)} />
          </Section>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-4 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={() => setF(EMPTY_INVENTORY_FILTERS)}
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

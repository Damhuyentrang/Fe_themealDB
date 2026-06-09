import { useEffect, useState } from 'react';

export interface PurchaseOrderFilters {
  trangThai: string[];
  trangThaiNhap: string[];
  chiNhanh: string[];
  nhaCungCap: string[];
  ngayTaoFrom: string;
  ngayTaoTo: string;
  ngayNhapFrom: string;
  ngayNhapTo: string;
  ngayHoaDonFrom: string;
  ngayHoaDonTo: string;
  sanPham: string;
  nhanVienTao: string[];
  nhanVienNhap: string[];
  nhanVienPhuTrach: string[];
  tags: string[];
  trangThaiThanhToan: string[];
  trangThaiHoanHang: string[];
}

export const EMPTY_PO_FILTERS: PurchaseOrderFilters = {
  trangThai: [], trangThaiNhap: [], chiNhanh: [], nhaCungCap: [],
  ngayTaoFrom: '', ngayTaoTo: '', ngayNhapFrom: '', ngayNhapTo: '',
  ngayHoaDonFrom: '', ngayHoaDonTo: '',
  sanPham: '',
  nhanVienTao: [], nhanVienNhap: [], nhanVienPhuTrach: [],
  tags: [], trangThaiThanhToan: [], trangThaiHoanHang: [],
};

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (f: PurchaseOrderFilters) => void;
  initialFilters: PurchaseOrderFilters;
}

const TRANG_THAI_OPTIONS        = ['Đang giao dịch', 'Hoàn thành', 'Đã hủy'];
const TRANG_THAI_NHAP_OPTIONS   = ['Chưa nhập', 'Nhập một phần', 'Đã nhập'];
const CHI_NHANH_OPTIONS         = ['Cửa hàng chính', 'Chi nhánh Q1', 'Chi nhánh Q7'];
const NHA_CUNG_CAP_OPTIONS      = ['ABC', 'Công ty TNHH DEF', 'Nhà cung cấp XYZ'];
const NHAN_VIEN_OPTIONS         = ['Trang Đàm', 'Nguyễn Văn A', 'Lê Thị B', 'Phạm Quang C'];
const TAG_OPTIONS               = ['ưu tiên', 'nhanh', 'hàng ngoại', 'đặt trước'];
const TT_THANH_TOAN_OPTIONS     = ['Chưa thanh toán', 'Thanh toán một phần', 'Đã thanh toán'];
const TT_HOAN_HANG_OPTIONS      = ['Chưa trả hàng', 'Trả một phần', 'Đã trả hàng'];

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

function DateRange({ fromVal, toVal, onFromChange, onToChange }: {
  fromVal: string; toVal: string; onFromChange: (v: string) => void; onToChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Từ ngày</label>
        <input type="date" value={fromVal} onChange={(e) => onFromChange(e.target.value)}
          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Đến ngày</label>
        <input type="date" value={toVal} onChange={(e) => onToChange(e.target.value)}
          className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-blue-400" />
      </div>
    </div>
  );
}

export default function PurchaseOrderFilterDrawer({ open, onClose, onApply, initialFilters }: Props) {
  const [f, setF] = useState<PurchaseOrderFilters>(initialFilters);
  const [sections, setSections] = useState<Record<string, boolean>>({});

  useEffect(() => { setF(initialFilters); }, [initialFilters]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const toggle = (k: string) => setSections((p) => ({ ...p, [k]: !p[k] }));
  const setStr = (field: keyof PurchaseOrderFilters, val: string) => setF((p) => ({ ...p, [field]: val }));
  const setArr = (field: keyof PurchaseOrderFilters, val: string[]) => setF((p) => ({ ...p, [field]: val }));

  const countActive = [
    f.trangThai.length, f.trangThaiNhap.length, f.chiNhanh.length, f.nhaCungCap.length,
    (f.ngayTaoFrom || f.ngayTaoTo) ? 1 : 0,
    (f.ngayNhapFrom || f.ngayNhapTo) ? 1 : 0,
    (f.ngayHoaDonFrom || f.ngayHoaDonTo) ? 1 : 0,
    f.sanPham ? 1 : 0,
    f.nhanVienTao.length, f.nhanVienNhap.length, f.nhanVienPhuTrach.length,
    f.tags.length, f.trangThaiThanhToan.length, f.trangThaiHoanHang.length,
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
          <Section title="Trạng thái" open={!!sections['tt']} onToggle={() => toggle('tt')} hasValue={f.trangThai.length > 0}>
            <CheckGroup options={TRANG_THAI_OPTIONS} selected={f.trangThai} onChange={(v) => setArr('trangThai', v)} />
          </Section>

          <Section title="Trạng thái nhập" open={!!sections['ttn']} onToggle={() => toggle('ttn')} hasValue={f.trangThaiNhap.length > 0}>
            <CheckGroup options={TRANG_THAI_NHAP_OPTIONS} selected={f.trangThaiNhap} onChange={(v) => setArr('trangThaiNhap', v)} />
          </Section>

          <Section title="Chi nhánh" open={!!sections['cn']} onToggle={() => toggle('cn')} hasValue={f.chiNhanh.length > 0}>
            <CheckGroup options={CHI_NHANH_OPTIONS} selected={f.chiNhanh} onChange={(v) => setArr('chiNhanh', v)} />
          </Section>

          <Section title="Nhà cung cấp" open={!!sections['ncc']} onToggle={() => toggle('ncc')} hasValue={f.nhaCungCap.length > 0}>
            <CheckGroup options={NHA_CUNG_CAP_OPTIONS} selected={f.nhaCungCap} onChange={(v) => setArr('nhaCungCap', v)} />
          </Section>

          <Section title="Ngày tạo" open={!!sections['ngayTao']} onToggle={() => toggle('ngayTao')} hasValue={!!(f.ngayTaoFrom || f.ngayTaoTo)}>
            <DateRange fromVal={f.ngayTaoFrom} toVal={f.ngayTaoTo}
              onFromChange={(v) => setStr('ngayTaoFrom', v)} onToChange={(v) => setStr('ngayTaoTo', v)} />
          </Section>

          <Section title="Ngày nhập" open={!!sections['ngayNhap']} onToggle={() => toggle('ngayNhap')} hasValue={!!(f.ngayNhapFrom || f.ngayNhapTo)}>
            <DateRange fromVal={f.ngayNhapFrom} toVal={f.ngayNhapTo}
              onFromChange={(v) => setStr('ngayNhapFrom', v)} onToChange={(v) => setStr('ngayNhapTo', v)} />
          </Section>

          <Section title="Ngày hóa đơn" open={!!sections['ngayHD']} onToggle={() => toggle('ngayHD')} hasValue={!!(f.ngayHoaDonFrom || f.ngayHoaDonTo)}>
            <DateRange fromVal={f.ngayHoaDonFrom} toVal={f.ngayHoaDonTo}
              onFromChange={(v) => setStr('ngayHoaDonFrom', v)} onToChange={(v) => setStr('ngayHoaDonTo', v)} />
          </Section>

          <Section title="Sản phẩm" open={!!sections['sp']} onToggle={() => toggle('sp')} hasValue={!!f.sanPham}>
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text" value={f.sanPham} onChange={(e) => setStr('sanPham', e.target.value)}
                placeholder="Tìm tên, mã SKU sản phẩm"
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-400"
              />
            </div>
          </Section>

          <Section title="Nhân viên tạo" open={!!sections['nvTao']} onToggle={() => toggle('nvTao')} hasValue={f.nhanVienTao.length > 0}>
            <CheckGroup options={NHAN_VIEN_OPTIONS} selected={f.nhanVienTao} onChange={(v) => setArr('nhanVienTao', v)} />
          </Section>

          <Section title="Nhân viên nhập" open={!!sections['nvNhap']} onToggle={() => toggle('nvNhap')} hasValue={f.nhanVienNhap.length > 0}>
            <CheckGroup options={NHAN_VIEN_OPTIONS} selected={f.nhanVienNhap} onChange={(v) => setArr('nhanVienNhap', v)} />
          </Section>

          <Section title="Nhân viên phụ trách" open={!!sections['nvPT']} onToggle={() => toggle('nvPT')} hasValue={f.nhanVienPhuTrach.length > 0}>
            <CheckGroup options={NHAN_VIEN_OPTIONS} selected={f.nhanVienPhuTrach} onChange={(v) => setArr('nhanVienPhuTrach', v)} />
          </Section>

          <Section title="Tag" open={!!sections['tag']} onToggle={() => toggle('tag')} hasValue={f.tags.length > 0}>
            <CheckGroup options={TAG_OPTIONS} selected={f.tags} onChange={(v) => setArr('tags', v)} />
          </Section>

          <Section title="Trạng thái thanh toán" open={!!sections['ttTT']} onToggle={() => toggle('ttTT')} hasValue={f.trangThaiThanhToan.length > 0}>
            <CheckGroup options={TT_THANH_TOAN_OPTIONS} selected={f.trangThaiThanhToan} onChange={(v) => setArr('trangThaiThanhToan', v)} />
          </Section>

          <Section title="Trạng thái hoàn hàng" open={!!sections['ttHH']} onToggle={() => toggle('ttHH')} hasValue={f.trangThaiHoanHang.length > 0}>
            <CheckGroup options={TT_HOAN_HANG_OPTIONS} selected={f.trangThaiHoanHang} onChange={(v) => setArr('trangThaiHoanHang', v)} />
          </Section>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-4 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={() => setF(EMPTY_PO_FILTERS)}
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

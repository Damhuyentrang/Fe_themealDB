import { useEffect, useState } from 'react';

interface InvoiceForm {
  taxCode: string;
  companyName: string;
  address: string;
  buyerName: string;
  idCard: string;
  budgetUnitCode: string;
  phone: string;
  email: string;
  noBuyerInvoice: boolean;
  saveAsDefault: boolean;
}

interface Props {
  open: boolean;
  initialEmail?: string;
  initialBuyerName?: string;
  onClose: () => void;
  onConfirm: (form: InvoiceForm) => void;
}

export default function InvoiceModal({ open, initialEmail = '', initialBuyerName = '', onClose, onConfirm }: Props) {
  const [form, setForm] = useState<InvoiceForm>({
    taxCode: '',
    companyName: '',
    address: '',
    buyerName: initialBuyerName,
    idCard: '',
    budgetUnitCode: '',
    phone: '',
    email: initialEmail,
    noBuyerInvoice: false,
    saveAsDefault: false,
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, buyerName: initialBuyerName, email: initialEmail }));
    }
  }, [open, initialBuyerName, initialEmail]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const set = (key: keyof InvoiceForm, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-base">Thông tin xuất hóa đơn</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Row 1: Tax code + Company */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mã số thuế</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.taxCode}
                  onChange={(e) => set('taxCode', e.target.value)}
                  placeholder="Nhập mã số thuế"
                  className="flex-1 text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 min-w-0"
                />
                <button className="text-sm text-blue-600 border border-blue-200 rounded px-2.5 py-2 hover:bg-blue-50 whitespace-nowrap shrink-0">
                  Lấy thông tin
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tên công ty</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => set('companyName', e.target.value)}
                placeholder="Nhập tên công ty"
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Row 2: Address (full width) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Địa chỉ</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Nhập địa chỉ"
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
            />
          </div>

          {/* Row 3: Buyer name + ID card */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tên người mua</label>
              <input
                type="text"
                value={form.buyerName}
                onChange={(e) => set('buyerName', e.target.value)}
                placeholder="Nhập tên người mua"
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Căn cước công dân</label>
              <input
                type="text"
                value={form.idCard}
                onChange={(e) => set('idCard', e.target.value)}
                placeholder="Nhập căn cước công dân"
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Row 4: Budget unit code + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mã đơn vị quan hệ ngân sách</label>
              <input
                type="text"
                value={form.budgetUnitCode}
                onChange={(e) => set('budgetUnitCode', e.target.value)}
                placeholder="Nhập mã đơn vị quan hệ ngân sách"
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
              <div className="flex gap-0 border border-gray-200 rounded overflow-hidden focus-within:border-blue-400">
                <button className="flex items-center gap-1 px-2 py-2 bg-gray-50 border-r border-gray-200 text-sm shrink-0 hover:bg-gray-100">
                  🇻🇳 <span className="text-gray-400 text-xs">▾</span>
                </button>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="flex-1 text-sm px-3 py-2 outline-none min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Email (full width) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email nhận hóa đơn</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="Nhập email nhận hóa đơn"
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.noBuyerInvoice}
                onChange={(e) => set('noBuyerInvoice', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-blue-600"
              />
              <div>
                <p className="text-sm text-gray-700">Người mua không lấy hóa đơn</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Với hóa đơn chưa có thông tin người mua, hệ thống hiển thị tên người mua theo thông tin đã cấu hình{' '}
                  <button className="text-blue-500 hover:underline">tại đây</button>
                </p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.saveAsDefault}
                onChange={(e) => set('saveAsDefault', e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm text-gray-700">Lưu làm thông tin xuất hóa đơn mặc định</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="text-sm border border-gray-300 rounded-md px-5 py-2 hover:bg-gray-50 text-gray-600 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={() => { onConfirm(form); onClose(); }}
            className="text-sm bg-blue-600 text-white rounded-md px-5 py-2 hover:bg-blue-700 font-medium"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

interface Props {
  open: boolean;
  amount: number;
  onClose: () => void;
}

const MOCK_ACCOUNTS = [
  { id: '1', label: 'MB Bank - 0123456789 - Đặng Hiếu' },
  { id: '2', label: 'Vietcombank - 9876543210 - Đặng Hiếu' },
];

export default function QRPaymentModal({ open, amount, onClose }: Props) {
  const [accountId, setAccountId] = useState('');
  const [payAmount, setPayAmount] = useState(amount.toLocaleString('vi-VN'));
  const [touched, setTouched] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setAccountId('');
      setTouched(false);
      setPayAmount(amount.toLocaleString('vi-VN'));
    }
  }, [open, amount]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const selectedAccount = MOCK_ACCOUNTS.find((a) => a.id === accountId);
  const hasAccount = !!selectedAccount;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-[560px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <span className="font-semibold text-gray-800">Mã VietQR thanh toán</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="p-5 flex gap-5">
          {/* Left: form */}
          <div className="flex-1 space-y-4">
            {/* Tài khoản nhận tiền */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tài khoản nhận tiền
                <span className="text-red-500 ml-0.5">*</span>
                <span className="ml-1 text-gray-400 cursor-help" title="Tài khoản ngân hàng nhận thanh toán">ⓘ</span>
              </label>
              <select
                value={accountId}
                onChange={(e) => { setAccountId(e.target.value); setTouched(true); }}
                onBlur={() => setTouched(true)}
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 ${
                  touched && !hasAccount ? 'border-red-400' : 'border-gray-300'
                } ${!accountId ? 'text-gray-400' : 'text-gray-700'}`}
              >
                <option value="">Chọn tài khoản nhận tiền</option>
                {MOCK_ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
              {touched && !hasAccount && (
                <p className="text-red-500 text-xs mt-1">Vui lòng thêm tài khoản nhận tiền</p>
              )}
            </div>

            {/* Số tiền thanh toán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số tiền thanh toán
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">đ</span>
              </div>
            </div>
          </div>

          {/* Right: QR preview */}
          <div className="w-52 flex-shrink-0">
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50 flex flex-col items-center gap-2">
              <p className="text-xs text-center text-gray-600 font-medium">Mở Ứng Dụng Ngân Hàng Quét QRCode</p>

              {/* VietQR logo */}
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded bg-red-500 flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">V</span>
                </div>
                <span className="text-red-500 font-bold text-sm tracking-wide">VietQR</span>
                <span className="text-red-300 text-xs">™</span>
              </div>

              {/* QR code placeholder */}
              <div className="w-32 h-32 bg-white border border-gray-200 rounded flex items-center justify-center">
                {hasAccount ? (
                  <div className="w-28 h-28 grid grid-cols-7 gap-px p-1">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-300 text-3xl">⬛</span>
                  </div>
                )}
              </div>

              {/* napas */}
              <div className="text-[10px] text-gray-400 font-medium tracking-widest">napas 24/7</div>

              {/* Info rows */}
              <div className="w-full text-[11px] space-y-0.5">
                {[
                  ['Số tiền:', hasAccount ? payAmount + 'đ' : '---'],
                  ['Nội dung CK:', hasAccount ? `Thanh toan don hang` : '---'],
                  ['Tên chủ TK:', hasAccount ? 'Đặng Hiếu' : '---'],
                  ['Số TK:', hasAccount ? selectedAccount?.label.split(' - ')[1] ?? '---' : '---'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-1">
                    <span className="text-gray-500 shrink-0">{label}</span>
                    <span className="text-gray-700 text-right truncate">{value}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                Giải pháp được cung cấp trên nền tảng{' '}
                <span className="text-blue-500 font-medium">Sapo</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-5 py-4 border-t border-gray-100">
          <button
            disabled={!hasAccount}
            className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sao chép ảnh
          </button>
        </div>
      </div>
    </div>
  );
}

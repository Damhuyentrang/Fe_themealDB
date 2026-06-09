import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const RETURN_REASONS = [
  'Không xác định',
  'Sản phẩm bị lỗi',
  'Sản phẩm không đúng mô tả',
  'Khách hàng đổi ý',
  'Giao sai sản phẩm',
  'Sản phẩm bị hỏng khi vận chuyển',
];

interface ReturnItem {
  id: string;
  name: string;
  maxQty: number;
  qty: number;
  price: number;
  reason: string;
}

export default function CreateReturnOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = id ?? '1001';

  const [items, setItems] = useState<ReturnItem[]>([
    { id: '1', name: 'Vòng tay', maxQty: 1, qty: 1, price: 2_000_000, reason: 'Không xác định' },
  ]);
  const [note, setNote] = useState('');
  const [branch, setBranch] = useState('Cửa hàng chính');
  const [returnCode, setReturnCode] = useState('');
  const [refundMode, setRefundMode] = useState<'now' | 'later'>('now');
  const [refundAmount, setRefundAmount] = useState(2_000_000);
  const [refundMethod, setRefundMethod] = useState('Tiền mặt');

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Math.min(item.maxQty, item.qty + delta)) }
          : item,
      ),
    );
  };

  const updateReason = (id: string, reason: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, reason } : item)));
  };

  const totalRefund = items.reduce((s, i) => s + i.price * i.qty, 0);
  const maxRefund = items.reduce((s, i) => s + i.price * i.maxQty, 0);

  const handleSubmit = () => {
    console.log('Create return order', { items, note, branch, returnCode, refundMode, refundAmount, refundMethod });
    navigate(ROUTES.ORDER_DETAIL.replace(':id', orderId));
  };

  return (
    <div className="max-w-[960px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.ORDER_DETAIL.replace(':id', orderId))}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 text-gray-500"
        >
          ←
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Tạo đơn trả hàng cho đơn #{orderId}
        </h1>
      </div>

      <div className="flex gap-4 items-start">
        {/* Left column */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* Return products */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-medium text-gray-800">Chọn sản phẩm trả hàng</span>
            </div>

            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-500">FUN{orderId.padStart(6, '0')}</span>
              <span className="text-blue-500 flex items-center gap-1">📍 {branch}</span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs">
                  <th className="px-4 py-2 text-left">Sản phẩm</th>
                  <th className="px-4 py-2 text-center">Số lượng</th>
                  <th className="px-4 py-2 text-right">Đơn giá</th>
                  <th className="px-4 py-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-300 shrink-0">
                          🖼
                        </div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                      <div className="mt-2 pl-12">
                        <p className="text-xs text-blue-500 mb-1">Chọn lý do hoàn trả</p>
                        <select
                          value={item.reason}
                          onChange={(e) => updateReason(item.id, e.target.value)}
                          className="text-sm border border-gray-200 rounded px-3 py-1.5 w-64 outline-none focus:border-blue-400"
                        >
                          {RETURN_REASONS.map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center align-top pt-4">
                      <div className="inline-flex flex-col border border-gray-200 rounded overflow-hidden">
                        <input
                          type="number"
                          value={item.qty}
                          min={1}
                          max={item.maxQty}
                          onChange={(e) =>
                            setItems((prev) =>
                              prev.map((p) =>
                                p.id === item.id
                                  ? { ...p, qty: Math.max(1, Math.min(item.maxQty, Number(e.target.value))) }
                                  : p,
                              ),
                            )
                          }
                          className="w-14 text-center py-1 text-sm outline-none border-b border-gray-200"
                        />
                        <div className="flex flex-col">
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="text-xs text-gray-500 hover:bg-gray-50 py-0.5 border-b border-gray-200"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="text-xs text-gray-500 hover:bg-gray-50 py-0.5"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right align-top pt-4 text-gray-700">
                      {item.price.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-3 text-right align-top pt-4 font-medium text-gray-800">
                      {(item.price * item.qty).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exchange products */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-medium text-gray-800">Chọn sản phẩm đổi</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Tách dòng
                </label>
                <span className="text-blue-500 text-sm flex items-center gap-1">📍 {branch}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  type="search"
                  placeholder="Tìm theo tên, mã SKU... (F3)"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded outline-none focus:border-blue-400"
                />
              </div>
              <button className="text-sm border border-gray-200 rounded px-3 py-2 hover:bg-gray-50">
                Chọn nhiều
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800">
              Ghi chú
            </div>
            <div className="p-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập lý do hoàn trả hàng"
                rows={3}
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Chỉ có bạn và nhân viên trong cửa hàng có thể nhìn thấy lý do này
              </p>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-72 shrink-0 space-y-4">

          {/* Branch */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Chi nhánh trả hàng</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
              >
                <option>Cửa hàng chính</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã đơn trả hàng</label>
              <input
                type="text"
                value={returnCode}
                onChange={(e) => setReturnCode(e.target.value)}
                placeholder="Nhập mã đơn trả hàng"
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2.5 text-sm">
            <p className="font-medium text-gray-800 mb-3">Tóm tắt</p>
            <div className="text-gray-600">Trả hàng {items.reduce((s, i) => s + i.qty, 0)} sản phẩm</div>
            <div className="text-blue-500">
              Lý do: {[...new Set(items.map((i) => i.reason))].join(', ')}
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2.5">
              <div>
                <p className="text-gray-600">Tổng hoàn sản phẩm</p>
                <p className="text-xs text-gray-400">{items.reduce((s, i) => s + i.qty, 0)} sản phẩm</p>
              </div>
              <span className="text-red-500 font-medium">-{totalRefund.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2.5">
              <span className="text-gray-600">Tổng hoàn trả</span>
              <span className="text-red-500 font-medium">-{totalRefund.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2.5">
              <span className="text-gray-600">Cần hoàn tiền cho khách</span>
              <span className="text-orange-500 font-semibold">{totalRefund.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Refund */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Hoàn tiền</span>
              <div className="flex rounded border border-gray-200 overflow-hidden text-sm">
                <button
                  onClick={() => setRefundMode('now')}
                  className={`px-3 py-1.5 transition-colors ${
                    refundMode === 'now' ? 'bg-gray-100 font-medium text-gray-800' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Hoàn ngay
                </button>
                <button
                  onClick={() => setRefundMode('later')}
                  className={`px-3 py-1.5 border-l border-gray-200 transition-colors ${
                    refundMode === 'later' ? 'bg-gray-100 font-medium text-gray-800' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Để sau
                </button>
              </div>
            </div>

            {refundMode === 'now' && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Tuỳ chỉnh tiền hoàn <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(Math.min(maxRefund, Number(e.target.value)))}
                      className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 pr-6"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">đ</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Số tiền hoàn tối đa: {maxRefund.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Phương thức hoàn tiền <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
                  >
                    <option>Tiền mặt</option>
                    <option>Chuyển khoản</option>
                    <option>Thẻ</option>
                  </select>
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white text-sm font-medium rounded py-2.5 hover:bg-blue-700 transition-colors"
            >
              {refundMode === 'now' ? 'Tạo đơn & hoàn tiền' : 'Tạo đơn trả hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

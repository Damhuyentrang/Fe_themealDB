import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const MOCK = {
  id: '88995993',
  createdAt: '05/06/2026 16:57',
  emailStatus: 'not_sent' as const,
  recoveryUrl: 'https://threedlab.mysapo.net/checkout/394dc0f347454459ad0f42aaf9955748/recover?key=ef079c94ae2b96b3e76eff6a2f021bad',
  products: [
    { id: '1', name: 'Vòng tay', qty: 2, price: 2_000_000 },
  ],
  customer: {
    name: null as string | null,
    email: 'damtrang@gmail.com',
    phone: '+84812102204',
    shippingAddress: {
      name: 'Trang',
      phone: '0812102204',
      country: 'Vietnam',
    },
  },
  source: 'Website',
  note: null as string | null,
};

export default function IncompleteOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = MOCK;
  const [copied, setCopied] = useState(false);
  const [infoDismissed, setInfoDismissed] = useState(false);

  const total = order.products.reduce((s, p) => s + p.price * p.qty, 0);

  const copyLink = () => {
    navigator.clipboard.writeText(order.recoveryUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3">
        <button
          onClick={() => navigate(ROUTES.ORDERS_INCOMPLETE)}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-500"
        >
          ←
        </button>
        <span className="font-semibold text-gray-800 text-lg">{order.id}</span>
        <span className="text-sm text-gray-400">{order.createdAt}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-600 border border-yellow-300">
          Chưa gửi
        </span>
      </div>

      {/* Recovery link banner */}
      {!infoDismissed && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-3">
              <p className="text-sm font-medium text-blue-800 flex items-center gap-1.5">
                ℹ️ Gửi email cho khách hàng của bạn liên kết này để tiếp tục đặt hàng
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={order.recoveryUrl}
                  className="flex-1 text-xs border border-blue-200 bg-white rounded px-3 py-2 outline-none text-gray-600 truncate"
                />
                <button
                  onClick={copyLink}
                  title="Sao chép"
                  className="w-9 h-9 flex items-center justify-center border border-blue-200 bg-white rounded hover:bg-blue-50 text-blue-500 transition-colors shrink-0"
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
              <p className="text-xs text-blue-600">
                Để tự động thông báo đơn hàng chưa hoàn tất, hãy điều chỉnh{' '}
                <button className="underline hover:text-blue-800">trang thanh toán của bạn</button>
              </p>
              <button className="text-sm border border-blue-400 text-blue-600 rounded px-4 py-1.5 hover:bg-blue-100 transition-colors font-medium">
                Gửi email hoàn tất đơn hàng
              </button>
            </div>
            <button
              onClick={() => setInfoDismissed(true)}
              className="text-blue-400 hover:text-blue-600 text-lg leading-none shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex gap-4 items-start">
        {/* Left column */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* Order details */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800">
              Chi tiết đơn
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs bg-gray-50">
                  <th className="px-4 py-2 text-left">Sản phẩm</th>
                  <th className="px-4 py-2 text-center">Số lượng</th>
                  <th className="px-4 py-2 text-right">Đơn giá</th>
                  <th className="px-4 py-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-300 shrink-0">
                          🖼
                        </div>
                        <span className="text-blue-600 hover:underline cursor-pointer">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{p.qty}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{p.price.toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {(p.price * p.qty).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800">Thanh toán</div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">
                  Tổng tiền
                  <span className="ml-2 text-gray-400">
                    {order.products.reduce((s, p) => s + p.qty, 0)} sản phẩm
                  </span>
                </div>
                <span className="text-gray-700">{total.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex items-center justify-between font-semibold border-t border-gray-100 pt-3 text-base">
                <span>Thành tiền</span>
                <span>{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-72 shrink-0 space-y-4">

          {/* Customer */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800 text-sm">Khách hàng</div>
            <div className="p-4 space-y-3 text-sm">
              <p className="text-gray-400">{order.customer.name ?? 'Không có tên'}</p>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">Thông tin liên hệ</p>
                <p className="text-blue-500">{order.customer.email}</p>
                <p className="text-gray-600">{order.customer.phone}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">Địa chỉ nhận hàng</p>
                <p className="text-gray-700">{order.customer.shippingAddress.name}</p>
                <p className="text-gray-600">{order.customer.shippingAddress.phone}</p>
                <p className="text-gray-600">{order.customer.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Source */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800 text-sm">Nguồn đơn</div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                  W
                </div>
                <span className="text-sm font-medium text-gray-700">{order.source}</span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-medium text-gray-800 text-sm">Ghi chú</span>
              <button className="text-gray-400 hover:text-gray-600 text-sm">✎</button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-400">{order.note ?? 'Chưa có ghi chú'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

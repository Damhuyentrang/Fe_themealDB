import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import InvoiceModal from '../components/InvoiceModal';
import QRPaymentModal from '../components/QRPaymentModal';

// ── Types ──────────────────────────────────────────────────────────────────────

type PaymentStatus = 'paid' | 'unpaid';
type OrderStatus   = 'pending' | 'processed' | 'completed';

interface MockOrder {
  id: string;
  code: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  source: { label: string; color: string };
  shipping: {
    branch: string;
    method?: string;
    fee?: number;
    exportDate?: string;
  };
  products: { id: string; name: string; qty: number; price: number }[];
  payment: { total: number; method?: string; paid?: number };
  customer: {
    name: string;
    email: string;
    phone: string | null;
    totalSpent: number;
    totalOrders: number;
    lastOrder: string;
    address: { name: string; phone: string | null; detail: string };
  };
  note: string | null;
  additionalInfo: { branch: string; staff: string | null };
  conversion?: { page: string };
  history: { time: string; actor: string; action: string; expandable?: boolean }[];
  timeline: { key: string; label: string; time: string | null; done: boolean }[];
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_ORDERS: Record<string, MockOrder> = {
  '1001': {
    id: '1001',
    code: '#1001',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    source: { label: 'Admin', color: 'bg-orange-400' },
    shipping: {
      branch: 'Cửa hàng chính',
      method: 'Nhận tại cửa hàng',
      exportDate: '03/06/2026 13:42',
    },
    products: [{ id: '1', name: 'Vòng tay', qty: 1, price: 2_000_000 }],
    payment: { total: 2_000_000, method: 'Tiền mặt', paid: 2_000_000 },
    customer: {
      name: 'Đặng Hiếu',
      email: 'hieuvandang1306@gmail.com',
      phone: null,
      totalSpent: 2_000_000,
      totalOrders: 2,
      lastOrder: '#1002',
      address: { name: 'Đặng Hiêu', phone: '0123456662', detail: '2, Xã Vĩnh Phú Đông, Huyện Phước Long, Bạc Liêu, Vietnam' },
    },
    note: null,
    additionalInfo: { branch: 'Cửa hàng chính', staff: 'Trang Đầm' },
    history: [
      { time: '13:42', actor: 'Trang Đầm', action: 'Đã thực hiện xuất hàng cho 1 sản phẩm tại chi nhánh Cửa hàng chính', expandable: true },
      { time: '13:42', actor: 'Trang Đầm', action: 'Đã xử lý giao hàng cho 1 sản phẩm tại chi nhánh Cửa hàng chính', expandable: true },
      { time: '13:42', actor: 'Trang Đầm', action: 'Đã xác nhận khoản thanh toán 2,000,000 VND thông qua Tiền mặt' },
      { time: '13:42', actor: 'Sapo',      action: 'Email xác nhận đơn hàng đã được gửi tới khách hàng' },
      { time: '13:42', actor: 'Trang Đầm', action: 'Đã xác nhận đơn hàng từ Đặng Hiếu' },
      { time: '13:42', actor: 'Trang Đầm', action: 'Đã tạo mới đơn hàng' },
    ],
    timeline: [
      { key: 'order',    label: 'Đặt hàng',     time: '03/06/2026 13:42', done: true },
      { key: 'confirm',  label: 'Xác nhận',      time: '03/06/2026 13:42', done: true },
      { key: 'pickup',   label: 'DTVC lấy hàng', time: null,               done: false },
      { key: 'delivery', label: 'Giao hàng',     time: '03/06/2026 13:42', done: true },
      { key: 'done',     label: 'Hoàn thành',    time: '03/06/2026 13:42', done: true },
    ],
  },
  '1002': {
    id: '1002',
    code: '#1002',
    paymentStatus: 'unpaid',
    orderStatus: 'pending',
    source: { label: 'Website', color: 'bg-green-500' },
    shipping: { branch: 'Cửa hàng chính', method: 'Giao hàng tận nơi', fee: 40_000 },
    products: [{ id: '1', name: 'Vòng tay', qty: 1, price: 2_000_000 }],
    payment: { total: 2_000_000 },
    customer: {
      name: 'Đặng Hiếu',
      email: 'hieuvandang1306@gmail.com',
      phone: null,
      totalSpent: 0,
      totalOrders: 2,
      lastOrder: '#1002',
      address: { name: 'Dang Hieu', phone: null, detail: 'Phường Phú Thịnh, Thị xã Sơn Tây, Hà Nội, Vietnam' },
    },
    note: null,
    additionalInfo: { branch: 'Cửa hàng chính', staff: null },
    conversion: { page: '/the-ring' },
    history: [
      { time: '13:46', actor: 'Sapo',       action: 'Khoản thanh toán 2,040,000 VND đang chờ xử lý thông qua Thu hộ (COD)', expandable: true },
      { time: '13:46', actor: 'Sapo',       action: 'Email xác nhận đơn hàng đã được gửi tới khách hàng', expandable: true },
      { time: '13:46', actor: 'Sapo',       action: 'Đã xác nhận đơn hàng từ Đặng Hiếu' },
      { time: '13:46', actor: 'Sapo',       action: 'Đặng Hiếu đặt đơn hàng trên Website' },
    ],
    timeline: [
      { key: 'order',    label: 'Đặt hàng',     time: '03/06/2026 13:46', done: true },
      { key: 'confirm',  label: 'Xác nhận',      time: '03/06/2026 13:46', done: true },
      { key: 'pickup',   label: 'DTVC lấy hàng', time: null,               done: false },
      { key: 'delivery', label: 'Giao hàng',     time: null,               done: false },
      { key: 'done',     label: 'Hoàn thành',    time: null,               done: false },
    ],
  },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'paid' | 'unpaid' | 'pending' | 'processed' | 'completed' | 'archived' }) {
  const cfg: Record<string, { label: string; dot: string; className: string }> = {
    paid:      { label: 'Đã thanh toán',  dot: 'bg-green-500',  className: 'bg-green-50 text-green-700 border border-green-300' },
    unpaid:    { label: 'Chưa thanh toán', dot: 'bg-orange-400', className: 'bg-orange-50 text-orange-600 border border-orange-300' },
    pending:   { label: 'Chưa xử lý',     dot: 'bg-orange-400', className: 'bg-orange-50 text-orange-600 border border-orange-300' },
    processed: { label: 'Đã xử lý',       dot: 'bg-gray-400',   className: 'bg-gray-100 text-gray-600 border border-gray-300' },
    completed: { label: 'Hoàn thành',     dot: 'bg-green-500',  className: 'bg-green-50 text-green-700 border border-green-300' },
    archived:  { label: 'Lưu trữ',        dot: 'bg-gray-300',   className: 'bg-white text-gray-500 border border-gray-300' },
  };
  const c = cfg[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${c.dot}`} />
      {c.label}
    </span>
  );
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>{children}</div>;
}

function SidebarSection({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-medium text-gray-800 text-sm">{title}</span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function EditIcon() {
  return <button className="text-gray-400 hover:text-gray-600 text-sm">✎</button>;
}

function PendingIcon() {
  return <span className="text-orange-400 text-base">⊙</span>;
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderId = id ?? '1002';
  const order = MOCK_ORDERS[orderId] ?? MOCK_ORDERS['1002'];

  const [expandedHistory, setExpandedHistory] = useState<Set<number>>(new Set());
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [showAllAddress, setShowAllAddress] = useState(false);

  const toggleHistory = (i: number) =>
    setExpandedHistory((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const isPaid    = order.paymentStatus === 'paid';
  const isPending = order.orderStatus === 'pending';
  const shippingFee = order.shipping.fee ?? 0;
  const grandTotal  = order.payment.total + shippingFee;

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.ORDERS)}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-500"
          >
            ←
          </button>
          <span className="font-semibold text-gray-800">{order.code}</span>
          <StatusBadge status={order.paymentStatus} />
          <StatusBadge status={order.orderStatus} />
        </div>
        <div className="flex items-center gap-2">
          {isPending ? (
            <button
              onClick={() => navigate(`/orders/${orderId}/edit`)}
              className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5"
            >
              ✎ Sửa đơn
            </button>
          ) : (
            <button
              onClick={() => navigate(ROUTES.ORDER_RETURN.replace(':id', orderId))}
              className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5"
            >
              🔄 Đổi trả hàng
            </button>
          )}
          <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5">
            🖨 In đơn hàng
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50">
            Thao tác khác ▾
          </button>
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button className="px-2 py-1.5 hover:bg-gray-50 text-gray-500 border-r border-gray-200">‹</button>
            <button className="px-2 py-1.5 hover:bg-gray-50 text-gray-500">›</button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <SectionCard>
        <div className="px-6 py-4 flex items-center">
          {order.timeline.map((step, i) => (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full border-2 ${step.done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`} />
                <p className={`text-xs mt-1.5 font-medium ${step.done ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{step.time ?? ''}</p>
              </div>
              {i < order.timeline.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-6 ${step.done && order.timeline[i + 1].done ? 'bg-green-500' : 'border-t-2 border-dashed border-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Body */}
      <div className="flex gap-4 items-start">
        {/* Left column */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* Processing / Shipping card */}
          <SectionCard>
            {isPending ? (
              /* Chưa xử lý */
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <PendingIcon />
                  <span className="font-medium text-gray-800">Chưa xử lý</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">···</button>
              </div>
            ) : (
              /* Đã xử lý */
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-green-50">
                <span className="text-green-500 text-lg">✅</span>
                <span className="font-medium text-green-700">Đã xử lý giao hàng</span>
              </div>
            )}

            <div className="p-4 space-y-1.5 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-500 w-28 shrink-0">Chi nhánh:</span>
                <span className="text-gray-700">{order.shipping.branch}</span>
              </div>
              {!isPending && order.shipping.method && (
                <div className="flex gap-2">
                  <span className="text-gray-500 w-28 shrink-0">Vận chuyển:</span>
                  <span className="text-gray-700">{order.shipping.method}</span>
                </div>
              )}
              {!isPending && order.shipping.exportDate && (
                <div className="flex gap-2">
                  <span className="text-gray-500 w-28 shrink-0">Ngày xuất hàng:</span>
                  <span className="text-gray-700">{order.shipping.exportDate}</span>
                </div>
              )}
            </div>

            <table className="w-full text-sm border-t border-gray-100">
              <thead>
                <tr className="text-gray-500 text-xs bg-gray-50">
                  <th className="px-4 py-2 text-left">Sản phẩm</th>
                  <th className="px-4 py-2 text-center">Số lượng</th>
                  <th className="px-4 py-2 text-right">Đơn giá</th>
                  <th className="px-4 py-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-300 shrink-0">
                          🖼
                        </div>
                        <Link to={`/products/${p.id}`} className="text-blue-600 hover:underline">
                          {p.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{p.qty}</td>
                    <td className="px-4 py-3 text-right">{p.price.toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-3 text-right font-medium">{(p.price * p.qty).toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
              <button className="text-sm text-blue-500 hover:text-blue-600">Thêm ghi chú</button>
              {isPending && (
                <div className="flex gap-2">
                  <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50">
                    Xác nhận giao hàng
                  </button>
                  <button className="text-sm bg-blue-600 text-white rounded-md px-3 py-1.5 hover:bg-blue-700 font-medium">
                    Đẩy vận chuyển
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Payment card */}
          <SectionCard>
            {isPaid ? (
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-green-50">
                <span className="text-green-500 text-lg">✅</span>
                <span className="font-medium text-green-700">Đã thanh toán</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <PendingIcon />
                <span className="font-medium text-gray-800">Chưa thanh toán</span>
              </div>
            )}

            <div className="p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-500">
                  Tổng tiền hàng
                  <span className="ml-2 text-gray-400">{order.products.length} sản phẩm</span>
                </div>
                <span className="font-medium">{order.payment.total.toLocaleString('vi-VN')}đ</span>
              </div>

              {shippingFee > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-gray-500">
                    Phí giao hàng
                    {order.shipping.method && <span className="ml-2 text-gray-400">{order.shipping.method}</span>}
                  </div>
                  <span className="font-medium">{shippingFee.toLocaleString('vi-VN')}đ</span>
                </div>
              )}

              <div className="flex items-center justify-between font-semibold border-t border-gray-100 pt-3">
                <span>Thành tiền</span>
                <span>{grandTotal.toLocaleString('vi-VN')}đ</span>
              </div>

              {isPaid && order.payment.method && (
                <div className="flex items-center justify-between text-gray-500 border-t border-gray-100 pt-3">
                  <div>
                    Khách đã trả
                    <span className="ml-2 text-gray-400">{order.payment.method}</span>
                  </div>
                  <span>{(order.payment.paid ?? 0).toLocaleString('vi-VN')}đ</span>
                </div>
              )}
            </div>

            {!isPaid && (
              <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  onClick={() => setQrModalOpen(true)}
                  className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50"
                >
                  Lấy mã QR
                </button>
                <button className="text-sm bg-blue-600 text-white rounded-md px-3 py-1.5 hover:bg-blue-700 font-medium">
                  Nhận tiền
                </button>
              </div>
            )}
          </SectionCard>

          {/* E-invoice */}
          <SectionCard>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-yellow-50">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⏳</span>
                <span className="font-medium text-yellow-700">Chưa yêu cầu hóa đơn điện tử</span>
              </div>
              <button onClick={() => setInvoiceModalOpen(true)} className="text-sm text-blue-500 hover:underline">
                Yêu cầu hóa đơn
              </button>
            </div>
            <div className="px-4 py-3 text-sm text-gray-500">
              Đơn hàng chưa có yêu cầu hóa đơn điện tử. Vui lòng thêm thông tin để tạo hóa đơn điện tử
            </div>
          </SectionCard>

          {/* Order history */}
          <SectionCard>
            <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800">
              Lịch sử đơn hàng
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-3">03/06/2026</p>
              <div className="relative">
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-blue-200" />
                <div className="space-y-3">
                  {order.history.map((item, i) => (
                    <div key={i} className="flex gap-3 relative">
                      <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0 mt-0.5 relative z-10" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm text-gray-700">
                            <span className="text-gray-400 mr-2">{item.time}</span>
                            <span className="font-medium">{item.actor}</span>
                            <span className="ml-1">{item.action}</span>
                          </div>
                          {item.expandable && (
                            <button
                              onClick={() => toggleHistory(i)}
                              className="text-gray-400 hover:text-gray-600 shrink-0 text-xs mt-0.5"
                            >
                              {expandedHistory.has(i) ? '▲' : '▼'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right sidebar */}
        <div className="w-72 shrink-0 space-y-4">

          {/* Nguồn đơn */}
          <SidebarSection title="Nguồn đơn">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold ${order.source.color}`}>
                {order.source.label === 'Website' ? '🌐' : order.source.label[0]}
              </div>
              <span className="text-sm font-medium text-gray-700">{order.source.label}</span>
            </div>
          </SidebarSection>

          {/* Khách hàng */}
          <SidebarSection title="Khách hàng">
            <div className="space-y-3 text-sm">
              <Link to="/customers/1" className="text-blue-600 hover:underline font-medium">
                {order.customer.name}
              </Link>
              <div className="flex items-center justify-between text-gray-500">
                <span>Tổng chi tiêu ({order.customer.totalOrders} đơn hàng)</span>
                <span className="font-medium text-gray-700">{order.customer.totalSpent.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span>Đơn gần nhất</span>
                <Link to={`/orders/${order.customer.lastOrder.replace('#','')}`} className="text-blue-500 hover:underline">
                  {order.customer.lastOrder}
                </Link>
              </div>
            </div>
          </SidebarSection>

          {/* Nhóm khách hàng */}
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
            <p className="text-sm font-medium text-gray-800 mb-1">Nhóm khách hàng</p>
            <p className="text-sm text-gray-400">Không áp dụng nhóm khách hàng</p>
          </div>

          {/* Thông tin liên hệ */}
          <SidebarSection title="Thông tin liên hệ" action={<EditIcon />}>
            <div className="space-y-1 text-sm">
              <p className="text-blue-500">{order.customer.email}</p>
              <p className="text-gray-400">{order.customer.phone ?? 'Không có số điện thoại'}</p>
            </div>
          </SidebarSection>

          {/* Địa chỉ giao hàng */}
          <SidebarSection title="Địa chỉ giao hàng" action={<EditIcon />}>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-medium">{order.customer.address.name}</p>
              {order.customer.address.phone && <p>{order.customer.address.phone}</p>}
              <p className={!showAllAddress ? 'line-clamp-2' : ''}>{order.customer.address.detail}</p>
              <button
                onClick={() => setShowAllAddress((v) => !v)}
                className="text-blue-500 hover:underline text-xs mt-1 flex items-center gap-1"
              >
                {showAllAddress ? 'Thu gọn ▲' : 'Xem thêm ▾'}
              </button>
            </div>
          </SidebarSection>

          {/* Ghi chú */}
          <SidebarSection title="Ghi chú" action={<EditIcon />}>
            <p className="text-sm text-gray-400">{order.note ?? 'Chưa có ghi chú'}</p>
          </SidebarSection>

          {/* Chuyển đổi đơn hàng */}
          {order.conversion && (
            <SidebarSection title="Chuyển đổi đơn hàng">
              <div className="text-sm space-y-1">
                <p className="text-gray-500">Trang</p>
                <a href={order.conversion.page} className="text-blue-500 hover:underline break-all">
                  {order.conversion.page}
                </a>
              </div>
            </SidebarSection>
          )}

          {/* Thông tin bổ sung */}
          <SidebarSection title="Thông tin bổ sung">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-0.5">Bán tại chi nhánh</p>
                <p className="text-gray-700">{order.additionalInfo.branch}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 mb-0.5">Nhân viên phụ trách</p>
                  <p className="text-gray-700">
                    {order.additionalInfo.staff ?? 'Chưa có nhân viên phụ trách'}
                  </p>
                </div>
                <EditIcon />
              </div>
            </div>
          </SidebarSection>
        </div>
      </div>

      <QRPaymentModal
        open={qrModalOpen}
        amount={grandTotal}
        onClose={() => setQrModalOpen(false)}
      />

      <InvoiceModal
        open={invoiceModalOpen}
        initialBuyerName={order.customer.name}
        initialEmail={order.customer.email}
        onClose={() => setInvoiceModalOpen(false)}
        onConfirm={(form) => console.log('Invoice submitted:', form)}
      />
    </div>
  );
}

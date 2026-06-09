import { Link } from 'react-router-dom';
import type { Order } from '../../types/order.types';
import { formatCurrency, formatDate } from '../../../../lib/utils';
import { ROUTES } from '../../../../constants/routes';

const PAYMENT_STATUS_LABELS: Record<Order['paymentStatus'], { label: string; className: string }> = {
  unpaid: { label: 'Chưa thanh toán', className: 'text-orange-500 border border-orange-300 bg-orange-50' },
  paid: { label: 'Đã thanh toán', className: 'text-green-600 border border-green-300 bg-green-50' },
  partial: { label: 'Thanh toán một phần', className: 'text-blue-500 border border-blue-300 bg-blue-50' },
};

const ORDER_STATUS_LABELS: Record<Order['orderStatus'], { label: string; className: string }> = {
  pending: { label: 'Chưa xử lý', className: 'text-orange-500 border border-orange-300 bg-orange-50' },
  processing: { label: 'Đang xử lý', className: 'text-blue-500 border border-blue-300 bg-blue-50' },
  shipping: { label: 'Đang giao', className: 'text-purple-500 border border-purple-300 bg-purple-50' },
  completed: { label: 'Đã xử lý', className: 'text-gray-500 border border-gray-300 bg-gray-50' },
  cancelled: { label: 'Đã hủy', className: 'text-red-500 border border-red-300 bg-red-50' },
};

function StatusBadge({ config }: { config: { label: string; className: string } }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

interface Props {
  orders: Order[];
  isLoading?: boolean;
}

export default function OrderTable({ orders, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <th className="w-8 px-3 py-3"><input type="checkbox" /></th>
            <th className="px-3 py-3 text-left">Mã đơn hàng ↕</th>
            <th className="px-3 py-3 text-left">Ngày đặt hàng ↕</th>
            <th className="px-3 py-3 text-left">Khách hàng</th>
            <th className="px-3 py-3 text-left">Nguồn đơn ↕</th>
            <th className="px-3 py-3 text-right">Thành tiền</th>
            <th className="px-3 py-3 text-left">Trạng thái thanh toán</th>
            <th className="px-3 py-3 text-left">Trạng thái xử lý</th>
            <th className="px-3 py-3 text-left">Dịch vụ vận chuyển</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3"><input type="checkbox" /></td>
              <td className="px-3 py-3">
                <Link
                  to={ROUTES.ORDER_DETAIL.replace(':id', order.id)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {order.code}
                </Link>
              </td>
              <td className="px-3 py-3 text-gray-600">{formatDate(order.createdAt)}</td>
              <td className="px-3 py-3">
                <Link to={`/customers/${order.customer.id}`} className="text-blue-600 hover:underline">
                  {order.customer.name}
                </Link>
              </td>
              <td className="px-3 py-3 text-gray-600">{order.source}</td>
              <td className="px-3 py-3 text-right font-medium">{formatCurrency(order.total)}</td>
              <td className="px-3 py-3">
                <StatusBadge config={PAYMENT_STATUS_LABELS[order.paymentStatus]} />
              </td>
              <td className="px-3 py-3">
                <StatusBadge config={ORDER_STATUS_LABELS[order.orderStatus]} />
              </td>
              <td className="px-3 py-3 text-gray-500">{order.shippingService ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

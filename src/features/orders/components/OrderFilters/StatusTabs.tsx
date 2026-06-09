import { cn } from '../../../../lib/utils';
import type { OrderFilters } from '../../types/order.types';

const TABS: { label: string; value: OrderFilters['status'] }[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đặt hàng', value: 'pending' },
  { label: 'Đang giao dịch', value: 'processing' },
  { label: 'Đã hoàn thành', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' },
];

interface Props {
  value: OrderFilters['status'];
  onChange: (status: OrderFilters['status']) => void;
}

export default function StatusTabs({ value, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-200">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
            value === tab.value
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

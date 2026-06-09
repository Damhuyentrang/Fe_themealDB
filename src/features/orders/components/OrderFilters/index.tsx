import { useOrderFiltersStore } from '../../store/orderFilters.store';
import StatusTabs from './StatusTabs';

interface Props {
  onMoreFilters?: () => void;
}

export default function OrderFilters({ onMoreFilters }: Props) {
  const { filters, setSearch, setStatus } = useOrderFiltersStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 pt-3">
        <StatusTabs value={filters.status} onChange={setStatus} />
      </div>
      <div className="flex items-center gap-3 p-4">
        <input
          type="search"
          placeholder="Tìm kiếm theo mã đơn hàng, vận đơn, SĐT khách hàng"
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-400"
        />
        <select className="text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-blue-400">
          <option>Tìm theo Tất cả</option>
          <option>Mã đơn hàng</option>
          <option>SĐT khách hàng</option>
        </select>
        <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
          Kênh bán hàng ▾
        </button>
        <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
          Ngày đặt hàng ▾
        </button>
        <button
          onClick={onMoreFilters}
          className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50"
        >
          🔍 Bộ lọc khác
        </button>
        <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
          Lưu bộ lọc
        </button>
      </div>
    </div>
  );
}

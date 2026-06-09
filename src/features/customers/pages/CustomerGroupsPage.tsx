import { useState } from 'react';

type GroupType = 'auto' | 'manual';

interface CustomerGroup {
  id: string;
  name: string;
  count: number;
  type: GroupType;
}

const TYPE_LABEL: Record<GroupType, string> = {
  auto:   'Tự động',
  manual: 'Thủ công',
};

const MOCK_GROUPS: CustomerGroup[] = [
  { id: '1', name: 'Khách hàng thân thiết', count: 3, type: 'auto' },
  { id: '2', name: 'Nhãn quảng cáo',        count: 0, type: 'auto' },
];

export default function CustomerGroupsPage() {
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = MOCK_GROUPS.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(filtered.map((g) => g.id)) : new Set());

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Nhóm khách hàng</h1>
        <button className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium flex items-center gap-1">
          ＋ Tạo nhóm
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-4">
          <button className="px-4 py-2.5 text-sm font-medium border-b-2 border-blue-500 text-blue-600 -mb-px">
            Tất cả
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm kiếm theo tên nhóm khách hàng"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Phân loại ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Lưu bộ lọc
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={(e) => toggleAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left">Nhóm khách hàng</th>
              <th className="px-4 py-3 text-center">Số lượng</th>
              <th className="px-4 py-3 text-left">Phân loại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((group) => (
              <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(group.id)}
                    onChange={() => toggleOne(group.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                    {group.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-700">{group.count}</td>
                <td className="px-4 py-3 text-gray-500">{TYPE_LABEL[group.type]}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy nhóm khách hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
          <span>Từ 1 đến {filtered.length} trên tổng {filtered.length}</span>
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-sm">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>Kết quả</span>
            <div className="ml-4">
              <button className="w-8 h-8 rounded bg-blue-600 text-white text-sm font-medium">1</button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">
        Tìm hiểu thêm về{' '}
        <button className="text-blue-500 hover:underline">Nhóm khách hàng</button>
      </p>
    </div>
  );
}

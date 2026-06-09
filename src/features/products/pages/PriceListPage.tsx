import { useState } from 'react';

type PriceListType = 'channel' | 'customer_group' | 'branch';
type PriceListStatus = 'active' | 'inactive';

interface PriceList {
  id: string;
  code: string;
  name: string;
  type: PriceListType;
  status: PriceListStatus;
  adjustment?: string;
}

const TYPE_LABEL: Record<PriceListType, string> = {
  channel:        'Theo kênh bán hàng',
  customer_group: 'Theo nhóm khách hàng',
  branch:         'Theo chi nhánh',
};

const MOCK_PRICE_LISTS: PriceList[] = [
  { id: '1', code: 'CTL723739', name: 'Chat OmniAI',    type: 'channel',        status: 'active' },
  { id: '2', code: 'CTL723738', name: 'Facebook',       type: 'channel',        status: 'active' },
  { id: '3', code: 'CTL722584', name: 'KH mua lần đầu', type: 'customer_group', status: 'active', adjustment: '-10%' },
  { id: '4', code: 'CTL721162', name: 'Tiktok Shop',    type: 'channel',        status: 'active' },
  { id: '5', code: 'CTL721153', name: 'Website',        type: 'channel',        status: 'active' },
  { id: '6', code: 'CTL721152', name: 'POS',            type: 'channel',        status: 'active' },
];

const TABS = [
  { key: 'all',            label: 'Tất cả' },
  { key: 'branch',         label: 'Theo chi nhánh' },
  { key: 'customer_group', label: 'Theo nhóm khách hàng' },
  { key: 'channel',        label: 'Theo kênh bán hàng' },
];

export default function PriceListPage() {
  const [activeTab, setActiveTab]   = useState('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<Set<string>>(new Set());

  const filtered = MOCK_PRICE_LISTS.filter((p) => {
    const matchTab    = activeTab === 'all' || p.type === activeTab;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.code.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(filtered.map((p) => p.id)) : new Set());

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
        <h1 className="text-xl font-semibold text-gray-800">Bảng giá</h1>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5">
            ↑ Xuất file
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5">
            ↓ Nhập file
          </button>
          <button className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium flex items-center gap-1">
            ＋ Thêm bảng giá
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-4 flex">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap -mb-px border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 p-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm kiếm theo tên, mã bảng giá"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Loại bảng giá ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
            Trạng thái ▾
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
              <th className="px-4 py-3 text-left">Mã bảng giá</th>
              <th className="px-4 py-3 text-left">Tên bảng giá</th>
              <th className="px-4 py-3 text-left">Loại bảng giá</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-right">Điều chỉnh giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((pl) => (
              <tr key={pl.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(pl.id)}
                    onChange={() => toggleOne(pl.id)}
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                    {pl.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{pl.name}</td>
                <td className="px-4 py-3 text-gray-500">{TYPE_LABEL[pl.type]}</td>
                <td className="px-4 py-3">
                  {pl.status === 'active' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      Đang áp dụng
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                      Không áp dụng
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-500 font-medium">
                  {pl.adjustment ? (
                    <span className="text-green-600">{pl.adjustment}</span>
                  ) : (
                    <span className="text-gray-300">···</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  Không tìm thấy bảng giá nào
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
        <button className="text-blue-500 hover:underline">bảng giá</button>
      </p>
    </div>
  );
}

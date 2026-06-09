import { useState } from 'react';

const STATS = [
  { label: 'Chờ lấy hàng',           count: 0, cod: 0 },
  { label: 'Đã lấy hàng',            count: 0, cod: 0 },
  { label: 'Đang giao hàng',          count: 0, cod: 0 },
  { label: 'Chờ giao lại',            count: 0, cod: 0 },
  { label: 'Đang hoàn hàng',          count: 0, cod: 0 },
  { label: 'Chờ xác nhận hoàn hàng',  count: 0, cod: 0 },
  { label: 'Đã hoàn hàng',            count: 0, cod: 0 },
  { label: 'Đã giao hàng',            count: 0, cod: 0 },
  { label: 'Huỷ giao hàng',           count: 0, cod: 0 },
];

const CHART_CARDS = [
  'Thời gian lấy hàng thành công trung bình',
  'Thời gian giao hàng thành công trung bình',
  'Tỉ lệ giao hàng thành công',
  'Tỉ trọng vận đơn',
];

function DonutPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      {/* SVG donut placeholder */}
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r="42" fill="none" stroke="#e5e7eb" strokeWidth="16" />
        <circle cx="55" cy="55" r="42" fill="none" stroke="#d1d5db" strokeWidth="16"
          strokeDasharray="80 185" strokeDashoffset="-20" strokeLinecap="round" />
        {/* decorative dots */}
        <circle cx="20" cy="30" r="4" fill="#e5e7eb" />
        <circle cx="90" cy="30" r="4" fill="#e5e7eb" />
        <circle cx="55" cy="8"  r="3" fill="#e5e7eb" />
        {/* X icon in center */}
        <text x="55" y="60" textAnchor="middle" fontSize="20" fill="#9ca3af">✕</text>
      </svg>
      <p className="text-sm text-gray-400">Chưa có dữ liệu báo cáo</p>
    </div>
  );
}

export default function ShippingOverviewPage() {
  const [period, setPeriod] = useState('7 ngày qua (31/05 - 06/06/2026)');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Tổng quan vận chuyển</h1>
        <button className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium flex items-center gap-1.5">
          ＋ Kết nối vận chuyển
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5 whitespace-nowrap">
          📅 7 ngày qua (31/05 - 06/06/2026) ▾
        </button>
        <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap">
          Tất cả chi nhánh ▾
        </button>
        <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
          Khu vực ▾
        </button>
      </div>

      {/* Stats scroll bar */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <div className="flex min-w-max divide-x divide-gray-100">
          {STATS.map((stat) => (
            <button
              key={stat.label}
              className="flex flex-col items-start px-5 py-3.5 hover:bg-gray-50 transition-colors shrink-0 text-left"
            >
              <span className="text-xs text-gray-500 whitespace-nowrap mb-1">{stat.label}</span>
              <span className="text-2xl font-bold text-gray-800">{stat.count}</span>
              <span className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                📦 COD: {stat.cod > 0 ? `${stat.cod.toLocaleString('vi-VN')}đ` : '0đ'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart cards — 2x2 grid */}
      <div className="grid grid-cols-2 gap-4">
        {CHART_CARDS.map((title) => (
          <div key={title} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">{title}</span>
            </div>
            <DonutPlaceholder />
          </div>
        ))}
      </div>
    </div>
  );
}

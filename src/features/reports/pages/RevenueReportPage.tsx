import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarChart from '../components/BarChart';
import RevenueFilterDrawer from '../components/RevenueFilterDrawer';
import ColumnSelectorModal, { ALL_COLUMNS } from '../components/ColumnSelectorModal';
import { ROUTES } from '../../../constants/routes';

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  if (v === 0) return '0đ';
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.0', '')}tr`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}k`;
  return `${v}đ`;
}

function fmtFull(v: number) {
  if (v === 0) return '0đ';
  return (v < 0 ? '-' : '') + Math.abs(v).toLocaleString('vi-VN') + 'đ';
}

// ── mock data ─────────────────────────────────────────────────────────────────

interface DayRow {
  date: string;
  orders: number;
  revenue: number;
  returns: number;
  discount: number;
  netRevenue: number;
  shipping: number;
  tax: number;
  totalRevenue: number;
  grossProfit: number;
}

const ROWS: DayRow[] = [
  { date: '07/05 - 05/06/2026', orders: 5, revenue: 13_000_000, returns: -2_000_000, discount: 0, netRevenue: 11_000_000, shipping: 120_000, tax: 0, totalRevenue: 11_120_000, grossProfit: 7_300_000 },
  { date: '05/06/2026', orders: 2, revenue: 5_000_000, returns: -2_000_000, discount: 0, netRevenue: 3_000_000, shipping: 40_000, tax: 0, totalRevenue: 3_040_000, grossProfit: 2_100_000 },
  { date: '04/06/2026', orders: 0, revenue: 0, returns: 0, discount: 0, netRevenue: 0, shipping: 0, tax: 0, totalRevenue: 0, grossProfit: 0 },
  { date: '03/06/2026', orders: 3, revenue: 8_000_000, returns: 0, discount: 0, netRevenue: 8_000_000, shipping: 80_000, tax: 0, totalRevenue: 8_080_000, grossProfit: 5_200_000 },
  ...Array.from({ length: 26 }, (_, i) => {
    const day = 2 - i; // 02/06 back to 07/05
    const month = day > 0 ? 6 : 5;
    const d = day > 0 ? day : 31 + day;
    return {
      date: `${String(d).padStart(2, '0')}/${String(month).padStart(2, '0')}/2026`,
      orders: 0, revenue: 0, returns: 0, discount: 0, netRevenue: 0, shipping: 0, tax: 0, totalRevenue: 0, grossProfit: 0,
    };
  }),
];

// chart data — 30 days
const CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const day = i + 7;
  const month = day <= 31 ? 5 : 6;
  const d = day <= 31 ? day : day - 31;
  const label = `${String(d).padStart(2, '0')}/${month}`;
  // spike on day 27 (=03/06) and day 29 (=05/06)
  const isSpike1 = i === 26;
  const isSpike2 = i === 28;
  return {
    label,
    value: isSpike1 ? 8_080_000 : isSpike2 ? 3_040_000 : 0,
    compareValue: isSpike1 ? 1_200_000 : isSpike2 ? 500_000 : 0,
  };
});

const COLUMNS = [
  { key: 'orders',       label: 'SL đơn hàng' },
  { key: 'revenue',      label: 'Tiền hàng' },
  { key: 'returns',      label: 'Tiền hàng trả lại' },
  { key: 'discount',     label: 'Giảm giá' },
  { key: 'netRevenue',   label: 'Doanh thu thuần' },
  { key: 'shipping',     label: 'Phí giao hàng' },
  { key: 'tax',          label: 'Tiền thuế' },
  { key: 'totalRevenue', label: 'Tổng doanh thu' },
  { key: 'grossProfit',  label: 'Lợi nhuận gộp' },
] as const;

// ── page ──────────────────────────────────────────────────────────────────────

export default function RevenueReportPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'chart-table' | 'chart' | 'table'>('chart-table');
  const [filterOpen, setFilterOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [selectedCols, setSelectedCols] = useState<Set<string>>(
    new Set(ALL_COLUMNS.filter((c) => c.defaultChecked).map((c) => c.key)),
  );

  const summaryRow = ROWS[0];
  const dataRows = ROWS.slice(1);

  const renderCell = (row: DayRow, key: typeof COLUMNS[number]['key']) => {
    const v = row[key];
    if (key === 'orders') return <span>{v}</span>;
    if (typeof v === 'number') {
      return <span className={v < 0 ? 'text-red-500' : ''}>{fmtFull(v)}</span>;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.REPORTS)}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 text-gray-500"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Doanh thu theo thời gian</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5">
            ↑ Xuất báo cáo
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5">
            📋 Sao chép
          </button>
        </div>
      </div>

      {/* Date + view controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5">
            📅 30 ngày qua (07/05 - 05/06/2026) ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
            So với: 07/04 - 06/05/2026 ▾
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50">
            Theo ngày ▾
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 flex items-center gap-1.5">
            📊 Cột ▾
          </button>
        </div>
      </div>

      {/* Chart */}
      {viewMode !== 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Tổng doanh thu</p>
          <BarChart
            data={CHART_DATA}
            height={230}
            formatY={fmt}
          />
          <div className="flex items-center gap-6 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded-sm bg-blue-500 inline-block" />
              07/05 - 05/06/2026
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded-sm bg-blue-200 inline-block" />
              So với: 07/04 - 06/05/2026
            </span>
          </div>
        </div>
      )}

      {/* View mode toggle */}
      <div className="flex justify-center gap-1">
        {([
          { key: 'chart-table', icon: '▤' },
          { key: 'chart',       icon: '▣' },
          { key: 'table',       icon: '▦' },
        ] as const).map((v) => (
          <button
            key={v.key}
            onClick={() => setViewMode(v.key)}
            className={`w-9 h-9 flex items-center justify-center rounded border text-sm transition-colors ${
              viewMode === v.key
                ? 'border-blue-400 bg-blue-50 text-blue-600'
                : 'border-gray-200 text-gray-400 hover:bg-gray-50'
            }`}
          >
            {v.icon}
          </button>
        ))}
      </div>

      {/* Table */}
      {viewMode !== 'chart' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              onClick={() => setColumnModalOpen(true)}
              className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5"
            >
              ▤ Cột hiển thị ({selectedCols.size}) ▾
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5"
            >
              🔍 Bộ lọc
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 text-xs">
                  <th className="px-4 py-3 text-left whitespace-nowrap sticky left-0 bg-gray-50 z-10">
                    Ngày ▾
                  </th>
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-right whitespace-nowrap">
                      {col.label} <span className="text-gray-400 ml-0.5">ⓘ</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Summary row */}
                <tr className="bg-blue-50 border-b border-blue-100 font-medium text-sm">
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap sticky left-0 bg-blue-50 z-10">
                    {summaryRow.date}
                  </td>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-right text-gray-800">
                      {renderCell(summaryRow, col.key)}
                    </td>
                  ))}
                </tr>

                {/* Daily rows */}
                {dataRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap sticky left-0 bg-white z-10">
                      {row.date}
                    </td>
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-right text-gray-600">
                        {renderCell(row, col.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RevenueFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => {}}
        onClear={() => {}}
      />

      <ColumnSelectorModal
        open={columnModalOpen}
        selected={selectedCols}
        onClose={() => setColumnModalOpen(false)}
        onApply={(cols) => setSelectedCols(cols)}
      />
    </div>
  );
}

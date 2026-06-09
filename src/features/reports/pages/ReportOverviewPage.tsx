import { useState } from 'react';
import LineChart from '../components/LineChart';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMoney(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.0', '')}tr`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return `${v}đ`;
}

function formatFull(v: number) {
  return v.toLocaleString('vi-VN') + 'đ';
}

// ── Mock chart data (30 days) ──────────────────────────────────────────────────

function generateDailyData(peakDay: number, peakValue: number, baseline = 0) {
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const month = day <= 24 ? 5 : 6;
    const d = day <= 24 ? day + 6 : day - 24;
    const value =
      Math.abs(day - peakDay) <= 1
        ? peakValue * (1 - Math.abs(day - peakDay) * 0.4)
        : baseline;
    const cmpValue = value * 0.3;
    return {
      label: `${String(d).padStart(2, '0')}/${month}`,
      value: Math.round(value),
      compareValue: Math.round(cmpValue),
    };
  });
}

const revenueData = generateDailyData(26, 8_000_000);
const avgOrderData = generateDailyData(26, 2_270_000);
const orderCountData = generateDailyData(26, 4, 0).map((d) => ({
  ...d,
  value: Math.round(d.value / 2_000_000),
  compareValue: Math.round((d.compareValue ?? 0) / 2_000_000),
}));

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  title, value, growth, showPlus = true,
}: { title: string; value: string; growth?: number; showPlus?: boolean }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 min-w-0 relative">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        {showPlus && (
          <button className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-50">
            +
          </button>
        )}
      </div>
      <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
      {growth !== undefined && (
        <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
          <span>↑</span> {growth}%
        </span>
      )}
    </div>
  );
}

function ChartCard({
  title, value, growth, children,
}: { title: string; value: string; growth?: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-800 mt-0.5">{value}</p>
          {growth !== undefined && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-0.5">
              ↑ {growth}%
            </span>
          )}
        </div>
        <button className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-50">
          +
        </button>
      </div>
      <div className="mt-3">{children}</div>
      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-6 h-0.5 bg-blue-500" /> 07/05 - 05/06/2026
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-6 border-t-2 border-dashed border-gray-400" /> So với: 07/04 - 06/05/2026
        </span>
      </div>
    </div>
  );
}

const TABS = ['Tổng quan', 'Phân tích doanh thu', 'Phân tích khách hàng', 'Phân tích website', 'Phân tích kinh doanh Sản'];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReportOverviewPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Tổng quan báo cáo</h1>
        <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ⛶ Xem toàn màn hình
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center border-b border-gray-200 px-4 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === i
                  ? 'border-blue-500 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="ml-2 w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm shrink-0">
            +
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Date range filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5">
                📅 30 ngày qua (07/05 - 05/06/2026) ▾
              </button>
              <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5">
                So với: 07/04 - 06/05/2026 ▾
              </button>
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              ✎ Chỉnh sửa
            </button>
          </div>

          {/* KPI cards row */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Doanh thu thuần" value={formatFull(9_000_000)} growth={100} />
            <StatCard title="Lợi nhuận gộp" value={formatFull(6_000_000)} growth={100} />
            <StatCard title="Đơn hàng" value="4" growth={100} />
            <StatCard title="Giá trị tồn kho" value={formatFull(79_300_000)} />
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <ChartCard title="Doanh thu theo thời gian" value={formatFull(9_080_000)} growth={100}>
              <LineChart
                data={revenueData}
                height={180}
                formatY={formatMoney}
              />
            </ChartCard>
            <ChartCard title="Giá trị đơn hàng trung bình" value={formatFull(2_270_000)} growth={100}>
              <LineChart
                data={avgOrderData}
                height={180}
                formatY={formatMoney}
              />
            </ChartCard>
          </div>

          {/* Top products + order count */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top sản phẩm bán chạy */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">Top sản phẩm bán chạy</p>
                <button className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-50">+</button>
              </div>
              <div className="space-y-0">
                {[
                  { name: 'Vòng tay', revenue: 8_000_000, qty: 4 },
                  { name: 'Cân', revenue: 1_000_000, qty: 1 },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{p.name}</span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{formatFull(p.revenue)}</p>
                      <p className="text-xs text-gray-400">{p.qty} sản phẩm</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Số lượng đơn hàng theo thời gian */}
            <ChartCard title="Số lượng đơn hàng theo thời gian" value="4" growth={100}>
              <LineChart
                data={orderCountData}
                height={180}
                formatY={(v) => String(Math.round(v))}
              />
            </ChartCard>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">Doanh thu theo nguồn đơn hàng</p>
                <button className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-50">+</button>
              </div>
              <div className="py-8 text-center text-gray-400 text-sm">Chưa có dữ liệu</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">Doanh thu theo chi nhánh</p>
                <button className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-50">+</button>
              </div>
              <div className="py-8 text-center text-gray-400 text-sm">Chưa có dữ liệu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

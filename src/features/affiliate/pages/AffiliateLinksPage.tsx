import { useState } from 'react';

interface AffLink {
  id: string;
  ctv: string;
  ctvCode: string;
  url: string;
  clicks: number;
  orders: number;
  revenue: number;
  createdAt: string;
}

const MOCK: AffLink[] = [
  { id: 'l1', ctv: 'Nguyễn Văn A', ctvCode: 'CTV001', url: 'https://shop.com/?ref=REF-NVA', clicks: 142, orders: 7,  revenue: 2_800_000, createdAt: '2026-04-01' },
  { id: 'l2', ctv: 'Trần Thị B',   ctvCode: 'CTV002', url: 'https://shop.com/?ref=REF-TTB', clicks: 98,  orders: 5,  revenue: 2_000_000, createdAt: '2026-04-15' },
  { id: 'l3', ctv: 'Lê Văn C',     ctvCode: 'CTV003', url: 'https://shop.com/?ref=REF-LVC', clicks: 3,   orders: 0,  revenue: 0,          createdAt: '2026-06-01' },
];

function fmt(v: number) { return v > 0 ? `${v.toLocaleString('vi-VN')}đ` : '0đ'; }

export default function AffiliateLinksPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (url: string, id: string) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Link giới thiệu</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs">
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Cộng tác viên</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Link giới thiệu</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide">Lượt click</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide">Đơn hàng</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide">Doanh thu</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Tỉ lệ chuyển đổi</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{l.ctv}</div>
                  <div className="text-xs text-gray-400">{l.ctvCode}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-1 max-w-xs truncate block">
                      {l.url}
                    </code>
                    <button
                      onClick={() => copy(l.url, l.id)}
                      className={`text-xs px-2 py-1 rounded border transition-colors shrink-0 ${
                        copied === l.id
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {copied === l.id ? '✓ Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-gray-700">{l.clicks.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-700">{l.orders}</td>
                <td className="px-4 py-3 text-right text-gray-700">{fmt(l.revenue)}</td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {l.clicks > 0 ? ((l.orders / l.clicks) * 100).toFixed(1) + '%' : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(l.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

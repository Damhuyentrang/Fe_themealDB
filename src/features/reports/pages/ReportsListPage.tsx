import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const REPORT_GROUPS = [
  {
    label: 'Bán hàng',
    reports: [
      { id: 'revenue-time', name: 'Doanh thu theo thời gian', path: ROUTES.REPORT_REVENUE },
      { id: 'revenue-product', name: 'Doanh thu theo sản phẩm', path: null },
      { id: 'revenue-staff', name: 'Doanh thu theo nhân viên', path: null },
      { id: 'revenue-source', name: 'Doanh thu theo nguồn đơn hàng', path: null },
      { id: 'revenue-channel', name: 'Doanh thu theo kênh bán hàng', path: null },
    ],
  },
  {
    label: 'Khách hàng',
    reports: [
      { id: 'customer-new', name: 'Khách hàng mới', path: null },
      { id: 'customer-debt', name: 'Công nợ khách hàng', path: null },
    ],
  },
  {
    label: 'Kho hàng',
    reports: [
      { id: 'inventory-value', name: 'Giá trị tồn kho', path: null },
      { id: 'inventory-change', name: 'Biến động kho', path: null },
    ],
  },
];

export default function ReportsListPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Danh sách báo cáo</h1>

      {REPORT_GROUPS.map((group) => (
        <div key={group.label}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{group.label}</h2>
          <div className="grid grid-cols-3 gap-3">
            {group.reports.map((report) => (
              <button
                key={report.id}
                onClick={() => report.path && navigate(report.path)}
                className={`bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all ${
                  !report.path ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <p className="text-sm font-medium text-gray-800">{report.name}</p>
                {report.path && (
                  <p className="text-xs text-blue-500 mt-1">Xem báo cáo →</p>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

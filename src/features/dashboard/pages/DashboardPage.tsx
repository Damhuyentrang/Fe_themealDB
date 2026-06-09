export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Tổng quan</h1>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Doanh thu hôm nay', value: '0đ' },
          { label: 'Đơn hàng hôm nay', value: '0' },
          { label: 'Khách hàng mới', value: '0' },
          { label: 'Sản phẩm sắp hết', value: '0' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

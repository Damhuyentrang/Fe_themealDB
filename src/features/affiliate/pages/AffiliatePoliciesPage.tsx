import { useState } from 'react';

interface Policy {
  id: string;
  name: string;
  rate: number;
  minOrder: number;
  applyTo: string;
  isDefault: boolean;
}

const MOCK: Policy[] = [
  { id: 'p1', name: 'Chính sách mặc định', rate: 10, minOrder: 0,         applyTo: 'Tất cả sản phẩm',    isDefault: true },
  { id: 'p2', name: 'Nhẫn cao cấp',        rate: 15, minOrder: 500_000,   applyTo: 'Danh mục: Nhẫn',     isDefault: false },
  { id: 'p3', name: 'Hàng mới',            rate: 8,  minOrder: 200_000,   applyTo: 'Tag: moi',           isDefault: false },
];

function fmt(v: number) { return v > 0 ? `${v.toLocaleString('vi-VN')}đ` : '0đ'; }

export default function AffiliatePoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(MOCK);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRate, setNewRate] = useState('10');
  const [newMin, setNewMin] = useState('0');

  const addPolicy = () => {
    if (!newName.trim()) return;
    setPolicies((prev) => [...prev, {
      id: `p${Date.now()}`,
      name: newName,
      rate: Number(newRate),
      minOrder: Number(newMin),
      applyTo: 'Tất cả sản phẩm',
      isDefault: false,
    }]);
    setNewName(''); setNewRate('10'); setNewMin('0');
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Chính sách hoa hồng</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
        >
          <span className="text-base leading-none">⊕</span> Thêm chính sách
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-blue-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm">Chính sách mới</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tên chính sách <span className="text-red-500">*</span></label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="Nhập tên chính sách"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tỷ lệ hoa hồng (%)</label>
              <input type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)}
                min="0" max="100"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Đơn hàng tối thiểu (đ)</label>
              <input type="number" value={newMin} onChange={(e) => setNewMin(e.target.value)}
                min="0"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={addPolicy} className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium">Lưu</button>
            <button onClick={() => setShowForm(false)} className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700">Hủy</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-gray-200 bg-gray-50 text-gray-500 text-xs">
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Tên chính sách</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Tỷ lệ HH (%)</th>
              <th className="px-4 py-3 text-right font-medium uppercase tracking-wide whitespace-nowrap">Đơn tối thiểu</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide whitespace-nowrap">Áp dụng cho</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Trạng thái</th>
              <th className="px-4 py-3 text-left font-medium uppercase tracking-wide">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {policies.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-800">{p.name}</span>
                  {p.isDefault && (
                    <span className="ml-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2 py-0.5">Mặc định</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">{p.rate}%</td>
                <td className="px-4 py-3 text-right text-gray-700">{fmt(p.minOrder)}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{p.applyTo}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.isDefault ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-green-50 text-green-600 border border-green-200'
                  }`}>
                    {p.isDefault ? 'Mặc định' : 'Đang hoạt động'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-blue-600 hover:underline">Sửa</button>
                    {!p.isDefault && (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setPolicies((prev) => prev.filter((x) => x.id !== p.id))}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

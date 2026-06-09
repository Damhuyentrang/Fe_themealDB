import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

interface OrderProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
}

export default function CreatePurchaseOrderPage() {
  const navigate = useNavigate();

  const [productSearch, setProductSearch] = useState('');
  const [splitLines, setSplitLines] = useState(false);
  const [products, setProducts] = useState<OrderProduct[]>([]);

  const [supplierSearch, setSupplierSearch] = useState('');
  const [assignee, setAssignee] = useState('Trang Đàm');
  const [expectedDate, setExpectedDate] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [orderCode, setOrderCode] = useState('');
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [discount, setDiscount] = useState(0);
  const [importFee, setImportFee] = useState(0);

  const subtotal = products.reduce((s, p) => s + p.price * p.qty, 0);
  const total = Math.max(0, subtotal - discount + importFee);

  const updateQty = (id: string, qty: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));

  const updatePrice = (id: string, price: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, price: Math.max(0, price) } : p)));

  const removeProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const fmt = (v: number) =>
    v > 0 ? `${v.toLocaleString('vi-VN')}đ` : '0đ';

  return (
    <div className="space-y-0 -m-6">
      {/* Top action bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(ROUTES.PURCHASE_ORDERS)}
          className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
        >
          Hủy
        </button>
        <button
          onClick={() => navigate(ROUTES.PURCHASE_ORDERS)}
          className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
        >
          Tạo đơn nhập hàng
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.PURCHASE_ORDERS)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Tạo đơn nhập hàng</h1>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-4 items-start">
          {/* ─── LEFT ─── */}
          <div className="space-y-4">
            {/* Sản phẩm */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Sản phẩm</h2>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={splitLines}
                    onChange={(e) => setSplitLines(e.target.checked)}
                    className="rounded"
                  />
                  Tách dòng
                </label>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </span>
                  <input
                    type="search"
                    placeholder="Tìm theo tên, mã SKU, quét mã Barcode... (F3)"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
                  />
                </div>
                <button className="text-sm border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 whitespace-nowrap text-gray-700">
                  Chọn nhiều
                </button>
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                  <p className="text-sm text-blue-500">Bạn chưa thêm sản phẩm nào</p>
                  <button
                    onClick={() => {
                      // mock add
                      setProducts([{
                        id: `p${Date.now()}`,
                        name: 'Sản phẩm mẫu',
                        sku: 'SKU001',
                        price: 0,
                        qty: 1,
                      }]);
                    }}
                    className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    Thêm sản phẩm
                  </button>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-gray-200 bg-gray-50 text-xs text-gray-500">
                      <th className="px-3 py-2 text-left">Sản phẩm</th>
                      <th className="px-3 py-2 text-right">Đơn giá nhập</th>
                      <th className="px-3 py-2 text-right">Số lượng</th>
                      <th className="px-3 py-2 text-right">Thành tiền</th>
                      <th className="w-8 px-2 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="px-3 py-2.5">
                          <div className="font-medium text-gray-800">{p.name}</div>
                          {p.sku && <div className="text-xs text-gray-400">{p.sku}</div>}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="relative">
                            <input
                              type="number"
                              value={p.price}
                              onChange={(e) => updatePrice(p.id, Number(e.target.value))}
                              className="w-28 text-right border border-gray-200 rounded px-2 pr-6 py-1 text-sm outline-none focus:border-blue-400"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₫</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <input
                            type="number"
                            value={p.qty}
                            onChange={(e) => updateQty(p.id, Number(e.target.value))}
                            className="w-20 text-right border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-blue-400"
                          />
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-700 whitespace-nowrap">
                          {fmt(p.price * p.qty)}
                        </td>
                        <td className="px-2 py-2.5">
                          <button
                            onClick={() => removeProduct(p.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Thanh toán */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2.5">
              <h2 className="font-semibold text-gray-800 text-sm">Thanh toán</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tổng tiền</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-xs">{'-------'}</span>
                    <span className="text-gray-800 font-medium w-20 text-right">{fmt(subtotal)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <button className="text-blue-500 hover:underline text-left">Thêm giảm giá (F6)</button>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-xs">{'-------'}</span>
                    <div className="relative w-20">
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-full text-right border-b border-gray-200 pr-4 py-0.5 text-sm outline-none focus:border-blue-400 bg-transparent"
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₫</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <button className="text-blue-500 hover:underline text-left">Chi phí nhập hàng (F7)</button>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-xs">{'-------'}</span>
                    <div className="relative w-20">
                      <input
                        type="number"
                        value={importFee}
                        onChange={(e) => setImportFee(Number(e.target.value))}
                        className="w-full text-right border-b border-gray-200 pr-4 py-0.5 text-sm outline-none focus:border-blue-400 bg-transparent"
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₫</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 font-medium text-gray-800">
                  <span>Tiền cần trả NCC</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>
            </section>
          </div>

          {/* ─── RIGHT ─── */}
          <div className="space-y-4">
            {/* Nhà cung cấp */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <h2 className="font-semibold text-gray-800 text-sm">Nhà cung cấp</h2>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Tìm theo tên, SĐT, mã NCC...(F4)"
                  value={supplierSearch}
                  onChange={(e) => setSupplierSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-400"
                />
              </div>
            </section>

            {/* Thông tin bổ sung */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h2 className="font-semibold text-gray-800 text-sm">Thông tin bổ sung</h2>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Nhân viên phụ trách</label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                >
                  <option>Trang Đàm</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Ngày nhập dự kiến</label>
                <div className="relative">
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    placeholder="Chọn ngày nhập dự kiến"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Ngày hóa đơn</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  placeholder="Chọn ngày hóa đơn"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Mã đơn nhập</label>
                <input
                  type="text"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  placeholder="Nhập mã đơn"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Tham chiếu</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Nhập mã tham chiếu"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </section>

            {/* Ghi chú */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <h2 className="font-semibold text-gray-800 text-sm">Ghi chú</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="VD: Chỉ nhận hàng trong giờ hành chính"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
              />
            </section>

            {/* Tag */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Tag</h2>
                <button className="text-xs text-blue-500 hover:underline">Danh sách tag</button>
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Tìm kiếm hoặc thêm mới tag"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5 text-xs">
                      {t}
                      <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="hover:text-gray-800">×</button>
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

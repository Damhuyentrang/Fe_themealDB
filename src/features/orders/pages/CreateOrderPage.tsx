import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductLine {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  discount: number;
}

interface OrderForm {
  products: ProductLine[];
  discount: number;
  shippingFee: number;
  paymentMethod: string;
  shippingType: 'carrier' | 'self' | 'delivered' | 'later';
  pickupAddress: string;
  cod: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingNote: string;
  shippingRequirement: string;
  source: string;
  customerId: string;
  customerSearch: string;
  note: string;
  branch: string;
  staff: string;
  customCode: string;
  orderDate: string;
  deliveryDate: string;
  tags: string[];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-medium text-gray-800">{title}</span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ProductsSection({ products, onAdd }: { products: ProductLine[]; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="search"
              placeholder="Tìm theo tên, mã SKU... (F3)"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-blue-400"
            />
          </div>
          <button className="text-sm border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50">
            Chọn nhiều
          </button>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 ml-4 cursor-pointer">
          <input type="checkbox" className="rounded" />
          Tách dòng
        </label>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-sm mb-4">Bạn chưa thêm sản phẩm nào</p>
          <button
            onClick={onAdd}
            className="text-sm border border-blue-500 text-blue-600 rounded px-4 py-1.5 hover:bg-blue-50"
          >
            Thêm sản phẩm
          </button>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-100">
              <th className="px-4 py-2 text-left">Sản phẩm</th>
              <th className="px-4 py-2 text-right">Đơn giá</th>
              <th className="px-4 py-2 text-center">Số lượng</th>
              <th className="px-4 py-2 text-right">Giảm giá</th>
              <th className="px-4 py-2 text-right">Thành tiền</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sku}</p>
                </td>
                <td className="px-4 py-3 text-right">{p.price.toLocaleString('vi-VN')}đ</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={p.quantity}
                    min={1}
                    className="w-16 text-center border border-gray-200 rounded py-1 text-sm"
                    readOnly
                  />
                </td>
                <td className="px-4 py-3 text-right text-gray-500">{p.discount > 0 ? `${p.discount.toLocaleString('vi-VN')}đ` : '---'}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {((p.price - p.discount) * p.quantity).toLocaleString('vi-VN')}đ
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="px-4 py-2 border-t border-gray-100">
        <button className="text-sm text-blue-500 hover:text-blue-600">
          ⊕ Thêm sản phẩm hoặc dịch vụ tùy chỉnh
        </button>
      </div>
    </div>
  );
}

function PaymentSection({ form, onChange }: { form: OrderForm; onChange: (key: keyof OrderForm, value: unknown) => void }) {
  const subtotal = form.products.reduce((s, p) => s + (p.price - p.discount) * p.quantity, 0);
  const total = subtotal - form.discount + form.shippingFee;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800">Thanh toán</div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền hàng</span>
          <span className="font-medium">{subtotal > 0 ? `${subtotal.toLocaleString('vi-VN')}đ` : '---'}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <button className="text-blue-500 hover:text-blue-600">Thêm giảm giá (F6)</button>
          <span className="text-gray-500">{form.discount > 0 ? `-${form.discount.toLocaleString('vi-VN')}đ` : '---'}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <button className="text-blue-500 hover:text-blue-600">Thêm phí giao hàng</button>
          <span className="text-gray-500">{form.shippingFee > 0 ? `${form.shippingFee.toLocaleString('vi-VN')}đ` : '---'}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-3">
          <span>Thành tiền</span>
          <span className="text-lg">{total.toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="pt-2">
          <select
            value={form.paymentMethod}
            onChange={(e) => onChange('paymentMethod', e.target.value)}
            className="w-48 text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
          >
            <option value="cash">Tiền mặt</option>
            <option value="transfer">Chuyển khoản</option>
            <option value="card">Thẻ</option>
            <option value="cod">COD</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function InvoiceSection() {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-medium text-gray-800">Hóa đơn điện tử</span>
        <button className="text-sm text-blue-500 hover:text-blue-600">Thêm thông tin xuất hóa đơn</button>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-gray-500">Cung cấp thông tin để xuất hóa đơn điện tử</p>
      </div>
    </div>
  );
}

const SHIPPING_TYPES = [
  { value: 'carrier', label: 'Công vận chuyển' },
  { value: 'self', label: 'Tự giao hàng' },
  { value: 'delivered', label: 'Đã giao hàng' },
  { value: 'later', label: 'Giao hàng sau' },
] as const;

function ShippingSection({ form, onChange }: { form: OrderForm; onChange: (key: keyof OrderForm, value: unknown) => void }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-100 font-medium text-gray-800">Giao hàng</div>
      <div className="p-4 space-y-4">
        {/* Shipping type tabs */}
        <div className="flex gap-2">
          {SHIPPING_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange('shippingType', t.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                form.shippingType === t.value
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {form.shippingType === t.value && <span className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]">✓</span>}
              {t.label}
            </button>
          ))}
        </div>

        {form.shippingType === 'carrier' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Địa chỉ lấy hàng</label>
                <select
                  value={form.pickupAddress}
                  onChange={(e) => onChange('pickupAddress', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
                >
                  <option value="main">Cửa hàng chính</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-600">Địa chỉ giao hàng</label>
                  <button className="text-gray-400 hover:text-gray-600 text-sm">✎</button>
                </div>
                <p className="text-sm text-gray-700">—</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tiền thu hộ COD</label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.cod}
                    onChange={(e) => onChange('cod', Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 pr-6"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">đ</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Khối lượng</label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) => onChange('weight', Number(e.target.value))}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 pr-6"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">g</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-3 gap-2">
                {(['length', 'width', 'height'] as const).map((dim, i) => (
                  <div key={dim}>
                    <label className="block text-xs text-gray-500 mb-1">{['Dài', 'Rộng', 'Cao'][i]}</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form[dim]}
                        onChange={(e) => onChange(dim, Number(e.target.value))}
                        className="w-full text-sm border border-gray-200 rounded px-2 py-2 outline-none focus:border-blue-400 pr-7"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">cm</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ghi chú</label>
                <textarea
                  value={form.shippingNote}
                  onChange={(e) => onChange('shippingNote', e.target.value)}
                  rows={3}
                  maxLength={255}
                  placeholder="Nhập ghi chú"
                  className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 resize-none"
                />
                <p className="text-xs text-gray-400 text-right">{form.shippingNote.length}/255</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Yêu cầu giao hàng</label>
              <select
                value={form.shippingRequirement}
                onChange={(e) => onChange('shippingRequirement', e.target.value)}
                className="w-64 text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
              >
                <option value="cho_xem">Cho xem hàng không cho thử</option>
                <option value="cho_thu">Cho xem và cho thử</option>
                <option value="khong_cho_xem">Không cho xem hàng</option>
              </select>
            </div>

            {form.weight === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <p className="font-medium mb-1">⚠ Để sử dụng dịch vụ vận chuyển, bạn cần:</p>
                <ul className="list-disc ml-4 space-y-0.5 text-yellow-700">
                  <li>Bổ sung thông tin địa chỉ, điện thoại giao hàng <button className="text-blue-500 underline">tại đây</button></li>
                  <li>Cân nặng phải lớn hơn 0</li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RightSidebar({ form, onChange }: { form: OrderForm; onChange: (key: keyof OrderForm, value: unknown) => void }) {
  const [tagInput, setTagInput] = useState('');

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      onChange('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    onChange('tags', form.tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-4">
      {/* Nguồn đơn */}
      <SectionCard title="Nguồn đơn">
        <select
          value={form.source}
          onChange={(e) => onChange('source', e.target.value)}
          className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
        >
          <option value="">Chọn nguồn đơn</option>
          <option value="website">Website</option>
          <option value="facebook">Facebook</option>
          <option value="shopee">Shopee</option>
       
      
          <option value="tiktok">TikTok Shop</option>
          <option value="phone">Điện thoại</option>
        </select>
        <p className="text-xs text-gray-400 mt-2">
          Nguồn đơn sẽ giúp xác định nguồn bán hàng và giúp phân loại đơn hàng hiệu quả
        </p>
      </SectionCard>

      {/* Khách hàng */}
      <SectionCard title="Khách hàng">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="search"
            placeholder="Tìm theo tên, SĐT... (F4)"
            value={form.customerSearch}
            onChange={(e) => onChange('customerSearch', e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded outline-none focus:border-blue-400"
          />
        </div>
      </SectionCard>

      {/* Ghi chú */}
      <SectionCard title="Ghi chú">
        <textarea
          value={form.note}
          onChange={(e) => onChange('note', e.target.value)}
          placeholder="VD: Nhận hàng ghi công nợ"
          rows={3}
          className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400 resize-none"
        />
      </SectionCard>

      {/* Thông tin bổ sung */}
      <SectionCard title="Thông tin bổ sung">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Bán tại chi nhánh</label>
            <select
              value={form.branch}
              onChange={(e) => onChange('branch', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
            >
              <option value="main">Cửa hàng chính</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nhân viên phụ trách</label>
            <select
              value={form.staff}
              onChange={(e) => onChange('staff', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
            >
              <option value="trang_dam">Trang Đầm</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Mã đơn tùy chỉnh <span className="text-blue-400 cursor-help">ⓘ</span>
            </label>
            <input
              type="text"
              value={form.customCode}
              onChange={(e) => onChange('customCode', e.target.value)}
              placeholder="Nhập mã đơn hàng (tùy chọn)"
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Ngày đặt hàng <span className="text-blue-400 cursor-help">ⓘ</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.orderDate}
                onChange={(e) => onChange('orderDate', e.target.value)}
                placeholder="Chọn ngày đặt hàng"
                className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Giá trị chỉ ghi nhận khi tạo đơn hàng</p>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ngày hẹn giao</label>
            <input
              type="date"
              value={form.deliveryDate}
              onChange={(e) => onChange('deliveryDate', e.target.value)}
              placeholder="Chọn ngày hẹn giao"
              className="w-full text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-600">Tag</label>
              <button className="text-xs text-blue-500 hover:text-blue-600">Danh sách tag</button>
            </div>
            <div className="border border-gray-200 rounded px-3 py-2 min-h-[38px] flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs rounded px-2 py-0.5">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-600">✕</button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder={form.tags.length === 0 ? 'Tìm kiếm hoặc thêm mới tag' : ''}
                className="flex-1 min-w-0 text-sm outline-none bg-transparent"
              />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEFAULT_FORM: OrderForm = {
  products: [],
  discount: 0,
  shippingFee: 0,
  paymentMethod: 'cash',
  shippingType: 'carrier',
  pickupAddress: 'main',
  cod: 0,
  weight: 0,
  length: 10,
  width: 10,
  height: 10,
  shippingNote: '',
  shippingRequirement: 'cho_xem',
  source: '',
  customerId: '',
  customerSearch: '',
  note: '',
  branch: 'main',
  staff: 'trang_dam',
  customCode: '',
  orderDate: '',
  deliveryDate: '',
  tags: [],
};

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<OrderForm>(DEFAULT_FORM);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onChange = (key: keyof OrderForm, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveDraft = () => {
    console.log('Save draft', form);
    navigate(ROUTES.ORDERS);
  };

  const handleCreate = () => {
    console.log('Create order', form);
    navigate(ROUTES.ORDERS);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.ORDERS)}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-100 text-gray-500"
        >
          ←
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Tạo đơn hàng</h1>
      </div>

      {/* Body */}
      <div className="flex gap-4 items-start">
        {/* Left column */}
        <div className="flex-1 space-y-4 min-w-0">
          <ProductsSection products={form.products} onAdd={() => {}} />
          <PaymentSection form={form} onChange={onChange} />
          <InvoiceSection />
          <ShippingSection form={form} onChange={onChange} />
        </div>

        {/* Right sidebar */}
        <div className="w-72 shrink-0">
          <RightSidebar form={form} onChange={onChange} />
        </div>
      </div>

      {/* Footer actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-3 flex items-center justify-end gap-3 mt-4">
        <button
          onClick={handleSaveDraft}
          className="text-sm border border-gray-300 rounded px-5 py-2 hover:bg-gray-50 font-medium text-gray-700"
        >
          Lưu nháp
        </button>
        <div className="relative flex">
          <button
            onClick={handleCreate}
            className="text-sm bg-blue-600 text-white rounded-l px-5 py-2 hover:bg-blue-700 font-medium"
          >
            {form.shippingType === 'carrier' ? 'Tạo đơn và giao hàng' : 'Tạo đơn và xác nhận'}
          </button>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="text-sm bg-blue-600 text-white rounded-r px-2 py-2 hover:bg-blue-700 border-l border-blue-500"
          >
            ▾
          </button>
          {dropdownOpen && (
            <div className="absolute bottom-full right-0 mb-1 bg-white border border-gray-200 rounded shadow-lg text-sm w-48 z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Tạo đơn và xác nhận</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Tạo đơn và giao hàng</button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Lưu nháp</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

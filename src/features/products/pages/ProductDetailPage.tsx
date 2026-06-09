import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const CHANNELS = [
  { key: 'omni',    label: 'Chat OmniAI', sub: 'Áp dụng bảng giá Chat OmniAI', hasInfo: false },
  { key: 'fb',      label: 'Facebook',    sub: null,                             hasInfo: false },
  { key: 'tiktok',  label: 'Tiktok Shop', sub: 'Áp dụng bảng giá Tiktok Shop',  hasInfo: true  },
  { key: 'website', label: 'Website',     sub: null,                             hasInfo: false },
];

const WEIGHT_UNITS = ['g', 'kg', 'lbs', 'oz'];

// Mock product data keyed by id
const MOCK_PRODUCT = {
  name: 'Vòng H59',
  sku: '',
  barcode: '',
  unit: '',
  description: '',
  price: '0',
  comparePrice: '',
  costPrice: '0',
  applyTax: false,
  trackInventory: true,
  allowNegative: false,
  trackBatch: false,
  stockQty: 10,
  canSell: 10,
  requiresShipping: true,
  weight: '0',
  weightUnit: 'g',
  channels: { omni: true, fb: true, tiktok: true, website: true },
  category: 'vong',
  categoryTags: ['Vòng'],
  productType: 'vàng, bán to',
  tags: [] as string[],
  theme: 'product',
  images: [] as string[],
  websitePublishedAt: '09/06/2026 13:41',
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName]                 = useState(MOCK_PRODUCT.name);
  const [sku, setSku]                   = useState(MOCK_PRODUCT.sku);
  const [barcode, setBarcode]           = useState(MOCK_PRODUCT.barcode);
  const [unit, setUnit]                 = useState(MOCK_PRODUCT.unit);
  const [description, setDescription]   = useState(MOCK_PRODUCT.description);
  const [price, setPrice]               = useState(MOCK_PRODUCT.price);
  const [comparePrice, setComparePrice] = useState(MOCK_PRODUCT.comparePrice);
  const [costPrice, setCostPrice]       = useState(MOCK_PRODUCT.costPrice);
  const [applyTax, setApplyTax]         = useState(MOCK_PRODUCT.applyTax);
  const [trackInventory, setTrackInventory] = useState(MOCK_PRODUCT.trackInventory);
  const [allowNegative, setAllowNegative]   = useState(MOCK_PRODUCT.allowNegative);
  const [trackBatch, setTrackBatch]         = useState(MOCK_PRODUCT.trackBatch);
  const [stockQty, setStockQty]             = useState(MOCK_PRODUCT.stockQty);
  const [requiresShipping, setRequiresShipping] = useState(MOCK_PRODUCT.requiresShipping);
  const [weight, setWeight]             = useState(MOCK_PRODUCT.weight);
  const [weightUnit, setWeightUnit]     = useState(MOCK_PRODUCT.weightUnit);
  const [channels, setChannels]         = useState(MOCK_PRODUCT.channels);
  const [category, setCategory]         = useState(MOCK_PRODUCT.category);
  const [categoryTags, setCategoryTags] = useState(MOCK_PRODUCT.categoryTags);
  const [productType, setProductType]   = useState(MOCK_PRODUCT.productType);
  const [tagInput, setTagInput]         = useState('');
  const [tags, setTags]                 = useState<string[]>(MOCK_PRODUCT.tags);
  const [theme, setTheme]               = useState(MOCK_PRODUCT.theme);
  const [images, setImages]             = useState<string[]>(MOCK_PRODUCT.images);
  const [websiteExpanded, setWebsiteExpanded] = useState(false);

  const toggleChannel = (key: string) =>
    setChannels((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const toggleAllChannels = () => {
    const allOn = Object.values(channels).every(Boolean);
    setChannels({ omni: !allOn, fb: !allOn, tiktok: !allOn, website: !allOn });
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach((f) =>
      setImages((prev) => [...prev, URL.createObjectURL(f)]),
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach((f) => {
      if (f.type.startsWith('image/'))
        setImages((prev) => [...prev, URL.createObjectURL(f)]);
    });
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <div className="space-y-0 -m-6">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm"
          >
            ←
          </button>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-800 text-sm">{name}</span>
            <button className="text-gray-400 hover:text-gray-600 text-xs">▾</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1 text-gray-600">
            🌐 Xem trên web
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-600">
            Thêm phiên bản quy đổi
          </button>
          <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 text-gray-600">
            Thao tác khác ▾
          </button>
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button className="px-2 py-1.5 hover:bg-gray-50 text-gray-500 border-r border-gray-200 text-sm">‹</button>
            <button className="px-2 py-1.5 hover:bg-gray-50 text-gray-500 text-sm">›</button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-[1fr_320px] gap-4 items-start">
          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-4">
            {/* Thông tin sản phẩm */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Thông tin sản phẩm</h2>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mã SKU</label>
                  <input type="text" value={sku} onChange={(e) => setSku(e.target.value)}
                    placeholder="Nhập mã SKU (tối đa 50 ký tự)"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mã vạch / Barcode</label>
                  <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Nhập mã vạch/Barcode (tối đa 50 ký tự)"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Đơn vị tính</label>
                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)}
                  placeholder="Nhập đơn vị tính"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mô tả</label>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50 flex-wrap">
                    <select className="text-xs border border-gray-200 rounded px-1 py-0.5 outline-none"><option>Đoạn</option></select>
                    <select className="text-xs border border-gray-200 rounded px-1 py-0.5 outline-none w-12"><option>14</option></select>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    {['B','I','U'].map((f) => (
                      <button key={f} className="w-6 h-6 text-xs font-medium rounded hover:bg-gray-200 text-gray-600">{f}</button>
                    ))}
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">A</button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">≡</button>
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">⊞</button>
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">···</button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">&lt;/&gt;</button>
                  </div>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    rows={5} className="w-full px-3 py-2 text-sm outline-none resize-none" />
                  <div className="px-3 py-1.5 border-t border-gray-100 bg-gray-50">
                    <span className="text-xs text-gray-400">HTML: {description.length}/100000</span>
                  </div>
                </div>
                <button className="mt-1.5 text-xs text-blue-500 hover:underline">Thêm mô tả ngắn</button>
              </div>
            </section>

            {/* Thông tin giá */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Thông tin giá</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Giá bán</label>
                  <div className="relative">
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-gray-200 rounded-md pl-3 pr-7 py-2 text-sm outline-none focus:border-blue-400" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
                    Giá so sánh <span className="text-gray-400 cursor-help text-xs" title="Giá gốc để hiển thị mức giảm giá">ⓘ</span>
                  </label>
                  <div className="relative">
                    <input type="text" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)}
                      placeholder="Nhập giá so sánh sản phẩm"
                      className="w-full border border-gray-200 rounded-md pl-3 pr-7 py-2 text-sm outline-none focus:border-blue-400" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                  </div>
                </div>
              </div>
              <div className="w-1/2 pr-2">
                <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
                  Giá vốn <span className="text-gray-400 cursor-help text-xs" title="Chi phí nhập hàng">ⓘ</span>
                </label>
                <div className="relative">
                  <input type="text" value={costPrice} onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full border border-gray-200 rounded-md pl-3 pr-7 py-2 text-sm outline-none focus:border-blue-400" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={applyTax} onChange={(e) => setApplyTax(e.target.checked)} className="rounded" />
                Áp dụng thuế
              </label>
            </section>

            {/* Thông tin kho */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Thông tin kho</h2>
                <div className="flex gap-3">
                  <button className="text-xs text-blue-500 hover:underline">Lịch sử thay đổi kho</button>
                  <button className="text-xs text-blue-500 hover:underline">Chọn kho lưu trữ</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={trackInventory} onChange={(e) => setTrackInventory(e.target.checked)} className="rounded" />
                  Quản lý số lượng tồn kho
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={allowNegative} onChange={(e) => setAllowNegative(e.target.checked)} className="rounded" />
                  Cho phép bán âm
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={trackBatch} onChange={(e) => setTrackBatch(e.target.checked)} className="rounded" />
                  Quản lý sản phẩm theo lô - HSD
                </label>
              </div>

              {trackInventory && (
                <>
                  <div className="border-b border-gray-200">
                    <button className="px-0 py-1.5 text-xs font-medium border-b-2 border-blue-500 text-blue-600">Tất cả</button>
                  </div>
                  <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
                        <th className="px-3 py-2 text-left font-medium">Kho lưu trữ</th>
                        <th className="px-3 py-2 text-center font-medium">Tồn kho</th>
                        <th className="px-3 py-2 text-center font-medium">Có thể bán</th>
                        <th className="px-3 py-2 text-center font-medium">Đang giao dịch</th>
                        <th className="px-3 py-2 text-center font-medium">Đang đóng gói</th>
                        <th className="px-3 py-2 text-center font-medium">Hàng đặt</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2.5">
                          <div className="text-sm text-gray-700">Cửa hàng chính</div>
                          <button className="text-xs text-blue-500 hover:underline">Vị trí lưu kho</button>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <input type="number" value={stockQty}
                              onChange={(e) => setStockQty(Number(e.target.value))}
                              className="w-16 text-center border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-blue-400" />
                            <button className="text-gray-400 hover:text-gray-600 text-xs">✎</button>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-center text-gray-700">{stockQty}</td>
                        <td className="px-3 py-2.5 text-center text-gray-500">0</td>
                        <td className="px-3 py-2.5 text-center text-gray-500">0</td>
                        <td className="px-3 py-2.5 text-center text-gray-500">0</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
            </section>

            {/* Vận chuyển */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Vận chuyển</h2>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={requiresShipping} onChange={(e) => setRequiresShipping(e.target.checked)} className="rounded" />
                Sản phẩm yêu cầu vận chuyển
              </label>
              {requiresShipping && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Khối lượng</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                      className="w-32 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
                    <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}
                      className="border border-gray-200 rounded-md px-2 py-2 text-sm outline-none focus:border-blue-400">
                      {WEIGHT_UNITS.map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </section>

            {/* Thuộc tính */}
            <section className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-800 text-sm">Thuộc tính</h2>
                <button className="text-xs text-blue-500 hover:underline">Thêm thuộc tính</button>
              </div>
              <p className="text-xs text-gray-500">
                Sản phẩm có nhiều thuộc tính khác nhau. Ví dụ: kích thước, màu sắc.
              </p>
            </section>

            {/* Tối ưu SEO */}
            <section className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-800 text-sm">Tối ưu SEO</h2>
                <button className="text-xs text-blue-500 hover:underline">Tuỳ chỉnh SEO</button>
              </div>
              <p className="text-xs text-gray-500">
                Xin hãy nhập Tiêu đề và Mô tả để xem trước kết quả tìm kiếm của sản phẩm này.
              </p>
            </section>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-4">
            {/* Ảnh sản phẩm */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h2 className="font-semibold text-gray-800 text-sm">Ảnh sản phẩm</h2>
              <div
                className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <span className="text-2xl text-gray-300">+</span>
                <p className="text-xs text-gray-500 text-center">
                  Kéo thả hoặc <span className="text-blue-500">thêm ảnh từ URL</span>
                </p>
                <p className="text-xs text-blue-500">Tải ảnh lên từ thiết bị</p>
                <p className="text-xs text-gray-400">(Dung lượng ảnh tối đa 2MB)</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageFile} />
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="w-full aspect-square object-cover rounded border border-gray-200" />
                      <button onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Kênh bán hàng */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Kênh bán hàng</h2>
                <button onClick={toggleAllChannels} className="text-xs text-blue-500 hover:underline">
                  {Object.values(channels).every(Boolean) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>
              {CHANNELS.map((ch) => (
                <div key={ch.key} className="space-y-0.5">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={channels[ch.key as keyof typeof channels]}
                      onChange={() => toggleChannel(ch.key)} className="rounded" />
                    <span>{ch.label}</span>
                    {ch.hasInfo && <span className="text-gray-400 text-xs cursor-help" title="Thông tin kênh">ⓘ</span>}
                    {ch.key === 'tiktok' && <button className="ml-auto text-gray-400 hover:text-gray-600 text-xs">▾</button>}
                  </label>
                  {channels[ch.key as keyof typeof channels] && ch.sub && (
                    <p className="ml-5 text-xs text-blue-500 hover:underline cursor-pointer">{ch.sub}</p>
                  )}
                  {channels[ch.key as keyof typeof channels] && ch.key === 'website' && (
                    <div className="ml-5 space-y-0.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Hiển thị: {MOCK_PRODUCT.websitePublishedAt}</span>
                        <button className="text-gray-400 hover:text-gray-600">✎</button>
                        <button className="text-gray-400 hover:text-red-500">🗑</button>
                      </div>
                      <button onClick={() => setWebsiteExpanded((v) => !v)} className="text-xs text-blue-500 hover:underline">
                        Xem thêm {websiteExpanded ? '▲' : '▾'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Bảng giá theo nhóm khách hàng */}
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-800 text-sm">Bảng giá theo nhóm khách hàng</h2>
                <button className="text-gray-400 hover:text-gray-600 text-sm">✎</button>
              </div>
              <p className="text-xs text-gray-400">Không có dữ liệu</p>
            </section>

            {/* Danh mục */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Danh mục
                <span className="text-gray-400 text-xs cursor-help" title="Phân loại sản phẩm theo danh mục">ⓘ</span>
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option value="vong">Đã chọn 1 danh mục</option>
                <option value="nhan">Nhẫn</option>
                <option value="can">Cân</option>
              </select>
              <div className="flex flex-wrap gap-1.5">
                {categoryTags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2 py-0.5 text-xs">
                    {t}
                    <button onClick={() => setCategoryTags((p) => p.filter((x) => x !== t))} className="hover:text-blue-800 leading-none">×</button>
                  </span>
                ))}
              </div>
            </section>

            {/* Loại sản phẩm */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Loại sản phẩm</label>
              <select value={productType} onChange={(e) => setProductType(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option value="">Chọn loại sản phẩm</option>
                <option value="vàng, bán to">vàng, bán to</option>
                <option value="bạc">bạc</option>
              </select>
            </section>

            {/* Tag */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Tag</label>
                <button className="text-xs text-blue-500 hover:underline">Danh sách tag</button>
              </div>
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag} placeholder="Tìm kiếm hoặc thêm mới"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400" />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5 text-xs">
                      {t}
                      <button onClick={() => setTags((p) => p.filter((x) => x !== t))} className="hover:text-gray-800 leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Khung giao diện */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Khung giao diện</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option value="product">product</option>
              </select>
            </section>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button className="text-sm border border-red-400 text-red-500 rounded-md px-4 py-2 hover:bg-red-50 font-medium">
            Xóa
          </button>
          <button className="text-sm bg-blue-600 text-white rounded-md px-5 py-2 hover:bg-blue-700 font-medium">
            Lưu
          </button>
        </div>

        <p className="text-center text-sm text-gray-400">
          Tìm hiểu thêm về{' '}
          <button className="text-blue-500 hover:underline">sản phẩm</button>
        </p>
      </div>
    </div>
  );
}

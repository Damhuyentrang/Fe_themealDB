import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const CHANNELS = [
  { key: 'tiktok', label: 'Tiktok Shop', sub: 'Áp dụng bảng giá Tiktok Shop' },
  { key: 'website', label: 'Website', sub: 'Đặt lịch hiển thị' },
  { key: 'pos', label: 'POS', sub: 'Áp dụng bảng giá POS' },
];

const WEIGHT_UNITS = ['g', 'kg', 'lbs', 'oz'];

export default function CreateProductPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic info
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');

  // Pricing
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [applyTax, setApplyTax] = useState(false);

  // Inventory
  const [trackInventory, setTrackInventory] = useState(true);
  const [allowNegative, setAllowNegative] = useState(false);
  const [trackBatch, setTrackBatch] = useState(false);
  const [stockQty, setStockQty] = useState('');

  // Shipping
  const [requiresShipping, setRequiresShipping] = useState(true);
  const [weight, setWeight] = useState('1');
  const [weightUnit, setWeightUnit] = useState('g');

  // Channels
  const [channels, setChannels] = useState<Record<string, boolean>>({
    tiktok: true,
    website: true,
    pos: true,
  });

  // Categorization
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [productType, setProductType] = useState('');
  const [taxGroup, setTaxGroup] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Nhẫn']);
  const [theme, setTheme] = useState('product');

  // Image
  const [images, setImages] = useState<string[]>([]);

  const toggleChannel = (key: string) =>
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleAllChannels = () => {
    const allOn = Object.values(channels).every(Boolean);
    setChannels({ tiktok: !allOn, website: !allOn, pos: !allOn });
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, url]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setImages((prev) => [...prev, url]);
      }
    });
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const handleSubmit = () => {
    // TODO: call API
    navigate(ROUTES.PRODUCTS);
  };

  return (
    <div className="space-y-0 -m-6">
      {/* Top action bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(ROUTES.PRODUCTS)}
          className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
        >
          Thêm sản phẩm
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Page title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Thêm sản phẩm</h1>
        </div>

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
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mã SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Nhập mã SKU (tối đa 50 ký tự)"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mã vạch / Barcode</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Nhập mã vạch/Barcode (tối đa 50 ký tự)"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Đơn vị tính</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Nhập đơn vị tính"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>

              {/* Description editor (simplified toolbar) */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mô tả</label>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50 flex-wrap">
                    <select className="text-xs border border-gray-200 rounded px-1 py-0.5 outline-none">
                      <option>Đoạn</option>
                      <option>Tiêu đề 1</option>
                      <option>Tiêu đề 2</option>
                    </select>
                    <select className="text-xs border border-gray-200 rounded px-1 py-0.5 outline-none w-12">
                      {[10,12,14,16,18,20,24].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    {['B','I','U'].map((f) => (
                      <button key={f} className="w-6 h-6 text-xs font-medium rounded hover:bg-gray-200 text-gray-600">{f}</button>
                    ))}
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">A</button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">≡</button>
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">⊞</button>
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">⊟</button>
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">···</button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">&lt;/&gt;</button>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 text-sm outline-none resize-none"
                  />
                  <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-100 bg-gray-50">
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
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Nhập giá bán sản phẩm"
                      className="w-full border border-gray-200 rounded-md pl-3 pr-7 py-2 text-sm outline-none focus:border-blue-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
                    Giá so sánh
                    <span className="text-gray-400 cursor-help" title="Giá gốc để hiển thị mức giảm giá">ⓘ</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(e.target.value)}
                      placeholder="Nhập giá so sánh sản phẩm"
                      className="w-full border border-gray-200 rounded-md pl-3 pr-7 py-2 text-sm outline-none focus:border-blue-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                  </div>
                </div>
              </div>
              <div className="w-1/2 pr-2">
                <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
                  Giá vốn
                  <span className="text-gray-400 cursor-help" title="Chi phí nhập hàng">ⓘ</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="Nhập giá vốn sản phẩm"
                    className="w-full border border-gray-200 rounded-md pl-3 pr-7 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₫</span>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyTax}
                  onChange={(e) => setApplyTax(e.target.checked)}
                  className="rounded"
                />
                Áp dụng thuế
              </label>
            </section>

            {/* Thông tin kho */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Thông tin kho</h2>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Lưu kho tại</label>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400">
                  <option>Cửa hàng chính</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trackInventory}
                    onChange={(e) => setTrackInventory(e.target.checked)}
                    className="rounded"
                  />
                  Quản lý số lượng tồn kho
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowNegative}
                    onChange={(e) => setAllowNegative(e.target.checked)}
                    className="rounded"
                  />
                  Cho phép bán âm
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trackBatch}
                    onChange={(e) => setTrackBatch(e.target.checked)}
                    className="rounded"
                  />
                  Quản lý sản phẩm theo lô - HSD
                </label>
              </div>

              {trackInventory && (
                <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500">
                      <th className="px-3 py-2 text-left font-medium">Kho lưu trữ</th>
                      <th className="px-3 py-2 text-left font-medium">Tồn kho</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2.5">
                        <div className="text-sm text-gray-700">Cửa hàng chính</div>
                        <div className="text-xs text-blue-500 hover:underline cursor-pointer">Vị trí lưu kho</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          value={stockQty}
                          onChange={(e) => setStockQty(e.target.value)}
                          className="w-24 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-blue-400"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </section>

            {/* Vận chuyển */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Vận chuyển</h2>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresShipping}
                  onChange={(e) => setRequiresShipping(e.target.checked)}
                  className="rounded"
                />
                Sản phẩm yêu cầu vận chuyển
              </label>
              {requiresShipping && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Khối lượng</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-32 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                    />
                    <select
                      value={weightUnit}
                      onChange={(e) => setWeightUnit(e.target.value)}
                      className="border border-gray-200 rounded-md px-2 py-2 text-sm outline-none focus:border-blue-400"
                    >
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
                  Kéo thả hoặc{' '}
                  <button className="text-blue-500 hover:underline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    thêm ảnh từ URL
                  </button>
                </p>
                <p className="text-xs text-blue-500 hover:underline cursor-pointer">Tải ảnh lên từ thiết bị</p>
                <p className="text-xs text-gray-400">(Dung lượng ảnh tối đa 2MB)</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageFile} />
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="w-full aspect-square object-cover rounded border border-gray-200" />
                      <button
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Kênh bán hàng */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Kênh bán hàng</h2>
                <button onClick={toggleAllChannels} className="text-xs text-blue-500 hover:underline">
                  {Object.values(channels).every(Boolean) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>
              {CHANNELS.map((ch) => (
                <div key={ch.key}>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels[ch.key]}
                      onChange={() => toggleChannel(ch.key)}
                      className="rounded"
                    />
                    {ch.label}
                  </label>
                  {channels[ch.key] && (
                    <button className="ml-5 text-xs text-blue-500 hover:underline">{ch.sub}</button>
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Danh mục
                  <span className="text-gray-400 cursor-help text-xs" title="Phân loại sản phẩm theo danh mục">ⓘ</span>
                </label>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Đã chọn 1 danh mục</option>
                <option value="nhan">Nhẫn</option>
                <option value="vong">Vòng tay</option>
                <option value="day_chuyen">Dây chuyền</option>
              </select>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2 py-0.5 text-xs">
                  Nhẫn
                  <button className="hover:text-blue-800 leading-none">×</button>
                </span>
              </div>
            </section>

            {/* Nhãn hiệu */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nhãn hiệu</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Chọn nhãn hiệu</option>
              </select>
            </section>

            {/* Loại sản phẩm */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Loại sản phẩm</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Chọn loại sản phẩm</option>
              </select>
            </section>

            {/* Nhóm ngành nghề */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nhóm ngành nghề tính thuế GTGT, TNCN</label>
              <select
                value={taxGroup}
                onChange={(e) => setTaxGroup(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Chọn nhóm ngành nghề</option>
              </select>
            </section>

            {/* Tag */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Tag</label>
                <button className="text-xs text-blue-500 hover:underline">Danh sách tag</button>
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Tìm kiếm hoặc thêm mới"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5 text-xs">
                      {t}
                      <button onClick={() => removeTag(t)} className="hover:text-gray-800 leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Khung giao diện */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Khung giao diện</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="product">product</option>
              </select>
            </section>
          </div>
        </div>

        {/* Bottom submit */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="text-sm bg-blue-600 text-white rounded-md px-5 py-2 hover:bg-blue-700 font-medium"
          >
            Thêm sản phẩm
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

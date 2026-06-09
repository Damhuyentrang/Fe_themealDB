import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const CHANNELS = [
  { key: 'tiktok', label: 'Tiktok Shop', sub: null },
  { key: 'website', label: 'Website', sub: 'Đặt lịch hiển thị' },
  { key: 'pos', label: 'POS', sub: null },
];

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<'manual' | 'auto'>('manual');
  const [channels, setChannels] = useState({ tiktok: true, website: true, pos: true });
  const [image, setImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('collection');

  const toggleChannel = (key: string) =>
    setChannels((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const toggleAll = () => {
    const allOn = Object.values(channels).every(Boolean);
    setChannels({ tiktok: !allOn, website: !allOn, pos: !allOn });
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    // TODO: call API
    navigate(ROUTES.PRODUCT_CATEGORIES);
  };

  return (
    <div className="space-y-0 -m-6">
      {/* Top action bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(ROUTES.PRODUCT_CATEGORIES)}
          className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
        >
          Thêm danh mục
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Page title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.PRODUCT_CATEGORIES)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Thêm danh mục</h1>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-4 items-start">
          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-4">
            {/* Thông tin danh mục */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Thông tin danh mục</h2>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên danh mục"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>

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
                      {[10,12,14,16,18,20,24].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    {['B','I','U'].map((f) => (
                      <button key={f} className="w-6 h-6 text-xs font-medium rounded hover:bg-gray-200 text-gray-600">{f}</button>
                    ))}
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">A</button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">≡</button>
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600 text-[10px]">🖼</button>
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">⊙</button>
                    <button className="w-6 h-6 text-xs rounded hover:bg-gray-200 text-gray-600">⊞</button>
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
                    <span className="text-xs text-gray-400">HTML: {description.length}/30000</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Điều kiện */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
              <h2 className="font-semibold text-gray-800 text-sm">Điều kiện</h2>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value="manual"
                  checked={condition === 'manual'}
                  onChange={() => setCondition('manual')}
                  className="accent-blue-600"
                />
                Thủ công
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value="auto"
                  checked={condition === 'auto'}
                  onChange={() => setCondition('auto')}
                  className="accent-blue-600"
                />
                Tự động
              </label>
              {condition === 'auto' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700">
                  Sản phẩm sẽ được tự động thêm vào danh mục khi thỏa điều kiện.
                </div>
              )}
            </section>

            {/* Tối ưu SEO */}
            <section className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-800 text-sm">Tối ưu SEO</h2>
                <button className="text-xs text-blue-500 hover:underline">Tuỳ chỉnh SEO</button>
              </div>
              <p className="text-xs text-blue-600">
                Thiết lập các thẻ mô tả giúp khách hàng dễ dàng tìm thấy sản phẩm trên công cụ tìm kiếm như Google
              </p>
            </section>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-4">
            {/* Kênh bán hàng */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Kênh bán hàng</h2>
                <button onClick={toggleAll} className="text-xs text-blue-500 hover:underline">
                  {Object.values(channels).every(Boolean) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>
              {CHANNELS.map((ch) => (
                <div key={ch.key}>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels[ch.key as keyof typeof channels]}
                      onChange={() => toggleChannel(ch.key)}
                      className="rounded accent-blue-600"
                    />
                    {ch.label}
                  </label>
                  {ch.sub && channels[ch.key as keyof typeof channels] && (
                    <button className="ml-5 text-xs text-blue-500 hover:underline">{ch.sub}</button>
                  )}
                </div>
              ))}
            </section>

            {/* Ảnh danh mục */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h2 className="font-semibold text-gray-800 text-sm">Ảnh danh mục</h2>
              {image ? (
                <div className="relative group">
                  <img src={image} alt="" className="w-full aspect-video object-cover rounded border border-gray-200" />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <span className="text-xl text-gray-300 font-light">+</span>
                  <p className="text-xs text-gray-500 text-center">
                    Kéo thả hoặc{' '}
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      thêm ảnh từ URL
                    </button>
                  </p>
                  <p className="text-xs text-blue-500 hover:underline cursor-pointer">Tải ảnh từ thiết bị</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFile}
              />
            </section>

            {/* Khung giao diện */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <h2 className="font-semibold text-gray-800 text-sm">Khung giao diện</h2>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="collection">collection</option>
              </select>
            </section>

            {/* Gắn lên menu */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Gắn lên menu</h2>
                <button className="text-xs text-blue-500 hover:underline">Chọn menu</button>
              </div>
              <p className="text-xs text-gray-500">Thêm danh mục vào menu</p>
            </section>
          </div>
        </div>

        {/* Bottom submit */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            className="text-sm bg-blue-600 text-white rounded-md px-5 py-2 hover:bg-blue-700 font-medium"
          >
            Thêm danh mục
          </button>
        </div>
      </div>
    </div>
  );
}

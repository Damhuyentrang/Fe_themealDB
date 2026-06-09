import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PROVINCES = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
];

const DISTRICTS: Record<string, string[]> = {
  'Hà Nội': ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy'],
  'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 5', 'Bình Thạnh', 'Gò Vấp'],
};

const WARDS: Record<string, string[]> = {
  'Hoàn Kiếm': ['Phường Hàng Bạc', 'Phường Hàng Bồ', 'Phường Cửa Đông'],
  'Ba Đình': ['Phường Phúc Xá', 'Phường Trúc Bạch', 'Phường Vĩnh Phúc'],
  'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cô Giang'],
};

export default function CreateSupplierPage() {
  const navigate = useNavigate();

  // Basic info
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [website, setWebsite] = useState('');
  const [fax, setFax] = useState('');

  // Address
  const [country] = useState('Vietnam');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  // Right column
  const [assignee, setAssignee] = useState('Trang Đàm');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const districts = DISTRICTS[province] ?? [];
  const wards = WARDS[district] ?? [];

  const handleProvinceChange = (v: string) => {
    setProvince(v);
    setDistrict('');
    setWard('');
  };

  const handleDistrictChange = (v: string) => {
    setDistrict(v);
    setWard('');
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  return (
    <div className="space-y-0 -m-6">
      {/* Top action bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate('/inventory/suppliers')}
          className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
        >
          Hủy
        </button>
        <button
          onClick={() => navigate('/inventory/suppliers')}
          className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
        >
          Thêm mới
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/inventory/suppliers')}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Thêm mới nhà cung cấp</h1>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-4 items-start">
          {/* ─── LEFT ─── */}
          <div className="space-y-4">
            {/* Thông tin chung */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Thông tin chung</h2>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Tên nhà cung cấp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên nhà cung cấp"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mã nhà cung cấp</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Nhập mã nhà cung cấp"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Số điện thoại</label>
                  <div className="flex">
                    <button className="flex items-center gap-1 border border-r-0 border-gray-200 rounded-l-md px-2 py-2 bg-gray-50 hover:bg-gray-100 text-sm shrink-0">
                      <span>🇻🇳</span>
                      <span className="text-gray-400 text-xs">▾</span>
                    </button>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="flex-1 border border-gray-200 rounded-r-md px-3 py-2 text-sm outline-none focus:border-blue-400 min-w-0"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mã số thuế</label>
                  <input
                    type="text"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="Nhập mã số thuế"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Số fax</label>
                  <input
                    type="text"
                    value={fax}
                    onChange={(e) => setFax(e.target.value)}
                    placeholder="Nhập số fax"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </section>

            {/* Địa chỉ */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Địa chỉ</h2>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Quốc gia</label>
                <div className="relative">
                  <select
                    value={country}
                    disabled
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none bg-white pr-8"
                  >
                    <option>Vietnam</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                </div>
              </div>

              {/* Address card */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Toggle header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                  </div>
                  <span className="text-sm text-gray-700">Địa chỉ mới</span>
                  <button className="text-gray-400 hover:text-gray-600 ml-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                    </svg>
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Tỉnh/Thành phố</label>
                      <div className="relative">
                        <select
                          value={province}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
                        >
                          <option value="">Chọn tỉnh thành</option>
                          {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Quận huyện</label>
                      <div className="relative">
                        <select
                          value={district}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          disabled={!province}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        >
                          <option value="">Chọn quận huyện</option>
                          {districts.map((d) => <option key={d}>{d}</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Phường xã</label>
                      <div className="relative">
                        <select
                          value={ward}
                          onChange={(e) => setWard(e.target.value)}
                          disabled={!district}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        >
                          <option value="">Chọn phường xã</option>
                          {wards.map((w) => <option key={w}>{w}</option>)}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Địa chỉ cụ thể</label>
                      <input
                        type="text"
                        value={addressDetail}
                        onChange={(e) => setAddressDetail(e.target.value)}
                        placeholder="Nhập địa chỉ cụ thể"
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ─── RIGHT ─── */}
          <div className="space-y-4">
            {/* Nhân viên phụ trách */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h2 className="font-semibold text-gray-800 text-sm">Nhân viên phụ trách</h2>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nhân viên phụ trách</label>
                <div className="relative">
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
                  >
                    <option>Trang Đàm</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                </div>
              </div>
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
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5 text-xs">
                      {t}
                      <button onClick={() => removeTag(t)} className="hover:text-gray-800 leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Bottom submit */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => navigate('/inventory/suppliers')}
            className="text-sm border border-gray-200 rounded-md px-5 py-2 hover:bg-gray-50 text-gray-700 font-medium"
          >
            Thêm mới
          </button>
        </div>
      </div>
    </div>
  );
}

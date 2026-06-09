import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const POLICIES = [
  { id: 'p1', name: 'Chính sách mặc định', rate: 10 },
  { id: 'p2', name: 'Nhẫn cao cấp',        rate: 15 },
  { id: 'p3', name: 'Hàng mới',            rate: 8  },
];

const PROVINCES = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
];

const DISTRICTS: Record<string, string[]> = {
  'Hà Nội':       ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy'],
  'Hồ Chí Minh':  ['Quận 1', 'Quận 3', 'Quận 5', 'Bình Thạnh', 'Gò Vấp'],
};

function generateRefCode(name: string): string {
  if (!name.trim()) return '';
  const words = name.trim().split(/\s+/);
  const initials = words.map((w) => w[0]?.toUpperCase() ?? '').join('');
  return `REF-${initials}${Math.floor(100 + Math.random() * 900)}`;
}

export default function CreateAffiliateMemberPage() {
  const navigate = useNavigate();

  // Basic info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [birthday, setBirthday] = useState('');

  // Account
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Address
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  // Note
  const [note, setNote] = useState('');

  // Right col
  const [policyId, setPolicyId] = useState('p1');
  const [customRate, setCustomRate] = useState<string>('');
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [refCodeGenerated, setRefCodeGenerated] = useState(false);
  const [status, setStatus] = useState<'active' | 'pending'>('active');
  const [assignee, setAssignee] = useState('Trang Đàm');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const selectedPolicy = POLICIES.find((p) => p.id === policyId);
  const effectiveRate = useCustomRate && customRate !== '' ? Number(customRate) : (selectedPolicy?.rate ?? 10);

  const districts = DISTRICTS[province] ?? [];

  const handleProvinceChange = (v: string) => { setProvince(v); setDistrict(''); };

  const handleNameBlur = () => {
    if (name && !refCodeGenerated) {
      const code = generateRefCode(name);
      setReferralCode(code);
      setRefCodeGenerated(true);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    if (passwordMismatch) return;
    navigate(ROUTES.AFFILIATE_MEMBERS);
  };

  const baseUrl = 'https://shop.com/?ref=';
  const previewLink = referralCode ? `${baseUrl}${referralCode}` : '';

  return (
    <div className="space-y-0 -m-6">
      {/* Top bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(ROUTES.AFFILIATE_MEMBERS)}
          className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !phone.trim() || passwordMismatch}
          className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Thêm cộng tác viên
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.AFFILIATE_MEMBERS)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Thêm cộng tác viên</h1>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-4 items-start">
          {/* ─── LEFT ─── */}
          <div className="space-y-4">

            {/* Thông tin cơ bản */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Thông tin cơ bản</h2>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Tên cộng tác viên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleNameBlur}
                  placeholder="Nhập tên cộng tác viên"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <button className="flex items-center gap-1 border border-r-0 border-gray-200 rounded-l-md px-2 py-2 bg-gray-50 hover:bg-gray-100 text-sm shrink-0">
                      <span>🇻🇳</span>
                      <span className="text-gray-400 text-xs">▾</span>
                    </button>
                    <input
                      type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="flex-1 border border-gray-200 rounded-r-md px-3 py-2 text-sm outline-none focus:border-blue-400 min-w-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mã CTV</label>
                  <input
                    type="text" value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Tự động tạo nếu để trống"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">Ví dụ: CTV001, CTV002, ...</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Giới tính</label>
                  <div className="relative">
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as typeof gender)}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                  </div>
                </div>
              </div>

              <div className="w-1/2 pr-2">
                <label className="block text-xs text-gray-600 mb-1">Ngày sinh</label>
                <input
                  type="date" value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-600"
                />
              </div>
            </section>

            {/* Tài khoản truy cập */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <div>
                <h2 className="font-semibold text-gray-800 text-sm">Tài khoản truy cập</h2>
                <p className="text-xs text-gray-500 mt-0.5">Cộng tác viên dùng số điện thoại và mật khẩu để đăng nhập cổng CTV</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full border border-gray-200 rounded-md px-3 py-2 pr-9 text-sm outline-none focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Tối thiểu 8 ký tự</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className={`w-full border rounded-md px-3 py-2 pr-9 text-sm outline-none ${
                        passwordMismatch ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showConfirm ? '🙈' : '👁'}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
                  )}
                </div>
              </div>
            </section>

            {/* Địa chỉ */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <h2 className="font-semibold text-gray-800 text-sm">Địa chỉ</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tỉnh/Thành phố</label>
                  <div className="relative">
                    <select
                      value={province} onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
                    >
                      <option value="">Chọn tỉnh thành</option>
                      {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Quận/Huyện</label>
                  <div className="relative">
                    <select
                      value={district} onChange={(e) => setDistrict(e.target.value)}
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
              <div>
                <label className="block text-xs text-gray-600 mb-1">Địa chỉ cụ thể</label>
                <input
                  type="text" value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="Số nhà, tên đường, ..."
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </section>

            {/* Ghi chú */}
            <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-2">
              <h2 className="font-semibold text-gray-800 text-sm">Ghi chú</h2>
              <textarea
                value={note} onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Ghi chú nội bộ về cộng tác viên này..."
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
              />
            </section>
          </div>

          {/* ─── RIGHT ─── */}
          <div className="space-y-4">

            {/* Trạng thái */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <h2 className="font-semibold text-gray-800 text-sm">Trạng thái</h2>
              <div className="relative">
                <select
                  value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'pending')}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="pending">Chờ duyệt</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded ${
                status === 'active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {status === 'active' ? 'Cộng tác viên có thể hoạt động ngay' : 'Cần duyệt trước khi hoạt động'}
              </div>
            </section>

            {/* Chính sách hoa hồng */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h2 className="font-semibold text-gray-800 text-sm">Chính sách hoa hồng</h2>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Áp dụng chính sách</label>
                <div className="relative">
                  <select
                    value={policyId} onChange={(e) => { setPolicyId(e.target.value); setUseCustomRate(false); setCustomRate(''); }}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
                  >
                    {POLICIES.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.rate}%)</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer mb-2">
                  <input
                    type="checkbox" checked={useCustomRate}
                    onChange={(e) => {
                      setUseCustomRate(e.target.checked);
                      if (e.target.checked) setCustomRate(String(selectedPolicy?.rate ?? 10));
                    }}
                    className="rounded"
                  />
                  Tùy chỉnh tỷ lệ riêng
                </label>
                {useCustomRate && (
                  <div className="relative">
                    <input
                      type="number" value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      min="0" max="100"
                      className="w-full border border-blue-300 rounded-md px-3 py-2 pr-8 text-sm outline-none focus:border-blue-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">%</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between bg-blue-50 rounded-md px-3 py-2">
                <span className="text-xs text-blue-700">Hoa hồng hiệu lực</span>
                <span className="text-sm font-bold text-blue-700">{effectiveRate}%</span>
              </div>
            </section>

            {/* Link giới thiệu */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <h2 className="font-semibold text-gray-800 text-sm">Link giới thiệu</h2>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mã giới thiệu</label>
                <div className="flex gap-2">
                  <input
                    type="text" value={referralCode}
                    onChange={(e) => { setReferralCode(e.target.value); setRefCodeGenerated(true); }}
                    placeholder="Tự động tạo từ tên"
                    className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={() => { setReferralCode(generateRefCode(name || 'CTV')); setRefCodeGenerated(true); }}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1.5 hover:bg-gray-50 text-gray-600 whitespace-nowrap"
                    title="Tạo ngẫu nhiên"
                  >
                    🔄
                  </button>
                </div>
              </div>
              {previewLink && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Preview link:</p>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1.5 border border-gray-200">
                    <code className="text-xs text-gray-600 flex-1 truncate">{previewLink}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(previewLink).catch(() => {})}
                      className="text-gray-400 hover:text-blue-500 text-xs shrink-0"
                      title="Sao chép"
                    >
                      ⎘
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Nhân viên phụ trách */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <h2 className="font-semibold text-gray-800 text-sm">Nhân viên phụ trách</h2>
              <div className="relative">
                <select
                  value={assignee} onChange={(e) => setAssignee(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
                >
                  <option>Trang Đàm</option>
                  <option>Nguyễn Văn An</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
              </div>
            </section>

            {/* Tag */}
            <section className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800 text-sm">Tag</h2>
                <button className="text-xs text-blue-500 hover:underline">Danh sách tag</button>
              </div>
              <input
                type="text" value={tagInput}
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
                      <button onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="hover:text-gray-800 leading-none">×</button>
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
            onClick={handleSubmit}
            disabled={!name.trim() || !phone.trim() || passwordMismatch}
            className="text-sm bg-blue-600 text-white rounded-md px-5 py-2 hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Thêm cộng tác viên
          </button>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Left nav config ─── */
const NAV_ITEMS = [
  { key: 'general',       label: 'Cấu hình chung',         icon: '⚙' },
  { key: 'branches',      label: 'Quản lý chi nhánh',       icon: '🏪' },
  { key: 'order-process', label: 'Xử lý đơn hàng',          icon: '📋' },
  { key: 'payment',       label: 'Phương thức thanh toán',   icon: '💳' },
  { key: 'checkout',      label: 'Trang thanh toán',         icon: '🛒' },
  { key: 'tax',           label: 'Thuế',                     icon: '🧾' },
  { key: 'carrier',       label: 'Đối tác vận chuyển',       icon: '🚚' },
  { key: 'shipping',      label: 'Cấu hình vận chuyển',      icon: '📦' },
  { key: 'staff',         label: 'Quản lý nhân viên',        icon: '👥' },
  { key: 'channels',      label: 'Kênh bán hàng',            icon: '📡' },
  { key: 'notifications', label: 'Thông báo',                icon: '🔔' },
  { key: 'files',         label: 'Quản lý file',             icon: '📁' },
  { key: 'tasks',         label: 'Quản lý tiến trình',       icon: '⏳' },
  { key: 'print',         label: 'Mẫu in',                   icon: '🖨' },
  { key: 'plan',          label: 'Gói dịch vụ',              icon: '📊' },
  { key: 'activity',      label: 'Nhật ký hoạt động',        icon: '📜' },
  { key: 'metafield',     label: 'Metafield',                icon: '🔧' },
];

const PROVINCES = [
  'Hà Nội','Hồ Chí Minh','Đà Nẵng','Hải Phòng','Cần Thơ',
  'An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu',
];

/* ─── General Settings tab ─── */
function GeneralTab() {
  const logoRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('themeai');
  const [bizName, setBizName] = useState('');
  const [phone, setPhone] = useState('84812102204');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [notifEmail, setNotifEmail] = useState('');
  const [timezone, setTimezone] = useState('(UTC+07:00) Bangkok, Hanoi, Jakarta');
  const [weightUnit, setWeightUnit] = useState('Gram (g)');
  const [currency] = useState('Việt Nam đồng (VND)');
  const [decimalPrice, setDecimalPrice] = useState(false);
  const [orderPrefix, setOrderPrefix] = useState('#');
  const [orderSuffix, setOrderSuffix] = useState('');
  const [warehouseMode, setWarehouseMode] = useState<'simple' | 'full'>('full');

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setLogo(URL.createObjectURL(f));
  };

  const previewCode = `${orderPrefix}1001${orderSuffix}, ${orderPrefix}1002${orderSuffix}`;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-800">Cấu hình chung</h1>

      {/* Thông tin cửa hàng */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 text-sm">Thông tin cửa hàng</h2>

        {/* Logo */}
        <div>
          <label className="block text-xs text-gray-600 mb-2">Logo</label>
          <div
            className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center gap-1.5 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
            onClick={() => logoRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f?.type.startsWith('image/')) setLogo(URL.createObjectURL(f));
            }}
          >
            {logo ? (
              <img src={logo} alt="logo" className="h-16 object-contain" />
            ) : (
              <>
                <span className="text-xl text-gray-300 font-light">+</span>
                <p className="text-xs text-gray-500 text-center">
                  Kéo thả hoặc{' '}
                  <span className="text-blue-500">thêm ảnh từ URL</span>
                </p>
                <p className="text-xs text-blue-500">Tải ảnh lên từ thiết bị</p>
                <p className="text-xs text-gray-400">(Dung lượng ảnh tối đa 2MB)</p>
              </>
            )}
          </div>
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Tên cửa hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}
              className="w-full border border-blue-400 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tên kinh doanh</label>
            <input
              type="text" value={bizName} onChange={(e) => setBizName(e.target.value)}
              placeholder="Nhập tên kinh doanh"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Điện thoại</label>
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Địa chỉ</label>
            <input
              type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Quốc gia</label>
            <div className="relative">
              <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white">
                <option>Vietnam</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tỉnh/Thành phố</label>
            <div className="relative">
              <select
                value={province} onChange={(e) => setProvince(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
              >
                <option value="">Chọn tỉnh thành</option>
                {PROVINCES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
              Email quản trị
              <span className="text-gray-400 cursor-help" title="Email dùng để đăng nhập quản trị">ⓘ</span>
            </label>
            <input
              type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Nhập email"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
              Email gửi thông báo
              <span className="text-gray-400 cursor-help" title="Email dùng để gửi thông báo cho khách hàng">ⓘ</span>
            </label>
            <input
              type="email" value={notifEmail} onChange={(e) => setNotifEmail(e.target.value)}
              placeholder="Nhập email"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </section>

      {/* Tiêu chuẩn & định dạng */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-sm">Tiêu chuẩn & định dạng</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Múi giờ</label>
            <div className="relative">
              <select
                value={timezone} onChange={(e) => setTimezone(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
              >
                <option>(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                <option>(UTC+08:00) Beijing, Shanghai</option>
                <option>(UTC+09:00) Tokyo, Seoul</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Khối lượng mặc định</label>
            <div className="relative">
              <select
                value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white"
              >
                <option>Gram (g)</option>
                <option>Kilogram (kg)</option>
                <option>Pound (lbs)</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-600">Tiền tệ</label>
            <button className="text-xs text-blue-500 hover:underline">Thay đổi định dạng</button>
          </div>
          <div className="relative">
            <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none appearance-none pr-8 bg-white">
              <option>{currency}</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox" checked={decimalPrice} onChange={(e) => setDecimalPrice(e.target.checked)}
            className="mt-0.5 rounded"
          />
          <div>
            <p className="text-sm text-gray-700">Định dạng số tiền có 2 số thập phân</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Áp dụng cho nghiệp vụ quản lý: Giá vốn sản phẩm, Đặt hàng nhập, Nhập hàng, Trả hàng nhập, Sổ Quỹ, các Báo cáo
            </p>
          </div>
        </label>
      </section>

      {/* Định dạng mã đơn hàng */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Định dạng mã đơn hàng</h2>
          <p className="text-xs text-gray-500 mt-1">
            Đơn hàng mặc định bắt đầu là #1001, bạn có thể thay đổi tiền tố hoặc hậu tố giống như "BN1001" hoặc "1001-AD"
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tiền tố</label>
            <input
              type="text" value={orderPrefix} onChange={(e) => setOrderPrefix(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Hậu tố</label>
            <input
              type="text" value={orderSuffix} onChange={(e) => setOrderSuffix(e.target.value)}
              placeholder="Nhập hậu tố"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Mã đơn hàng sẽ được áp dụng là: {previewCode}, ...
        </p>
      </section>

      {/* Cấu hình quản lý kho */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-800 text-sm">Cấu hình quản lý kho</h2>
          <p className="text-xs text-gray-500 mt-1">Lựa chọn quản lý kho phù hợp với quy trình vận hành của cửa hàng</p>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio" name="warehouse" value="simple"
              checked={warehouseMode === 'simple'}
              onChange={() => setWarehouseMode('simple')}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              Quản lý kho đơn giản
              <span className="text-gray-400 cursor-help" title="Chỉ theo dõi số lượng tồn kho cơ bản">ⓘ</span>
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio" name="warehouse" value="full"
              checked={warehouseMode === 'full'}
              onChange={() => setWarehouseMode('full')}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              Quản lý kho đầy đủ
              <span className="text-gray-400 cursor-help" title="Theo dõi đầy đủ: nhập, xuất, chuyển kho, lô hàng">ⓘ</span>
            </span>
          </label>
        </div>
      </section>
    </div>
  );
}

/* ─── Main Settings Page ─── */
export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [dirty, setDirty] = useState(false);

  const handleFieldChange = () => setDirty(true);

  return (
    <div className="space-y-0 -m-6 min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <span className="text-xs text-gray-400">
          {dirty ? 'Chỉnh sửa chưa được lưu' : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setDirty(false); navigate(-1); }}
            className="text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={() => setDirty(false)}
            className="text-sm bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 font-medium"
          >
            Lưu
          </button>
        </div>
      </div>

      <div className="flex" onChange={handleFieldChange}>
        {/* Left nav */}
        <nav className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-49px)] p-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors text-left ${
                activeTab === item.key
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab !== 'general' && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 text-sm">
              <span className="text-4xl mb-3">{NAV_ITEMS.find((i) => i.key === activeTab)?.icon}</span>
              <p>{NAV_ITEMS.find((i) => i.key === activeTab)?.label} — coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

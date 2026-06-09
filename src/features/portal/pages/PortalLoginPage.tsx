import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { usePortalAuthStore } from '../stores/portalAuth.store';

// Mock CTV accounts
const MOCK_MEMBERS = [
  { id: 'm1', code: 'CTV001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'nva@email.com', referralCode: 'REF-NVA', commissionRate: 10, status: 'active' as const, password: '12345678' },
  { id: 'm2', code: 'CTV002', name: 'Trần Thị B',   phone: '0912345678', email: 'ttb@email.com', referralCode: 'REF-TTB', commissionRate: 10, status: 'active' as const, password: '12345678' },
];

export default function PortalLoginPage() {
  const { member, login } = usePortalAuthStore();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (member) return <Navigate to="/portal/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const found = MOCK_MEMBERS.find((m) => m.phone === phone.trim() && m.password === password);
    if (!found) {
      setError('Số điện thoại hoặc mật khẩu không đúng');
      setLoading(false);
      return;
    }
    if (found.status !== 'active') {
      setError('Tài khoản chưa được kích hoạt. Vui lòng liên hệ quản trị viên.');
      setLoading(false);
      return;
    }

    const { password: _, ...memberData } = found;
    login(memberData);
    navigate('/portal/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
            A
          </div>
          <h1 className="text-xl font-bold text-gray-800">Affiliate Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Đăng nhập tài khoản cộng tác viên</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
              <div className="flex">
                <div className="flex items-center gap-1 border border-r-0 border-gray-200 rounded-l-lg px-2.5 bg-gray-50 text-sm shrink-0">
                  <span>🇻🇳</span>
                  <span className="text-gray-400 text-xs">▾</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  required
                  className="flex-1 border border-gray-200 rounded-r-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-w-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              )}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button className="text-xs text-blue-500 hover:underline">Quên mật khẩu?</button>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: SĐT <strong>0901234567</strong> · Mật khẩu <strong>12345678</strong>
        </p>
      </div>
    </div>
  );
}

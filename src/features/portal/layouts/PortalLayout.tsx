import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { usePortalAuthStore } from '../stores/portalAuth.store';
import { cn } from '../../../lib/utils';

const NAV = [
  { to: '/portal/dashboard', label: 'Tổng quan',          icon: '📊' },
  { to: '/portal/links',     label: 'Link giới thiệu',    icon: '🔗' },
  { to: '/portal/commissions', label: 'Hoa hồng',         icon: '💰' },
];

export default function PortalLayout() {
  const { member, logout } = usePortalAuthStore();
  const navigate = useNavigate();

  if (!member) return <Navigate to="/portal/login" replace />;

  const handleLogout = () => { logout(); navigate('/portal/login'); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">A</div>
          <span className="font-semibold text-gray-800 text-sm">Affiliate Portal</span>
        </div>

        <nav className="flex items-center gap-1 ml-6">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-800 leading-tight">{member.name}</p>
              <p className="text-xs text-gray-400 leading-tight">{member.code}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-500 border border-gray-200 rounded px-2 py-1 hover:border-red-200 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6">
        <Outlet />
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-200 bg-white">
        Affiliate Portal — Powered by The Meal
      </footer>
    </div>
  );
}

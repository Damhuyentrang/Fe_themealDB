import { useUIStore } from '../../../stores/ui.store';
import { useAuthStore } from '../../../stores/auth.store';

export default function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
          <span className="block w-5 h-0.5 bg-gray-600 mb-1" />
          <span className="block w-5 h-0.5 bg-gray-600 mb-1" />
          <span className="block w-5 h-0.5 bg-gray-600" />
        </button>

        <input
          type="search"
          placeholder="Tìm kiếm (Ctrl + K)"
          className="w-64 text-sm border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:border-blue-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="text-sm text-gray-500 hover:text-gray-700">Trợ giúp</button>
        <button className="relative p-1.5">
          <span className="text-lg">🔔</span>
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            8
          </span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {user?.name?.[0] ?? 'U'}
          </div>
          <span className="text-sm font-medium text-gray-700">{user?.name ?? 'Trang Đầm'}</span>
          <span className="text-xs text-gray-400">▾</span>
        </div>
      </div>
    </header>
  );
}

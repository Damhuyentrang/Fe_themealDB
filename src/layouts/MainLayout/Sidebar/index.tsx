import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_CONFIG, type NavItem } from './navConfig';
import { useUIStore } from '../../../stores/ui.store';
import { cn } from '../../../lib/utils';

function NavItemRow({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const location = useLocation();
  const [open, setOpen] = useState(
    item.children?.some((c) => c.path && location.pathname.startsWith(c.path)) ?? false,
  );

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors',
            open && 'text-white',
          )}
        >
          <span className="flex-1 text-left">{item.label}</span>
          <span className="text-xs">{open ? '▾' : '▸'}</span>
        </button>
        {open && (
          <div className="ml-4 border-l border-white/20 pl-2 mt-1 space-y-1">
            {item.children.map((child) => (
              <NavItemRow key={child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!item.path) {
    return (
      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors text-left">
        {item.label}
      </button>
    );
  }

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
          isActive ? 'bg-white/20 text-white font-medium' : 'hover:bg-white/10',
        )
      }
    >
      {item.label}
    </NavLink>
  );
}

export default function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={cn(
        'h-screen bg-[#1a2332] text-white/80 flex flex-col transition-all duration-200 shrink-0',
        collapsed ? 'w-16' : 'w-56',
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-white/10">
        <span className="font-bold text-white text-lg">{collapsed ? 'S' : 'The Meal'}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_CONFIG.map((group, gi) => (
          <div key={gi}>
            {!collapsed && group.groupLabel && (
              <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                {group.groupLabel}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItemRow key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

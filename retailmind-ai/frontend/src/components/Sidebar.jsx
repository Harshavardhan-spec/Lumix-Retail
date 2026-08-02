import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, TrendingUp, Cpu } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Products Catalog', icon: Package },
    { to: '/inventory', label: 'Inventory & Stock', icon: Warehouse },
    { to: '/forecast', label: 'AI Demand Forecast', icon: TrendingUp },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Main Navigation</p>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 font-medium">
          <Cpu className="w-4 h-4" />
          <span>Local Engine</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Running on-premise. Zero third-party cloud data transmission.
        </p>
      </div>
    </aside>
  );
};

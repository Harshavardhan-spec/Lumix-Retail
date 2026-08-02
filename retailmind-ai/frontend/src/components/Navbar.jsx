import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/30">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">RetailMind AI</h1>
          <p className="text-xs text-slate-400">Hyperlocal Demand Intelligence</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-slate-300 font-medium">On-Premise Engine Online</span>
        </div>

        {user && (
          <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white">{user.username}</div>
                <div className="text-[10px] text-slate-400 capitalize">{user.role}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

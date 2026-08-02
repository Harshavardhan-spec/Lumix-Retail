import React from 'react';

export const KpiCard = ({ title, value, subtext, icon: Icon, color = 'emerald' }) => {
  const colorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="glass-card p-5 rounded-xl border border-slate-800 flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-white mt-1">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl border ${colorStyles[color] || colorStyles.emerald}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

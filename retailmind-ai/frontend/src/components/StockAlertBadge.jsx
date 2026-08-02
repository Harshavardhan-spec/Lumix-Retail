import React from 'react';
import { AlertTriangle, AlertOctagon } from 'lucide-react';

export const StockAlertBadge = ({ severity, count }) => {
  if (severity === 'CRITICAL') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <AlertOctagon className="w-3.5 h-3.5" />
        <span>Out of Stock ({count})</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
      <AlertTriangle className="w-3.5 h-3.5" />
      <span>Low Stock ({count})</span>
    </span>
  );
};

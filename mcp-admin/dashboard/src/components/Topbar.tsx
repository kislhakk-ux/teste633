import React from 'react';
import { Menu, RefreshCw, Clock, Shield } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface TopbarProps {
  title: string;
  globalStatus: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: number; // 0 = off, 10000 = 10s, 30000 = 30s, 60000 = 60s
  onChangeAutoRefresh: (val: number) => void;
  onOpenMobileMenu: () => void;
  environment?: string;
  user?: any;
  onNavigate?: (path: string) => void;
  onLogout?: () => Promise<void>;
}

export const Topbar: React.FC<TopbarProps> = ({
  title,
  globalStatus,
  onRefresh,
  isRefreshing,
  autoRefresh,
  onChangeAutoRefresh,
  onOpenMobileMenu,
  environment = 'development',
}) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
          {environment}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Global System Status Indicator */}
        <div className="hidden sm:block">
          <StatusBadge status={globalStatus} size="md" />
        </div>

        {/* Auto refresh dropdown */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={autoRefresh}
            onChange={(e) => onChangeAutoRefresh(Number(e.target.value))}
            className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer"
          >
            <option value={0} className="bg-slate-900">Auto: Desativado</option>
            <option value={10000} className="bg-slate-900">Auto: 10s</option>
            <option value={30000} className="bg-slate-900">Auto: 30s</option>
            <option value={60000} className="bg-slate-900">Auto: 1m</option>
          </select>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Atualizar</span>
        </button>
      </div>
    </header>
  );
};

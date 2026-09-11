import React from 'react';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Package,
  Coins,
  Newspaper,
  Store,
  Server,
  FileText,
  ShieldCheck,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'tools', label: 'MCP Tools', icon: Wrench, path: '/tools' },
  { id: 'players', label: 'Jogadores', icon: Users, path: '/players' },
  { id: 'inventory', label: 'Inventário', icon: Package, path: '/inventory' },
  { id: 'economy', label: 'Economia', icon: Coins, path: '/economy' },
  { id: 'journal', label: 'Jornal', icon: Newspaper, path: '/journal' },
  { id: 'market', label: 'Banca', icon: Store, path: '/market' },
  { id: 'server', label: 'Servidor', icon: Server, path: '/server' },
  { id: 'logs', label: 'Logs', icon: FileText, path: '/logs' },
  { id: 'security', label: 'Segurança', icon: ShieldCheck, path: '/security' },
  { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' },
];

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  version?: string;
  user?: any;
  onLogout?: () => Promise<void>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  version = 'v1.0.0',
}) => {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            🌾
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">FARM MCP</h1>
              <p className="text-[10px] text-slate-400 font-mono">Control Admin {version}</p>
            </div>
          )}
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.path);
                onCloseMobile();
              }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Footer (Desktop) */}
      <div className="hidden md:flex items-center justify-between p-3 border-t border-slate-800 text-xs text-slate-500">
        {!collapsed && <span>Farm Simulator MCP</span>}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

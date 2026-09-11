import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';
import { OverviewPage } from './pages/OverviewPage';
import { ToolsPage } from './pages/ToolsPage';
import { PlayersPage } from './pages/PlayersPage';
import { InventoryPage } from './pages/InventoryPage';
import { EconomyPage } from './pages/EconomyPage';
import { JournalPage } from './pages/JournalPage';
import { MarketPage } from './pages/MarketPage';
import { ServerPage } from './pages/ServerPage';
import { LogsPage } from './pages/LogsPage';
import { SecurityPage } from './pages/SecurityPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminsPage } from './pages/AdminsPage';
import { LoginPage } from './pages/LoginPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { api } from './services/api';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Mapa de permissão necessária por rota
const ROUTE_PERMISSIONS: Record<string, string> = {
  '/': 'dashboard:view',
  '/tools': 'tools:view',
  '/players': 'players:view',
  '/inventory': 'inventory:view',
  '/economy': 'economy:view',
  '/journal': 'journal:view',
  '/market': 'market:view',
  '/server': 'dashboard:view',
  '/logs': 'logs:view',
  '/security': 'sessions:view',
  '/settings': 'settings:view',
  '/admins': 'admins:view',
  '/profile': 'dashboard:view',
};

function AppShell() {
  const { user, loading: authLoading, authenticated, sessionExpired, logout, hasPermission } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [toolsData, setToolsData] = useState<any[]>([]);

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [autoRefreshMs, setAutoRefreshMs] = useState<number>(30000);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const loadData = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      setError(null);
      const [overview, tools] = await Promise.all([
        api.getOverview(),
        api.getTools().catch(() => []),
      ]);
      setOverviewData(overview);
      setToolsData(tools);
    } catch (err: any) {
      if (!silent) setError(err.message || 'Não foi possível conectar à Game API / MCP Server.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [authenticated]);

  useEffect(() => {
    if (autoRefreshMs <= 0 || !authenticated) return;
    const timer = setInterval(() => loadData(true), autoRefreshMs);
    return () => clearInterval(timer);
  }, [autoRefreshMs, authenticated]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const getGlobalStatus = (): 'online' | 'degraded' | 'offline' => {
    if (error) return 'offline';
    if (!overviewData) return 'degraded';
    const services = overviewData.services || {};
    if (services.gameApi?.status === 'offline' || services.mcp?.status === 'offline') return 'degraded';
    return 'online';
  };

  const getPageTitle = (path: string): string => {
    const titles: Record<string, string> = {
      '/': 'Dashboard General',
      '/tools': 'Ferramentas MCP',
      '/players': 'Jogadores',
      '/inventory': 'Inventário & Silo',
      '/economy': 'Economia do Jogo',
      '/journal': 'Jornal da Comunidade',
      '/market': 'Banca & Mercado',
      '/server': 'Infraestrutura do Servidor',
      '/logs': 'Audit Logs',
      '/security': 'Postura de Segurança',
      '/settings': 'Configurações',
      '/admins': 'Administradores',
      '/profile': 'Meu Perfil',
    };
    return titles[path] || 'Dashboard';
  };

  // === Estado: Carregando verificação de auth ===
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  // === Estado: Não autenticado → Login ===
  if (!authenticated) {
    return <LoginPage sessionExpiredMessage={sessionExpired} />;
  }

  // === Verificar permissão para a rota atual ===
  const requiredPerm = ROUTE_PERMISSIONS[currentPath];
  const canAccessCurrentRoute = !requiredPerm || hasPermission(requiredPerm);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border text-xs font-medium shadow-2xl flex items-center justify-between transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-500/30 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950 border-rose-500/30 text-rose-200'
                : 'bg-indigo-950 border-indigo-500/30 text-indigo-200'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        version={overviewData?.service?.version || '1.0.0'}
        user={user}
        onLogout={async () => {
          await logout();
          showToast('Sessão encerrada com sucesso.', 'info');
        }}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar
          title={getPageTitle(currentPath)}
          globalStatus={getGlobalStatus()}
          onRefresh={() => {
            loadData();
            showToast('Dados atualizados', 'success');
          }}
          isRefreshing={isRefreshing}
          autoRefresh={autoRefreshMs}
          onChangeAutoRefresh={(ms) => setAutoRefreshMs(ms)}
          onOpenMobileMenu={() => setMobileOpen(true)}
          environment={overviewData?.service?.environment || 'production'}
          user={user}
          onNavigate={handleNavigate}
          onLogout={async () => {
            await logout();
          }}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {!canAccessCurrentRoute ? (
            <ForbiddenPage onNavigate={handleNavigate} />
          ) : loading ? (
            <LoadingSkeleton rows={5} />
          ) : error ? (
            <ErrorState message={error} onRetry={loadData} />
          ) : (
            <>
              {currentPath === '/' && <OverviewPage data={overviewData} />}
              {currentPath === '/tools' && (
                <ToolsPage tools={toolsData} onRefresh={loadData} onToast={showToast} />
              )}
              {currentPath === '/players' && <PlayersPage onToast={showToast} />}
              {currentPath === '/inventory' && <InventoryPage onToast={showToast} />}
              {currentPath === '/economy' && <EconomyPage onToast={showToast} />}
              {currentPath === '/journal' && <JournalPage onToast={showToast} />}
              {currentPath === '/market' && <MarketPage onToast={showToast} />}
              {currentPath === '/server' && (
                <ServerPage data={overviewData} onRefresh={loadData} />
              )}
              {currentPath === '/logs' && <LogsPage onToast={showToast} />}
              {currentPath === '/security' && <SecurityPage />}
              {currentPath === '/settings' && (
                <SettingsPage
                  data={overviewData}
                  autoRefreshInterval={Math.round(autoRefreshMs / 1000)}
                  setAutoRefreshInterval={(sec) => setAutoRefreshMs(sec * 1000)}
                />
              )}
              {currentPath === '/admins' && (
                <AdminsPage onToast={showToast} />
              )}
              {currentPath === '/profile' && (
                <ProfilePage onToast={showToast} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

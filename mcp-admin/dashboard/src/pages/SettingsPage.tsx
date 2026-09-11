import React from 'react';
import { Settings, Server, Globe, Shield, Clock, RefreshCw, Key } from 'lucide-react';

interface SettingsPageProps {
  data: any;
  autoRefreshInterval: number;
  setAutoRefreshInterval: (sec: number) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  data,
  autoRefreshInterval,
  setAutoRefreshInterval,
}) => {
  const service = data?.service || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-slate-300" />
          <div>
            <h2 className="text-sm font-bold text-white">Configurações do Sistema MCP Admin</h2>
            <p className="text-xs text-slate-400">
              Parâmetros de execução do servidor, limites de taxa e atualização automática
            </p>
          </div>
        </div>
      </div>

      {/* Auto Refresh Setting */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-indigo-400" /> Atualização Automática (Auto Refresh)
        </h3>
        <p className="text-xs text-slate-400">
          Escolha o intervalo de polling do Dashboard. O polling é realizado de forma otimizada para evitar sobrecarga.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          {[
            { label: 'Desativado', value: 0 },
            { label: '10 segundos', value: 10 },
            { label: '30 segundos', value: 30 },
            { label: '1 minuto', value: 60 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setAutoRefreshInterval(item.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                autoRefreshInterval === item.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Server & Environment Parameters Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" /> Parâmetros do Servidor MCP
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-500">MCP Server Name:</span>
            <span className="text-slate-200 font-bold">{service.name || 'farm-mcp-admin'}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-500">Version:</span>
            <span className="text-slate-200 font-bold">{service.version || '1.0.0'}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-500">Environment:</span>
            <span className="text-emerald-400 font-bold">{service.environment || 'production'}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-500">Timeout Padrão:</span>
            <span className="text-slate-200 font-bold">5000 ms</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-500">Rate Limit:</span>
            <span className="text-slate-200 font-bold">100 req / 15 min</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-500">CORS Policy:</span>
            <span className="text-slate-200 font-bold">Permissivo (Render SPA)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

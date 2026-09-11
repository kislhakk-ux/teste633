import React from 'react';
import { Server, Cpu, Database, Activity, Clock, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';

interface ServerPageProps {
  data: any;
  onRefresh?: () => void;
}

export const ServerPage: React.FC<ServerPageProps> = ({ data, onRefresh }) => {
  const service = data?.service || {};
  const services = data?.services || {};
  const metrics = data?.metrics || {};

  const subsystemList = [
    {
      name: 'MCP Admin Protocol Server',
      key: 'mcp',
      icon: Server,
      color: 'text-emerald-400',
      status: services.mcp?.status || 'online',
      message: services.mcp?.message || 'Protocolo MCP SSE / Stream ready',
    },
    {
      name: 'Backend do Jogo (Game API)',
      key: 'gameApi',
      icon: Activity,
      color: 'text-indigo-400',
      status: services.gameApi?.status || 'online',
      message: services.gameApi?.message || 'Conexão via REST & Circuit Breaker',
    },
    {
      name: 'Banco de Dados (In-Memory / Persistence)',
      key: 'database',
      icon: Database,
      color: 'text-slate-400',
      status: services.database?.status || 'not_connected',
      message: services.database?.message || 'Sem escritas diretas pelo MCP',
    },
    {
      name: 'Servidor de Jogo (WebSocket / Realtime)',
      key: 'gameServer',
      icon: Zap,
      color: 'text-amber-400',
      status: services.gameApi?.status || 'online',
      message: 'Conexão realtime via backend',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Infraestrutura & Diagnóstico do Servidor</h2>
            <p className="text-xs text-slate-400">
              Métricas do processo Node.js e saúde das conexões de backend
            </p>
          </div>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar Status
          </button>
        )}
      </div>

      {/* Primary Server Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Tempo de Atividade (MCP Uptime)"
          value={`${Math.round((service.uptime || 0) / 60)} min`}
          subtitle={`Serviço: ${service.name || 'MCP Admin'} v${service.version || '1.0.0'}`}
          icon={Clock}
          color="emerald"
        />
        <MetricCard
          title="Requisições Totais"
          value={metrics.requests || 0}
          subtitle={`Sucesso: ${metrics.success || 0} | Erros: ${metrics.errors || 0}`}
          icon={Activity}
          color="indigo"
        />
        <MetricCard
          title="Latência Média"
          value={`${metrics.averageResponseTimeMs || 0} ms`}
          subtitle="Tempo de execução do barramento MCP"
          icon={Zap}
          color="amber"
        />
        <MetricCard
          title="Ambiente"
          value={service.environment || 'production'}
          subtitle="Render Container Deployment"
          icon={Cpu}
          color="slate"
        />
      </div>

      {/* Subsystem Details Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Subsistemas e Serviços Conectados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subsystemList.map((subsys) => {
            const Icon = subsys.icon;
            return (
              <div key={subsys.key} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 font-semibold text-sm text-white">
                    <Icon className={`w-4 h-4 ${subsys.color}`} />
                    {subsys.name}
                  </div>
                  <StatusBadge status={subsys.status} />
                </div>
                <p className="text-xs text-slate-400 font-sans">{subsys.message}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Última verificação: {new Date().toLocaleTimeString()}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> Verificado
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

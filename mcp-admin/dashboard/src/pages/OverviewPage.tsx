import React, { useState, useEffect } from 'react';
import {
  Users,
  Wrench,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Server,
  Newspaper,
  Store,
  Database,
  Cpu,
  ShieldAlert,
  AlertCircle,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { api } from '../services/api';

interface OverviewPageProps {
  data: any;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ data }) => {
  const [summaryData, setSummaryData] = useState<any | null>(null);

  useEffect(() => {
    api.getDashboardSummary()
      .then((res) => setSummaryData(res))
      .catch(() => setSummaryData(null));
  }, []);

  if (!data) return null;

  const service = data.service || {};
  const services = data.services || {};
  const metrics = data.metrics || {};
  const recentActivity = Array.isArray(data.recentActivity) ? data.recentActivity : [];

  const errors24h = summaryData ? summaryData.errors24h : metrics.errors || 0;
  const mcpSuccessRate = summaryData ? summaryData.mcpSuccessRate : 100;
  const avgLatency = summaryData ? summaryData.avgLatency : metrics.averageResponseTimeMs || 0;
  const failedLogins24h = summaryData ? summaryData.failedLogins24h : 0;
  const adminActions24h = summaryData ? summaryData.adminActions24h : 0;

  // Thresholds de alerta
  const hasHighErrorRate = mcpSuccessRate < 90;
  const hasHighLatency = avgLatency > 1000;

  return (
    <div className="space-y-6">
      {/* Alertas Visuais Baseados em Métricas Reais */}
      {(hasHighErrorRate || hasHighLatency) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-200 block text-sm">Alerta de Desempenho de Telemetria</span>
              {hasHighErrorRate && <span>⚠ Taxa de sucesso do MCP Server abaixo de 90% (Atual: {mcpSuccessRate}%). </span>}
              {hasHighLatency && <span>⚠ Latência média do servidor elevada (Atual: {avgLatency} ms).</span>}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Erros (24h)"
          value={errors24h}
          subtitle="Total de falhas nas últimas 24h"
          icon={AlertCircle}
          color={errors24h > 0 ? "rose" : "slate"}
        />
        <MetricCard
          title="Taxa de Sucesso MCP"
          value={`${mcpSuccessRate}%`}
          subtitle="Taxa global de resposta positiva"
          icon={CheckCircle2}
          color={mcpSuccessRate >= 95 ? "emerald" : "amber"}
        />
        <MetricCard
          title="Latência Média"
          value={`${avgLatency} ms`}
          subtitle="Tempo médio de resposta MCP"
          icon={Clock}
          color={avgLatency < 500 ? "indigo" : "amber"}
        />
        <MetricCard
          title="Ações Admin (24h)"
          value={adminActions24h}
          subtitle="Registros no Audit Log"
          icon={Activity}
          color="indigo"
        />
        <MetricCard
          title="Logins Falhos (24h)"
          value={failedLogins24h}
          subtitle="Tentativas não autorizadas"
          icon={ShieldAlert}
          color={failedLogins24h > 0 ? "amber" : "slate"}
        />
      </div>

      {/* Status dos Subsistemas */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Status dos Subsistemas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Server className="w-4 h-4 text-emerald-400" /> MCP Admin Server
              </div>
              <StatusBadge status={services.mcp?.status || 'not_configured'} />
            </div>
            <p className="text-xs text-slate-400">{services.mcp?.message || 'Servidor MCP operacional'}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Activity className="w-4 h-4 text-indigo-400" /> Backend do Jogo (API)
              </div>
              <StatusBadge status={services.gameApi?.status || 'not_connected'} />
            </div>
            <p className="text-xs text-slate-400">{services.gameApi?.message || 'Aguardando verificação de API'}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Database className="w-4 h-4 text-slate-400" /> Banco de Dados
              </div>
              <StatusBadge status={services.database?.status || 'not_connected'} />
            </div>
            <p className="text-xs text-slate-400">{services.database?.message || 'Banco persistente em disco'}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Newspaper className="w-4 h-4 text-amber-400" /> Jornal da Comunidade
              </div>
              <StatusBadge status={services.journal?.status || 'not_connected'} />
            </div>
            <p className="text-xs text-slate-400">{services.journal?.message || 'Diagnóstico de anúncios'}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Store className="w-4 h-4 text-emerald-400" /> Banca & Mercado
              </div>
              <StatusBadge status={services.market?.status || 'not_connected'} />
            </div>
            <p className="text-xs text-slate-400">{services.market?.message || 'Diagnóstico de bancas'}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Cpu className="w-4 h-4 text-emerald-400" /> Proxy HTTP Server
              </div>
              <StatusBadge status={services.http?.status || 'online'} />
            </div>
            <p className="text-xs text-slate-400">{services.http?.message || 'Servidor HTTP ativo'}</p>
          </div>
        </div>
      </div>

      {/* Activity Feed em Tempo Real */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Activity Feed (Logs de Telemetria)
        </h3>
        {recentActivity.length === 0 ? (
          <EmptyState title="Nenhuma atividade registrada" description="As execuções de ferramentas MCP e ações administrativas aparecerão em tempo real." />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Horário</th>
                    <th className="px-4 py-3">Admin / Actor</th>
                    <th className="px-4 py-3">Ação / Ferramenta</th>
                    <th className="px-4 py-3">Resultado</th>
                    <th className="px-4 py-3">Duração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  {recentActivity.map((log: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{log.adminId || log.principal || 'system'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-emerald-400 font-semibold font-mono">
                        {log.toolName || log.action}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-sans">
                        <StatusBadge status={log.result || (log.success ? 'SUCCESS' : 'FAILURE')} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                        {log.durationMs ? `${log.durationMs} ms` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

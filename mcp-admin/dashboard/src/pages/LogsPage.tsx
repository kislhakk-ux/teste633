import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  RefreshCw,
  X,
  ShieldCheck,
  Clock,
  Download,
  Activity,
  Layers,
  ShieldAlert,
  Server,
  Terminal,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { JsonViewer } from '../components/JsonViewer';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LogsPageProps {
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const LogsPage: React.FC<LogsPageProps> = ({ onToast }) => {
  const { hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'application' | 'mcp_tool' | 'audit' | 'security'>('all');
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filtros avançados
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toolFilter, setToolFilter] = useState('');
  const [errorCodeFilter, setErrorCodeFilter] = useState('');
  const [requestIdFilter, setRequestIdFilter] = useState('');
  const [correlationIdFilter, setCorrelationIdFilter] = useState('');

  // Modais de detalhe e Trace
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [traceData, setTraceData] = useState<any | null>(null);
  const [loadingTrace, setLoadingTrace] = useState(false);

  const canExport = hasPermission('logs:export');
  const canViewAudit = hasPermission('audit:view');
  const canViewSecurity = hasPermission('security:view');
  const canViewTraces = hasPermission('traces:view');

  const fetchLogs = async (page = pagination.page) => {
    setLoading(true);
    try {
      const res = await api.getLogs({
        type: activeTab === 'all' ? undefined : activeTab,
        level: levelFilter || undefined,
        status: statusFilter || undefined,
        toolName: toolFilter || undefined,
        errorCode: errorCodeFilter || undefined,
        requestId: requestIdFilter || undefined,
        correlationId: correlationIdFilter || undefined,
        search: searchTerm || undefined,
        page,
        limit: pagination.limit,
      });

      if (res) {
        setLogs(res.data || []);
        setPagination({
          page: res.page || 1,
          limit: res.limit || 20,
          total: res.total || 0,
          totalPages: res.totalPages || 1,
        });
      }
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Erro ao carregar logs de auditoria', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [activeTab, levelFilter, statusFilter, toolFilter, errorCodeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(1);
  };

  const openTraceModal = async (correlationId: string) => {
    if (!canViewTraces) {
      if (onToast) onToast('Sem permissão para visualizar rastros (traces)', 'error');
      return;
    }
    setLoadingTrace(true);
    try {
      const data = await api.getTrace(correlationId);
      setTraceData(data);
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Erro ao obter rastro da correlação', 'error');
    } finally {
      setLoadingTrace(false);
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (!canExport) {
      if (onToast) onToast('Sem permissão para exportar logs', 'error');
      return;
    }
    const url = api.exportLogsUrl(
      {
        type: activeTab === 'all' ? undefined : activeTab,
        level: levelFilter || undefined,
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      },
      format
    );
    window.open(url, '_blank');
    if (onToast) onToast(`Exportação ${format.toUpperCase()} iniciada`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Abas Superiores */}
      <div className="flex border-b border-slate-800 gap-2 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Todos os Logs
        </button>

        <button
          onClick={() => setActiveTab('application')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'application'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Server className="w-4 h-4" />
          Application Logs
        </button>

        <button
          onClick={() => setActiveTab('mcp_tool')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'mcp_tool'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          MCP Tool Logs
        </button>

        {canViewAudit && (
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Audit Logs
          </button>
        )}

        {canViewSecurity && (
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Security Logs
          </button>
        )}
      </div>

      {/* Header & Filtros Avançados */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por termo, requestID, correlationID, erro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Pesquisar
            </button>

            <button
              type="button"
              onClick={() => fetchLogs(1)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>

            {canExport && (
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
                <span className="text-[10px] text-slate-400 px-1 font-semibold">Exportar:</span>
                <button
                  type="button"
                  onClick={() => handleExport('json')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded text-[10px] font-mono"
                >
                  JSON
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('csv')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded text-[10px] font-mono"
                >
                  CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filtros em Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs border-t border-slate-800/80 pt-3">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Nível (Level)</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Todos os Níveis</option>
              <option value="DEBUG">DEBUG</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Todos os Status</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILURE">FAILURE</option>
              <option value="ERROR">ERROR</option>
              <option value="DENIED">DENIED</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Ferramenta MCP</label>
            <input
              type="text"
              placeholder="ex: get_player"
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Código de Erro</label>
            <input
              type="text"
              placeholder="ex: GAME_API_TIMEOUT"
              value={errorCodeFilter}
              onChange={(e) => setErrorCodeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Request ID</label>
            <input
              type="text"
              placeholder="req_..."
              value={requestIdFilter}
              onChange={(e) => setRequestIdFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Correlation ID</label>
            <input
              type="text"
              placeholder="corr_..."
              value={correlationIdFilter}
              onChange={(e) => setCorrelationIdFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>
      </form>

      {/* Tabela de Logs */}
      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="Nenhum log encontrado"
          description="Nenhum evento registrado coincide com os filtros selecionados."
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Horário</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Serviço / Actor</th>
                  <th className="px-4 py-3">Mensagem / Ferramenta</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Duração</th>
                  <th className="px-4 py-3">Correlation ID</th>
                  <th className="px-4 py-3 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {logs.map((record) => {
                  const isErr = record.level === 'ERROR' || record.level === 'CRITICAL' || record.status === 'FAILURE' || record.status === 'ERROR';
                  return (
                    <tr
                      key={record.id}
                      onClick={() => setSelectedLog(record)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isErr ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          {record.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                        {record.service || record.actorId || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-sans font-medium text-white max-w-xs truncate">
                        {record.toolName ? (
                          <span className="text-emerald-400 font-mono font-bold">{record.toolName}</span>
                        ) : (
                          record.message
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-sans">
                        <StatusBadge status={record.status || record.level} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                        {record.duration ? `${record.duration} ms` : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-indigo-400 text-[11px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTraceModal(record.correlationId);
                          }}
                          className="hover:underline flex items-center gap-1 font-mono"
                        >
                          <GitCommit className="w-3 h-3 text-indigo-400" />
                          {record.correlationId.slice(0, 15)}...
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right font-sans">
                        <span className="text-xs text-indigo-400 hover:underline">Ver</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Mostrando {logs.length} de {pagination.total} registros (Página {pagination.page} de {pagination.totalPages})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchLogs(pagination.page - 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchLogs(pagination.page + 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                Próxima <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhe do Log Sanitizado */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-white">Registro de Telemetria / Audit Log</h2>
                <p className="text-xs text-slate-400 font-mono">
                  {new Date(selectedLog.timestamp).toLocaleString()} | ID: {selectedLog.id}
                </p>
              </div>
            </div>

            {/* Banner de Rastreabilidade */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Correlation ID</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{selectedLog.correlationId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Request ID</span>
                <span className="text-xs font-mono text-slate-300">{selectedLog.requestId}</span>
              </div>
              {canViewTraces && (
                <button
                  onClick={() => openTraceModal(selectedLog.correlationId)}
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <GitCommit className="w-3.5 h-3.5" /> Ver Rastro (Trace)
                </button>
              )}
            </div>

            {/* Metadados Básicos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 block">Nível / Status:</span>
                <StatusBadge status={selectedLog.status || selectedLog.level} />
              </div>
              <div>
                <span className="text-slate-500 block">Serviço:</span>
                <span className="text-slate-200 font-bold">{selectedLog.service}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ferramenta:</span>
                <span className="text-emerald-400 font-bold">{selectedLog.toolName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Actor ID:</span>
                <span className="text-slate-300">{selectedLog.actorId || 'system'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Target ID:</span>
                <span className="text-slate-300">{selectedLog.targetId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Duração:</span>
                <span className="text-amber-400 font-bold">{selectedLog.duration ? `${selectedLog.duration} ms` : '-'}</span>
              </div>
            </div>

            {/* Parâmetros / Payload Sanitizado */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Payload e Dados Sanitizados</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-normal">
                  <ShieldCheck className="w-3.5 h-3.5" /> [REDACTED_SECRET] aplicado
                </span>
              </h4>
              <JsonViewer data={selectedLog.data || selectedLog} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Request Trace Timeline */}
      {traceData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setTraceData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <GitCommit className="w-6 h-6 text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-white">Linha do Tempo de Rastreamento (Request Trace)</h2>
                <p className="text-xs font-mono text-indigo-300">
                  Correlation ID: {traceData.correlationId}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-3 text-center text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Duração Total</span>
                <span className="text-amber-400 text-sm font-bold">{traceData.totalDurationMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block">Início</span>
                <span className="text-slate-300">{new Date(traceData.startTime).toLocaleTimeString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Etapas (Spans)</span>
                <span className="text-emerald-400 text-sm font-bold">{traceData.spans?.length || 0}</span>
              </div>
            </div>

            {/* Árvore / Linha do Tempo */}
            <div className="space-y-4 relative pl-6 border-l-2 border-indigo-500/30">
              {traceData.spans?.map((span: any, index: number) => (
                <div key={index} className="relative bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/20">
                        {span.type}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">{span.name}</span>
                    </div>
                    <span className="text-xs font-mono text-amber-400 font-semibold">{span.durationMs} ms</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-900 pt-2">
                    <span>Status: <StatusBadge status={span.status} /></span>
                    <span>{new Date(span.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

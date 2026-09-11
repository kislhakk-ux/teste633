import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  X,
  Code2,
  Activity,
  Zap,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { JsonViewer } from '../components/JsonViewer';
import { api } from '../services/api';

interface ToolsPageProps {
  tools: any[];
  onRefresh?: () => void;
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ tools = [], onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedTool, setSelectedTool] = useState<any | null>(null);
  const [testParams, setTestParams] = useState<Record<string, string>>({});
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);

  // Métricas e Incidentes reais da Etapa 8
  const [toolMetrics, setToolMetrics] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  const fetchMetricsAndIncidents = async () => {
    try {
      const [m, inc] = await Promise.all([
        api.getToolMetrics().catch(() => []),
        api.getIncidentGroups().catch(() => []),
      ]);
      setToolMetrics(m || []);
      setIncidents(inc || []);
    } catch {
      // Silencioso se degradado
    }
  };

  useEffect(() => {
    fetchMetricsAndIncidents();
  }, []);

  const metricsMap = new Map(toolMetrics.map((m: any) => [m.toolName, m]));

  // Filtering tools
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || tool.category.toUpperCase() === categoryFilter.toUpperCase();
    const matchesRisk =
      riskFilter === 'ALL' || tool.riskLevel.toUpperCase() === riskFilter.toUpperCase();

    return matchesSearch && matchesCategory && matchesRisk;
  });

  const categories = Array.from(new Set(tools.map((t) => (t.category || 'SYSTEM').toUpperCase())));

  const handleSelectTool = (tool: any) => {
    setSelectedTool(tool);
    setExecutionResult(null);
    setTestParams({});
  };

  const handleExecuteTool = async () => {
    if (!selectedTool) return;
    if (selectedTool.riskLevel !== 'LOW' || !selectedTool.readOnly) {
      if (onToast) {
        onToast(
          `Bloqueio de Segurança: A ferramenta '${selectedTool.name}' não pode ser executada no Dashboard sem autorização avançada.`,
          'error'
        );
      }
      return;
    }

    setExecuting(true);
    const startMs = Date.now();
    try {
      const result = await api.executeTool(selectedTool.name, testParams);
      const durationMs = Date.now() - startMs;
      setExecutionResult(result);

      const historyItem = {
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        durationMs,
        result,
      };
      setExecutionHistory((prev) => [historyItem, ...prev.slice(0, 9)]);

      if (onToast) {
        onToast(`Ferramenta ${selectedTool.name} executada com sucesso`, 'success');
      }
      fetchMetricsAndIncidents();
    } catch (err: any) {
      const durationMs = Date.now() - startMs;
      const errorMsg = err.message || 'Erro ao executar ferramenta';
      setExecutionResult({ error: errorMsg });

      const historyItem = {
        timestamp: new Date().toISOString(),
        status: 'ERROR',
        durationMs,
        error: errorMsg,
      };
      setExecutionHistory((prev) => [historyItem, ...prev.slice(0, 9)]);

      if (onToast) {
        onToast(errorMsg, 'error');
      }
      fetchMetricsAndIncidents();
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar ferramenta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Categoria:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Todas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Risco:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Todos</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seção Top Errors / Incidentes Agrupados */}
      {incidents.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Top Errors & Incidentes Frequentes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {incidents.slice(0, 3).map((inc: any, idx: number) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between items-center text-rose-400 font-bold">
                  <span>{inc.errorCode}</span>
                  <span className="bg-rose-500/20 px-2 py-0.5 rounded text-[10px]">{inc.count}x</span>
                </div>
                <div className="text-slate-400 text-[11px] font-sans truncate">{inc.sampleMessage}</div>
                <div className="text-[10px] text-slate-500">Serviço: {inc.service}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tools Table com Métricas Reais */}
      {filteredTools.length === 0 ? (
        <EmptyState
          title="Nenhuma ferramenta MCP encontrada"
          description="Nenhuma ferramenta corresponde aos critérios de pesquisa ou categoria selecionada."
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Ferramenta</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Execuções</th>
                  <th className="px-4 py-3">Taxa Sucesso</th>
                  <th className="px-4 py-3">Latência (Média / P95)</th>
                  <th className="px-4 py-3">Risco</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {filteredTools.map((tool) => {
                  const metric = metricsMap.get(tool.name);
                  const calls = metric ? metric.calls : tool.executionsCount || 0;
                  const successRate = metric ? metric.successRate : 100;
                  const avgDuration = metric ? metric.averageDuration : 0;
                  const p95 = metric?.p95;

                  const isLowReadOnly = tool.riskLevel === 'LOW' && tool.readOnly;
                  return (
                    <tr
                      key={tool.name}
                      onClick={() => handleSelectTool(tool)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-semibold text-emerald-400">
                        <div>{tool.name}</div>
                        <div className="text-[11px] font-sans text-slate-400 font-normal line-clamp-1">
                          {tool.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {tool.category || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-200 font-bold">{calls}</td>
                      <td className="px-4 py-3 font-sans">
                        <span
                          className={`font-bold ${
                            successRate >= 95
                              ? 'text-emerald-400'
                              : successRate >= 80
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {successRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {avgDuration} ms {p95 ? <span className="text-[10px] text-slate-500">(p95: {p95}ms)</span> : null}
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tool.riskLevel === 'LOW'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {tool.riskLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTool(tool);
                          }}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
                        >
                          {isLowReadOnly ? 'Testar' : 'Detalhes'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tool Tester & Details Drawer Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTool(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-3">
                <Wrench className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="text-lg font-bold text-white font-mono">{selectedTool.name}</h2>
                  <p className="text-xs text-slate-400">{selectedTool.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium font-sans">
                  {selectedTool.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 font-sans">
                  {selectedTool.riskLevel}
                </span>
                {selectedTool.readOnly ? (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-medium font-sans">
                    Read-Only
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium font-sans">
                    Write / Critical
                  </span>
                )}
              </div>
            </div>

            {/* Test Form if LOW and READ-ONLY */}
            {selectedTool.riskLevel === 'LOW' && selectedTool.readOnly ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" /> Testador de Ferramenta
                  </h4>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Permitido (LOW / READ-ONLY)
                  </span>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-400">
                    Parâmetros (ex: ID do Jogador)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: player_1 ou id=p123"
                    value={testParams.playerId || testParams.id || ''}
                    onChange={(e) =>
                      setTestParams({ playerId: e.target.value, id: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleExecuteTool}
                  disabled={executing}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {executing ? 'Executando Tool...' : 'Executar Tool (Read-Only)'}
                </button>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-xs text-rose-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <ShieldAlert className="w-4 h-4" /> Execução Bloqueada no Dashboard
                </div>
                <p className="text-slate-300">
                  Ferramentas com risco <strong>{selectedTool.riskLevel}</strong> ou que realizam operações de escrita não podem ser executadas nesta versão do Dashboard sem autorização avançada.
                </p>
              </div>
            )}

            {/* Execution Result */}
            {executionResult && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Resultado da Execução
                </h4>
                <div className="max-h-60 overflow-y-auto">
                  <JsonViewer data={executionResult} />
                </div>
              </div>
            )}

            {/* Local Execution History */}
            {executionHistory.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Histórico Recente de Testes
                </h4>
                <div className="space-y-1.5">
                  {executionHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-slate-950 px-3 py-1.5 rounded border border-slate-800 font-mono"
                    >
                      <span className="text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                      <span
                        className={
                          item.status === 'SUCCESS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                        }
                      >
                        {item.status}
                      </span>
                      <span className="text-slate-500">{item.durationMs} ms</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

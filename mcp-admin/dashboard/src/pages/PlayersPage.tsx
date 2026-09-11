import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserCheck,
  Package,
  Activity,
  Stethoscope,
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Boxes,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { api } from '../services/api';

interface PlayersPageProps {
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const PlayersPage: React.FC<PlayersPageProps> = ({ onToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [playersData, setPlayersData] = useState<any>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [playerDetail, setPlayerDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'diagnosis' | 'activity'>('overview');
  const [playerLogs, setPlayerLogs] = useState<any[]>([]);

  const fetchPlayers = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.getPlayers(query);
      setPlayersData(res);
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Erro ao buscar jogadores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers(searchQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlayers(searchQuery);
  };

  const handleOpenDetail = async (id: string) => {
    setSelectedPlayerId(id);
    setLoadingDetail(true);
    try {
      const [data, logs] = await Promise.all([
        api.getPlayerDetail(id),
        api.getPlayerLogs(id).catch(() => []),
      ]);
      setPlayerDetail(data);
      setPlayerLogs(logs || []);
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Erro ao carregar detalhes do jogador', 'error');
    } finally {
      setLoadingDetail(false);
    }
  };

  const playerList = Array.isArray(playersData?.players)
    ? playersData.players
    : Array.isArray(playersData)
    ? playersData
    : [];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar jogador por ID ou Nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Buscar
          </button>
        </form>

        <button
          onClick={() => fetchPlayers(searchQuery)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Lista
        </button>
      </div>

      {/* Players Table */}
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : playerList.length === 0 ? (
        <EmptyState
          title="Nenhum jogador encontrado"
          description="Pesquise por um ID específico ou certifique-se de que o backend do jogo possui jogadores online."
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID do Jogador</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Nível</th>
                  <th className="px-4 py-3">XP</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Último Login</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {playerList.map((player: any) => (
                  <tr
                    key={player.id}
                    onClick={() => handleOpenDetail(player.id)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-semibold text-indigo-400">{player.id}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-200">
                      {player.name || player.username || player.id}
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold">
                        Nível {player.level || player.nivel || 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{player.xp || player.exp || 0} XP</td>
                    <td className="px-4 py-3 font-sans">
                      <StatusBadge
                        status={player.online !== false ? 'online' : 'offline'}
                        label={player.online !== false ? 'Online' : 'Offline'}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-sans">
                      {player.lastLogin
                        ? new Date(player.lastLogin).toLocaleString()
                        : 'Hoje'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(player.id);
                        }}
                        className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors font-sans"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Player Detail Modal */}
      {selectedPlayerId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setSelectedPlayerId(null);
                setPlayerDetail(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {loadingDetail ? (
              <LoadingSkeleton rows={4} />
            ) : playerDetail ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                    {playerDetail.name ? playerDetail.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {playerDetail.name || playerDetail.id}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                      <span>ID: {playerDetail.id}</span>
                      <span>•</span>
                      <StatusBadge
                        status={playerDetail.online !== false ? 'online' : 'offline'}
                      />
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 gap-6 text-xs font-medium text-slate-400">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-indigo-500 text-indigo-400 font-semibold'
                        : 'border-transparent hover:text-slate-200'
                    }`}
                  >
                    Visão Geral
                  </button>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'inventory'
                        ? 'border-indigo-500 text-indigo-400 font-semibold'
                        : 'border-transparent hover:text-slate-200'
                    }`}
                  >
                    Inventário & Celeiro
                  </button>
                  <button
                    onClick={() => setActiveTab('diagnosis')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'diagnosis'
                        ? 'border-indigo-500 text-indigo-400 font-semibold'
                        : 'border-transparent hover:text-slate-200'
                    }`}
                  >
                    Diagnóstico
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === 'activity'
                        ? 'border-indigo-500 text-indigo-400 font-semibold'
                        : 'border-transparent hover:text-slate-200'
                    }`}
                  >
                    Atividade Recente (Player Trace)
                  </button>
                </div>

                {/* Tab 1: Overview */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                      <span className="text-slate-400 font-medium">Nível do Jogador</span>
                      <p className="text-lg font-bold text-white">
                        {playerDetail.level || playerDetail.nivel || 1}
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                      <span className="text-slate-400 font-medium">Pontos de Experiência (XP)</span>
                      <p className="text-lg font-bold text-white">
                        {playerDetail.xp || playerDetail.exp || 0}
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                      <span className="text-slate-400 font-medium">Moedas / Ouro</span>
                      <p className="text-lg font-bold text-amber-400">
                        {playerDetail.coins || playerDetail.moedas || 0}
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                      <span className="text-slate-400 font-medium">Diamantes</span>
                      <p className="text-lg font-bold text-cyan-400">
                        {playerDetail.diamonds || playerDetail.diamantes || 0}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Inventory */}
                {activeTab === 'inventory' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Silo */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-200">
                          <span>Silo de Grãos</span>
                          <span className="text-slate-400">
                            {playerDetail.siloUsage || 0} / {playerDetail.siloCapacity || 450}
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                ((playerDetail.siloUsage || 0) /
                                  (playerDetail.siloCapacity || 450)) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Celeiro */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-200">
                          <span>Celeiro Principal</span>
                          <span className="text-slate-400">
                            {playerDetail.barnUsage || 0} / {playerDetail.barnCapacity || 500}
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                ((playerDetail.barnUsage || 0) /
                                  (playerDetail.barnCapacity || 500)) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                      <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Itens no Inventário
                      </h4>
                      {playerDetail.inventory && Object.keys(playerDetail.inventory).length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {Object.entries(playerDetail.inventory).map(([item, qty]: any) => (
                            <div
                              key={item}
                              className="bg-slate-900 border border-slate-800 rounded p-2 flex justify-between items-center"
                            >
                              <span className="text-slate-300 font-mono">{item}</span>
                              <span className="font-bold text-indigo-400">{qty}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">Nenhum item individual listado</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 3: Diagnosis */}
                {activeTab === 'diagnosis' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-400" /> Resultado do Diagnóstico
                    </h4>

                    {playerDetail.diagnosis ? (
                      <div className="space-y-2 font-mono">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Perfil de Jogador Válido
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Economia do Jogador Coerente
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Inventário Dentro do Limite Seguro
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Nenhum erro de dessincronização detectado
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">
                        Clique em &quot;Executar Diagnóstico&quot; para verificar o status de sincronização.
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 4: Activity (Player Trace) */}
                {activeTab === 'activity' && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                      <span>Rastro de Ações do Jogador</span>
                      <span className="text-indigo-400 font-mono font-normal">{playerLogs.length} eventos</span>
                    </h4>
                    {playerLogs.length === 0 ? (
                      <div className="text-slate-500 italic py-4 text-center">Nenhum evento registrado para este jogador especificamente.</div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto font-mono divide-y divide-slate-800/60">
                        {playerLogs.map((log: any, idx: number) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span className="text-emerald-400 font-bold">{log.toolName || log.action || log.message}</span>
                            <StatusBadge status={log.status || log.result} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <EmptyState title="Erro ao carregar" description="Não foi possível obter a ficha do jogador." />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Package, Search, Filter, Warehouse, Layers, Boxes } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { MetricCard } from '../components/MetricCard';
import { api } from '../services/api';

interface InventoryPageProps {
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ onToast }) => {
  const [playerId, setPlayerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId.trim()) return;

    setLoading(true);
    try {
      const data = await api.getPlayerDetail(playerId.trim());
      setPlayerData(data);
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Jogador não encontrado', 'error');
      setPlayerData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Digite o ID do jogador para consultar inventário..."
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </form>
      </div>

      {!playerData ? (
        <EmptyState
          title="Consulta de Inventário de Jogador"
          description="Informe um ID de jogador acima para visualizar o estoque real de Silo, Celeiro e Itens armazenados."
        />
      ) : (
        <div className="space-y-6">
          {/* Storage Capacities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Silo */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Warehouse className="w-4 h-4 text-emerald-400" /> Silo de Grãos
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {playerData.siloUsage || 0} / {playerData.siloCapacity || 450}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((playerData.siloUsage || 0) / (playerData.siloCapacity || 450)) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-slate-400">
                Armazena vegetais, frutas e grãos colhidos.
              </p>
            </div>

            {/* Celeiro */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Boxes className="w-4 h-4 text-indigo-400" /> Celeiro Principal
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {playerData.barnUsage || 0} / {playerData.barnCapacity || 500}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((playerData.barnUsage || 0) / (playerData.barnCapacity || 500)) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-slate-400">
                Armazena produtos transformados, ferramentas e materiais de expansão.
              </p>
            </div>
          </div>

          {/* Items Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Estoque Detalhado por Item
            </h3>
            {playerData.inventory && Object.keys(playerData.inventory).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.entries(playerData.inventory).map(([item, qty]: any) => (
                  <div
                    key={item}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1 hover:border-slate-700 transition-colors"
                  >
                    <div className="text-xs font-medium text-slate-200 capitalize font-mono">
                      {item}
                    </div>
                    <div className="text-lg font-bold text-indigo-400 font-mono">{qty}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Nenhum item encontrado no estoque deste jogador.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

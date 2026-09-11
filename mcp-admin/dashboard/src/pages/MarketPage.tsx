import React, { useEffect, useState } from 'react';
import {
  Store,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Stethoscope,
  ShoppingBag,
  User,
  Search,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { api } from '../services/api';

interface MarketPageProps {
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const MarketPage: React.FC<MarketPageProps> = ({ onToast }) => {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<any | null>(null);
  const [filterText, setFilterText] = useState('');

  const fetchMarket = async () => {
    setLoading(true);
    try {
      const res = await api.getMarket();
      setMarketData(res);
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Erro ao carregar dados da Banca', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  const status = marketData?.status || {};
  const diagnosis = marketData?.diagnosis || {};
  const shops = Array.isArray(status.shops) ? status.shops : [];

  const filteredShops = shops.filter((shop: any) => {
    const text = filterText.toLowerCase();
    return (
      (shop.ownerId && shop.ownerId.toLowerCase().includes(text)) ||
      (shop.ownerName && shop.ownerName.toLowerCase().includes(text))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Banca da Beira da Estrada (Roadside Shop)</h2>
            <p className="text-xs text-slate-400">
              Monitoramento de bancas de jogadores e diagnóstico de transações
            </p>
          </div>
        </div>

        <button
          onClick={fetchMarket}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Executar Diagnóstico da Banca
        </button>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <LoadingSkeleton rows={2} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Total de Bancas</span>
            <p className="text-2xl font-bold text-white font-mono mt-1">
              {status.totalShops ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Slots Ocupados</span>
            <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">
              {status.occupiedSlots ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Anúncios Ativos</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              {status.activeListingsCount ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Erros Registrados</span>
            <p className="text-2xl font-bold text-rose-400 font-mono mt-1">
              {status.errorsCount ?? 0}
            </p>
          </div>
        </div>
      )}

      {/* Diagnostic Card */}
      {diagnosis && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-400" /> Diagnóstico do Mercado & Bancas
          </h3>

          <div className="space-y-2 text-xs font-mono">
            {diagnosis.healthy ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Bancas totalmente funcionais. Nenhuma colisão de slots ou moedas perdidas.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {diagnosis.issuesCount || 1} incoerência(s) detectada(s) nas bancas dos jogadores
                  </span>
                </div>
                {diagnosis.issues &&
                  diagnosis.issues.map((issue: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300 pl-4">
                      <span className="text-amber-400">⚠</span> {issue}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shops Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-3 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Bancas de Jogadores Ativas
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filtrar por vendedor..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {filteredShops.length === 0 ? (
          <EmptyState
            title="Nenhuma banca encontrada"
            description="Não existem bancas registradas ou que coincidam com o filtro pesquisado."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Vendedor</th>
                  <th className="px-4 py-3">Slots Utilizados</th>
                  <th className="px-4 py-3">Status da Banca</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {filteredShops.map((shop: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-200 font-sans font-medium">
                      {shop.ownerName || shop.ownerId || `Jogador ${idx + 1}`}
                    </td>
                    <td className="px-4 py-3 text-indigo-400 font-bold">
                      {shop.occupiedSlots || 0} slots
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <StatusBadge status="online" label="Ativa" />
                    </td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className="text-xs text-slate-400">Ver slots</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

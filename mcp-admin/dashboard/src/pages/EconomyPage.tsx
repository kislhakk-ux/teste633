import React, { useEffect, useState } from 'react';
import { Coins, Gem, TrendingUp, TrendingDown, ArrowLeftRight, Info } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { EmptyState } from '../components/EmptyState';
import { api } from '../services/api';

interface EconomyPageProps {
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const EconomyPage: React.FC<EconomyPageProps> = ({ onToast }) => {
  const [marketData, setMarketData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEconomy() {
      try {
        const data = await api.getMarket();
        setMarketData(data);
      } catch (err: any) {
        if (onToast) onToast('Erro ao obter métricas da economia', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadEconomy();
  }, []);

  return (
    <div className="space-y-6">
      {/* Real Economy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Moedas em Circulação"
          value="Não disponível"
          subtitle="Somatórios globais requerem endpoint agregado no backend"
          icon={Coins}
          color="amber"
        />
        <MetricCard
          title="Diamantes Ativos"
          value="Não disponível"
          subtitle="Integração de saldo global pendente"
          icon={Gem}
          color="indigo"
        />
        <MetricCard
          title="Bancas Ativas"
          value={marketData?.status?.activeListingsCount ?? '0'}
          subtitle="Anúncios abertos no mercado da beira da estrada"
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Taxa de Erro da Banca"
          value={marketData?.status?.errorsCount ?? 0}
          subtitle="Falhas registradas no fluxo econômico"
          icon={TrendingDown}
          color="rose"
        />
      </div>

      {/* Real Market Transactions & Diagnosis */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-emerald-400" /> Fluxo Econômico da Banca e Mercado
        </h3>

        {marketData?.status ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <span className="text-slate-400 font-medium">Bancas Registradas</span>
              <p className="text-lg font-bold text-white font-mono mt-1">
                {marketData.status.totalShops || 0}
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <span className="text-slate-400 font-medium">Slots Ocupados</span>
              <p className="text-lg font-bold text-indigo-400 font-mono mt-1">
                {marketData.status.occupiedSlots || 0}
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <span className="text-slate-400 font-medium">Preço Médio por Item</span>
              <p className="text-lg font-bold text-amber-400 font-mono mt-1">
                {marketData.status.avgPrice ? `${marketData.status.avgPrice} moedas` : 'Variável'}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Dados econômicos agregados indisponíveis"
            description="Conforme as diretrizes de segurança, números não são inventados ou mockados no frontend."
          />
        )}
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-400">
        <Info className="w-5 h-5 text-indigo-400 shrink-0" />
        <p>
          Para exibir o total de moedas e transações em tempo real de todo o servidor, habilite a rota agregada no <code>mcp-admin</code>. O frontend consome apenas APIs reais.
        </p>
      </div>
    </div>
  );
};

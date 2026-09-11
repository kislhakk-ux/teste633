import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Stethoscope,
  ShoppingBag,
  Clock,
  User,
  ShieldAlert,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { api } from '../services/api';

interface JournalPageProps {
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ onToast }) => {
  const [loading, setLoading] = useState(true);
  const [journalData, setJournalData] = useState<any | null>(null);

  const fetchJournal = async () => {
    setLoading(true);
    try {
      const res = await api.getJournal();
      setJournalData(res);
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Erro ao carregar dados do Jornal', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournal();
  }, []);

  const status = journalData?.status || {};
  const diagnosis = journalData?.diagnosis || {};
  const listings = Array.isArray(status.listings) ? status.listings : [];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Jornal da Comunidade (Anúncios)</h2>
            <p className="text-xs text-slate-400">
              Gerenciamento de anúncios públicos e verificação de sincronização
            </p>
          </div>
        </div>
        <button
          onClick={fetchJournal}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Executar Diagnóstico & Atualizar
        </button>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <LoadingSkeleton rows={2} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Anúncios Ativos</span>
            <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              {status.activeCount ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Anúncios Expirados</span>
            <p className="text-2xl font-bold text-amber-400 font-mono mt-1">
              {status.expiredCount ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Falhas de Sincronização</span>
            <p className="text-2xl font-bold text-rose-400 font-mono mt-1">
              {status.errorsCount ?? 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium">Última Sincronização</span>
            <p className="text-xs font-bold text-slate-200 font-mono mt-2">
              {status.lastSync ? new Date(status.lastSync).toLocaleTimeString() : 'Agora'}
            </p>
          </div>
        </div>
      )}

      {/* Diagnostic Visual Card */}
      {diagnosis && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-400" /> Diagnóstico do Jornal
          </h3>

          <div className="space-y-2 text-xs font-mono">
            {diagnosis.healthy ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Jornal totalmente operacional. Nenhum anúncio órfão ou dessincronizado.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {diagnosis.issuesCount || 1} problema(s) detectado(s) na sincronização de anúncios
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

      {/* Listings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-3 p-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Listagem de Anúncios no Jornal
        </h3>

        {listings.length === 0 ? (
          <EmptyState
            title="Nenhum anúncio ativo no jornal"
            description="Quando os jogadores anunciarem itens no mercado da beira da estrada com a opção de jornal ativada, eles aparecerão aqui."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID Anúncio</th>
                  <th className="px-4 py-3">Vendedor</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Qtd</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {listings.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-indigo-400 font-semibold">{item.id}</td>
                    <td className="px-4 py-3 text-slate-200 font-sans">{item.sellerName || item.sellerId}</td>
                    <td className="px-4 py-3 text-emerald-400 capitalize">{item.itemName}</td>
                    <td className="px-4 py-3 font-bold">{item.quantity}</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">{item.price} moedas</td>
                    <td className="px-4 py-3 font-sans">
                      <StatusBadge status={item.status || 'online'} />
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : 'Recente'}
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

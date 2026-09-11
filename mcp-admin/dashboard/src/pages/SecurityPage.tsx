import React from 'react';
import { ShieldCheck, ShieldAlert, Key, Lock, Eye, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const SecurityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Security Posture Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Postura de Segurança & Trava Read-Only</h2>
            <p className="text-xs text-slate-400">
              Controle de acesso do barramento MCP e higienização de credenciais
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold font-mono">
          Proteção Ativa (Etapa 6)
        </span>
      </div>

      {/* Security Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Token Configuration Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" /> Variáveis de Autenticação no Servidor
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="font-mono text-slate-300 font-semibold">MCP_ACCESS_TOKEN</span>
                <span className="block text-slate-500 font-mono text-[11px] mt-0.5">
                  ••••••••••••••••••••••••
                </span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Configurado
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="font-mono text-slate-300 font-semibold">GAME_API_TOKEN</span>
                <span className="block text-slate-500 font-mono text-[11px] mt-0.5">
                  ••••••••••••••••••••••••
                </span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Configurado
              </span>
            </div>
          </div>
        </div>

        {/* Read-Only Lock Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" /> Trava de Execução do Dashboard
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Tools Permitidas no Dashboard</span>
                <span className="text-emerald-400 font-bold font-mono">SOMENTE READ-ONLY</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Qualquer tentativa de executar ferramentas categorizadas como <strong>MEDIUM</strong>, <strong>HIGH</strong> ou de escrita via Dashboard é abortada pelo controlador do backend.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Etapa 7 Note */}
      <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3 text-xs text-indigo-300">
        <Info className="w-5 h-5 text-indigo-400 shrink-0" />
        <p>
          <strong>Próxima Fase (Etapa 7):</strong> O sistema completo de Autenticação Administrativa com Login, Sessões JWT/Cookies e Níveis de Permissão será implementado na Etapa 7.
        </p>
      </div>
    </div>
  );
};

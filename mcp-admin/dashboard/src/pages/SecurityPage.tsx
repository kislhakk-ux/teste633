import React from 'react';
import { ShieldCheck, ShieldAlert, Key, Lock, Eye, CheckCircle2, AlertTriangle, Info, Terminal, UserCheck } from 'lucide-react';
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
            <h2 className="text-sm font-bold text-white">Postura de Segurança & Hardening de Produção</h2>
            <p className="text-xs text-slate-400">
              Controle de acesso do barramento MCP, políticas de autorização RBAC e auditoria de telemetria
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold font-mono">
          Blindagem Ativa (Produção)
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
                  •••••••••••••••••••••••• (Bearer Token Ativo)
                </span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Configurado
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="font-mono text-slate-300 font-semibold">ADMIN_SESSION_SECRET / JWT</span>
                <span className="block text-slate-500 font-mono text-[11px] mt-0.5">
                  •••••••••••••••••••••••• (Criptografia SHA-256)
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
            <Lock className="w-4 h-4 text-amber-400" /> Trava de Execução & Políticas de Escrita
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Tools Permitidas no Dashboard</span>
                <span className="text-emerald-400 font-bold font-mono">SOMENTE READ-ONLY</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Todas as 14 ferramentas registradas estão em conformidade com o nível de segurança <strong>LOW</strong> e modo de leitura.
              </p>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="font-mono text-slate-300 font-semibold">ADMIN_WRITE_MODE</span>
                <span className="block text-slate-500 text-[11px]">Trava de segurança de escrita</span>
              </div>
              <span className="text-amber-400 font-mono font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                DISABLED (Safe Mode)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RBAC & Audit Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" /> Controle de Permissões RBAC
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">👑 OWNER</span>
            <p className="text-slate-400 text-[11px]">Acesso irrestrito a telemetria, criação de administradores e diagnósticos profundos.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-indigo-400 block mb-1">🛡️ OPERATOR</span>
            <p className="text-slate-400 text-[11px]">Execução de ferramentas de diagnóstico, inspeção de mercado e logs.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="font-bold text-slate-300 block mb-1">👁️ READ_ONLY</span>
            <p className="text-slate-400 text-[11px]">Visualização de painéis e métricas de desempenho sem poder de alteração.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

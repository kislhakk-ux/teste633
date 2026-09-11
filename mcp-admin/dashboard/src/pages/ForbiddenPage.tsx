import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ForbiddenPageProps {
  onNavigate?: (path: string) => void;
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-full flex flex-col items-center justify-center text-center p-8">
      <div className="max-w-md space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-rose-400 font-mono text-sm font-semibold mb-4">403 Forbidden</p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Você não possui permissão para acessar esta área.
          </p>
          {user && (
            <p className="text-xs text-slate-500 mt-2">
              Perfil atual:{' '}
              <span className="text-slate-300 font-semibold">{user.role}</span>. Entre em contato
              com o administrador OWNER para solicitar acesso.
            </p>
          )}
        </div>

        <button
          onClick={() => onNavigate?.('/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

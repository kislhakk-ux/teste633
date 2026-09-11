import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Clock,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ROLE_COLORS: Record<string, string> = {
  OWNER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ADMIN: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  SUPPORT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  READ_ONLY: 'bg-slate-800 text-slate-400 border-slate-700',
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ onToast }) => {
  const { user, changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!user) return null;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    setChangingPassword(true);

    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onToast) onToast('Senha alterada com sucesso!', 'success');
    } catch (err: any) {
      setPwError(err.message || 'Erro ao alterar senha.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-400">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">{user.name}</h2>
          <p className="text-sm text-slate-400">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${ROLE_COLORS[user.role]}`}
            >
              {user.role}
            </span>
            {user.active && (
              <span className="px-2 py-0.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-medium">
                Ativa
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" /> Informações da Conta
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <span className="text-slate-500 block mb-1">ID</span>
            <span className="text-slate-300 font-mono">{user.id.substring(0, 16)}…</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <span className="text-slate-500 block mb-1">Conta criada</span>
            <span className="text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 sm:col-span-2">
            <span className="text-slate-500 block mb-1">Último acesso</span>
            <span className="text-slate-300">
              {user.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : 'Primeiro acesso'}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Permissões Concedidas ao Seu Perfil
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.permissions.map((perm) => (
            <span
              key={perm}
              className="px-2.5 py-1 text-xs font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" /> Alterar Senha
        </h3>

        {pwSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4" /> Senha alterada com sucesso!
          </div>
        )}
        {pwError && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
            <AlertCircle className="w-4 h-4" /> {pwError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          {[
            {
              id: 'current-password',
              label: 'Senha Atual',
              value: currentPassword,
              set: setCurrentPassword,
              show: showCurrent,
              toggle: () => setShowCurrent(!showCurrent),
            },
            {
              id: 'new-password',
              label: 'Nova Senha (mín. 10 caracteres)',
              value: newPassword,
              set: setNewPassword,
              show: showNew,
              toggle: () => setShowNew(!showNew),
            },
            {
              id: 'confirm-password',
              label: 'Confirmar Nova Senha',
              value: confirmPassword,
              set: setConfirmPassword,
              show: showNew,
              toggle: () => setShowNew(!showNew),
            },
          ].map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">{field.label}</label>
              <div className="relative">
                <input
                  id={field.id}
                  type={field.show ? 'text' : 'password'}
                  required
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  disabled={changingPassword}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pr-9 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={field.toggle}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {field.show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {changingPassword ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

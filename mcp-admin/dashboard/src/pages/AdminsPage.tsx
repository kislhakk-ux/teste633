import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldOff,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Crown,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'SUPPORT' | 'READ_ONLY';
  active: boolean;
  permissions: string[];
  createdAt: string;
  lastLoginAt: string | null;
}

interface AdminsPageProps {
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ROLE_COLORS: Record<string, string> = {
  OWNER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ADMIN: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  SUPPORT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  READ_ONLY: 'bg-slate-800 text-slate-400 border-slate-700',
};

const ROLE_OPTIONS: AdminUser['role'][] = ['OWNER', 'ADMIN', 'SUPPORT', 'READ_ONLY'];

async function apiFetch(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(body?.error?.message || `Erro HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return body;
}

export const AdminsPage: React.FC<AdminsPageProps> = ({ onToast }) => {
  const { user: currentUser, hasPermission } = useAuth();

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulário de criação
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ADMIN' as AdminUser['role'] });
  const [showPw, setShowPw] = useState(false);

  const canManage = hasPermission('admins:manage');

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/admin/users');
      setAdmins(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar administradores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await apiFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      await loadAdmins();
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', role: 'ADMIN' });
      if (onToast) onToast('Administrador criado com sucesso!', 'success');
    } catch (err: any) {
      setCreateError(err.message || 'Erro ao criar administrador.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (admin: AdminUser) => {
    try {
      await apiFetch(`/api/admin/users/${admin.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !admin.active }),
      });
      await loadAdmins();
      if (onToast)
        onToast(`Conta ${!admin.active ? 'ativada' : 'desativada'}: ${admin.name}`, 'info');
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Erro ao atualizar conta.', 'error');
    }
  };

  const handleChangeRole = async (admin: AdminUser, newRole: AdminUser['role']) => {
    try {
      await apiFetch(`/api/admin/users/${admin.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      await loadAdmins();
      if (onToast) onToast(`Role de ${admin.name} atualizado para ${newRole}`, 'success');
    } catch (err: any) {
      if (onToast) onToast(err.message || 'Erro ao alterar role.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Administradores
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Gerencie as contas de acesso administrativo</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Novo Admin
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreate && canManage && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-400" /> Criar Novo Administrador
          </h3>
          {createError && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 mb-4">
              <AlertCircle className="w-4 h-4" /> {createError}
            </div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nome</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Senha</label>
              <div className="relative">
                <input
                  required
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 pr-8 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Mínimo 10 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser['role'] })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {ROLE_OPTIONS.filter(
                  (r) => r !== 'OWNER' || currentUser?.role === 'OWNER'
                ).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {creating ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      ) : (
        <div className="space-y-3">
          {admins.map((admin) => {
            const isSelf = admin.id === currentUser?.id;
            return (
              <div
                key={admin.id}
                className={`bg-slate-900 border rounded-xl p-4 flex items-center gap-4 ${
                  !admin.active ? 'border-slate-800 opacity-60' : 'border-slate-800'
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400 shrink-0">
                  {admin.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">{admin.name}</span>
                    {isSelf && (
                      <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono">
                        você
                      </span>
                    )}
                    {admin.role === 'OWNER' && (
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{admin.email}</div>
                  <div className="text-xs text-slate-500">
                    Último acesso:{' '}
                    {admin.lastLoginAt
                      ? new Date(admin.lastLoginAt).toLocaleString()
                      : 'Nunca'}
                  </div>
                </div>

                {/* Role Badge */}
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full border ${ROLE_COLORS[admin.role]} hidden sm:block shrink-0`}
                >
                  {admin.role}
                </span>

                {/* Actions — somente para quem tem permissão e não é a própria conta */}
                {canManage && !isSelf && (
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Alterar Role */}
                    <select
                      value={admin.role}
                      onChange={(e) => handleChangeRole(admin, e.target.value as AdminUser['role'])}
                      className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      {ROLE_OPTIONS.filter(
                        (r) => r !== 'OWNER' || currentUser?.role === 'OWNER'
                      ).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>

                    {/* Ativar/Desativar */}
                    <button
                      onClick={() => handleToggleActive(admin)}
                      title={admin.active ? 'Desativar conta' : 'Ativar conta'}
                      className={`p-2 rounded-lg transition-colors ${
                        admin.active
                          ? 'text-rose-400 hover:bg-rose-500/10'
                          : 'text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {admin.active ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

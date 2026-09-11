import React from 'react';

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label: customLabel, size = 'sm' }) => {
  const normalized = (status || '').toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-400 border-slate-700';
  let dotClass = 'bg-slate-400';
  let label = customLabel || status;

  if (['online', 'healthy', 'ready', 'success', 'low', 'true'].includes(normalized)) {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotClass = 'bg-emerald-400 animate-pulse';
    label = normalized === 'online' ? 'Online' : normalized === 'healthy' ? 'Saudável' : status;
  } else if (['degraded', 'warning', 'medium'].includes(normalized)) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotClass = 'bg-amber-400';
    label = normalized === 'degraded' ? 'Degradado' : status;
  } else if (['offline', 'error', 'failure', 'high', 'critical', 'issues_detected'].includes(normalized)) {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotClass = 'bg-rose-400';
    label = normalized === 'offline' ? 'Offline' : normalized === 'issues_detected' ? 'Problemas' : status;
  } else if (['not_connected', 'not_configured'].includes(normalized)) {
    colorClasses = 'bg-slate-800 text-slate-400 border-slate-700';
    dotClass = 'bg-slate-500';
    label = normalized === 'not_connected' ? 'Não Conectado' : 'Não Configurado';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorClasses} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
      <span className="capitalize">{label}</span>
    </span>
  );
};

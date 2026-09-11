import React, { useState } from 'react';
import { sound } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmName: string;
  onUpdateFarmName: (name: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  graphicsStyle: '3d_rendered' | '2d_flat';
  onToggleGraphicsStyle: () => void;
  googleUser: { name?: string; email?: string; imageUrl?: string } | null;
  onLogout: () => void;
  onGoogleLogin?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  farmName,
  onUpdateFarmName,
  soundEnabled,
  onToggleSound,
  musicEnabled,
  onToggleMusic,
  graphicsStyle,
  onToggleGraphicsStyle,
  googleUser,
  onLogout,
  onGoogleLogin,
}) => {
  const [editingName, setEditingName] = useState(farmName);

  if (!isOpen) return null;

  const handleSaveName = () => {
    sound.playClick();
    if (editingName.trim()) {
      onUpdateFarmName(editingName.trim());
      alert('Nome da fazenda atualizado com sucesso!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-[#fffbeb] border-4 border-[#eab308] rounded-[32px] max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-6 py-4 flex items-center justify-between border-b-4 border-amber-950">
          <h2 className="text-xl font-black text-yellow-100 flex items-center gap-2">
            <span>⚙️</span> Configurações
          </h2>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-amber-950/80 hover:bg-amber-900 border border-amber-600 text-yellow-100 font-extrabold flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
          
          {/* Sounds & Graphics Settings */}
          <div className="bg-amber-100/60 border border-amber-200 p-4 rounded-2xl flex flex-col gap-3">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">
              Áudio e Gráficos
            </h3>
            
            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>{soundEnabled ? '🔊' : '🔇'}</span> Efeitos de Som
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleSound();
                }}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border-2 shadow active:scale-95 transition-all cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-amber-950/80 text-amber-200 border-amber-700'
                }`}
              >
                {soundEnabled ? 'ATIVADO' : 'DESATIVADO'}
              </button>
            </div>

            {/* Music Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>{musicEnabled ? '🎵' : '🎶'}</span> Música de Fundo
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleMusic();
                }}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border-2 shadow active:scale-95 transition-all cursor-pointer ${
                  musicEnabled
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-amber-950/80 text-amber-200 border-amber-700'
                }`}
              >
                {musicEnabled ? 'ATIVADA' : 'DESATIVADA'}
              </button>
            </div>

            {/* Graphics Style Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>🎨</span> Estilo Visual
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleGraphicsStyle();
                }}
                className="px-3 py-1.5 rounded-xl font-extrabold text-xs border-2 shadow active:scale-95 transition-all cursor-pointer bg-amber-600 hover:bg-amber-500 text-white border-amber-700"
              >
                {graphicsStyle === '3d_rendered' ? '✨ 3D REALISTA' : '📐 2D PLANO'}
              </button>
            </div>
          </div>

          {/* Farm Profile Settings */}
          <div className="bg-amber-100/60 border border-amber-200 p-4 rounded-2xl flex flex-col gap-3">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">
              Personalização da Fazenda
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-amber-950">Nome da Fazenda:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Nome da sua fazenda..."
                  className="flex-1 bg-white border-2 border-amber-300 rounded-xl px-3 py-2 text-sm font-bold text-amber-950 outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl border border-amber-700 active:scale-95 transition-transform cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>

          {/* Google Account Profile & Sign Out or Sign In */}
          {googleUser ? (
            <div className="bg-amber-100/60 border border-amber-200 p-4 rounded-2xl flex flex-col gap-3">
              <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">
                Conta Conectada
              </h3>
              <div className="flex items-center gap-3">
                {googleUser.imageUrl ? (
                  <img
                    src={googleUser.imageUrl}
                    alt="Google Profile"
                    className="w-12 h-12 rounded-full border-2 border-amber-400 shadow"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-xl">
                    👨‍🌾
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-amber-950 truncate">
                    {googleUser.name}
                  </div>
                  <div className="text-xs text-amber-800 truncate">
                    {googleUser.email}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  const confirmLogout = window.confirm("Tem certeza que deseja sair da sua conta?");
                  if (confirmLogout) {
                    onLogout();
                  }
                }}
                className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs py-2.5 rounded-xl border-2 border-red-400 shadow active:scale-95 transition-all cursor-pointer"
              >
                Sair da Conta (Logout)
              </button>
            </div>
          ) : (
            <div className="bg-amber-100/60 border border-amber-200 p-4 rounded-2xl flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">
                  Sincronização na Nuvem
                </h3>
                <p className="text-[11px] text-amber-800 font-bold leading-tight">
                  Conecte sua conta Google para sincronizar seu progresso na nuvem.
                </p>
              </div>
              {onGoogleLogin && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onGoogleLogin();
                  }}
                  className="w-full bg-white hover:bg-amber-50 text-amber-950 font-black text-xs px-3 py-2.5 rounded-xl border border-amber-300 shadow flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Conectar com Google</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

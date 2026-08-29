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
  graphicsStyle: '3d_rendered' | 'vector';
  onToggleGraphicsStyle: () => void;
  googleUser: { name?: string; email?: string; imageUrl?: string } | null;
  onLogout: () => void;
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
                {graphicsStyle === '3d_rendered' ? '✨ 3D REALISTA' : '📐 2D VETORIAL'}
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

          {/* Google Account Profile & Sign Out */}
          {googleUser && (
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
          )}
        </div>
      </div>
    </div>
  );
};

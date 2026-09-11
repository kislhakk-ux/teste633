import React, { useState } from 'react';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface AdmAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isAlreadyUnlocked: boolean;
  onLock: () => void;
}

export const AdmAuthModal: React.FC<AdmAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isAlreadyUnlocked,
  onLock,
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === '2412') {
      sound.playDing();
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
      setErrorMsg(null);
      setPassword('');
      onSuccess();
    } else {
      sound.playError();
      setErrorMsg('Senha incorreta! Dica: a senha de administrador é 2412.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#8B5A2B] via-[#6F441E] to-[#4A2D13] p-1.5 rounded-3xl shadow-2xl border-4 border-[#F5D061] text-amber-50 select-none overflow-hidden">
        {/* Banner Header */}
        <div className="relative bg-gradient-to-b from-amber-600 to-amber-800 text-center py-3.5 px-4 rounded-t-2xl border-b-2 border-amber-400 shadow-inner flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow">👑</span>
            <h2 className="font-black text-lg sm:text-xl text-yellow-200 tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Acesso Administrador (ADM)
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 border-2 border-white text-white font-black flex items-center justify-center active:scale-90 transition-transform shadow-md cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="bg-amber-950/70 p-4 rounded-2xl border border-amber-700/60 text-xs sm:text-sm text-amber-200 leading-relaxed shadow-inner">
            <p className="font-bold text-yellow-300 mb-1 flex items-center gap-1.5">
              <span>🛠️</span> Painel de Construção Livre & Sandbox:
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-100/90 text-xs">
              <li>Criar e colocar novos objetos, árvores e estruturas</li>
              <li>Mudar qualquer coisa de lugar livremente</li>
              <li>Expandir e estender o lago selecionando áreas</li>
              <li>Mudar formatos, tamanhos e terrenos à vontade</li>
            </ul>
          </div>

          {isAlreadyUnlocked ? (
            <div className="flex flex-col gap-3">
              <div className="bg-emerald-900/70 border border-emerald-400/60 p-3.5 rounded-2xl text-center text-emerald-200 text-sm font-black flex items-center justify-center gap-2 shadow-inner">
                <span>✅</span> O Modo Administrador já está desbloqueado!
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSuccess();
                  }}
                  className="bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-black py-3 px-4 rounded-2xl border-2 border-emerald-300 shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🚀</span> Abrir Ferramentas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onLock();
                  }}
                  className="bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-black py-3 px-4 rounded-2xl border-2 border-red-400 shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🔒</span> Bloquear ADM
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  Digite a Senha de ADM:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoFocus
                    placeholder="Digite a senha..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="w-full bg-amber-950/90 text-yellow-100 font-bold px-4 py-3 rounded-2xl border-2 border-amber-500 focus:border-yellow-400 focus:outline-none placeholder-amber-600/70 text-base shadow-inner text-center tracking-widest"
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-red-300 bg-red-950/80 p-2 rounded-xl border border-red-500 font-bold text-center mt-1 animate-in fade-in">
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-b from-yellow-400 via-amber-500 to-amber-700 hover:from-yellow-300 hover:to-amber-600 text-amber-950 font-black py-3.5 px-6 rounded-2xl border-2 border-yellow-200 shadow-2xl active:scale-95 transition-transform text-base uppercase tracking-wider flex items-center justify-center gap-2 drop-shadow-md cursor-pointer"
              >
                <span>🔓</span> Desbloquear Acesso ADM
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

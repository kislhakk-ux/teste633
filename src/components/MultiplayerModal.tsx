import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { OnlineFarm } from '../types/multiplayer';
import { sound } from '../utils/sound';
import { googleSignIn, googleSignOut } from '../utils/firebase';

interface MultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmId: string;
  farmName: string;
  avatar: string;
  level: number;
  onlineCount: number;
  onlineFarms: OnlineFarm[];
  onUpdateProfile: (name: string, avatar: string) => void;
  onVisitFarm: (farmId: string) => void;
}

const AVATAR_CHOICES = ['👨‍🌾', '👩‍🌾', '🤠', '🧔', '👩‍🍳', '🧑‍🌾', '👵', '👴', '👑', '🚜'];

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  isOpen,
  onClose,
  farmId,
  farmName,
  avatar,
  level,
  onlineCount,
  onlineFarms,
  onUpdateProfile,
  onVisitFarm,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>(farmName);
  const [editingAvatar, setEditingAvatar] = useState<string>(avatar);
  const [activeTab, setActiveTab] = useState<'apk' | 'connect' | 'neighbors'>('apk');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  // Google Login States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => localStorage.getItem('hayday_google_logged_in') === 'true');
  const [googleUser, setGoogleUser] = useState<{ uid?: string; name?: string; email?: string; imageUrl?: string } | null>(() => {
    const saved = localStorage.getItem('hayday_google_user_data');
    return saved ? JSON.parse(saved) : null;
  });

  const handleGoogleSignIn = async () => {
    sound.playClick();
    try {
      const firebaseUser = await googleSignIn();

      const uid = firebaseUser.uid;
      const name = firebaseUser.displayName || 'Fazendeiro do Google';
      const avatarUrl = firebaseUser.photoURL || '👨‍🌾';
      const email = firebaseUser.email || '';
      
      setEditingName(name);
      setEditingAvatar(avatarUrl);
      onUpdateProfile(name, avatarUrl);
      
      localStorage.setItem('hayday_google_logged_in', 'true');
      localStorage.setItem('hayday_google_user_data', JSON.stringify({
        uid,
        name,
        email,
        imageUrl: avatarUrl
      }));
      
      setGoogleUser({
        uid,
        name,
        email,
        imageUrl: avatarUrl
      });
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      alert(`Erro no login com o Google: ${err.message || JSON.stringify(err)}`);
    }
  };

  const handleGoogleSignOut = async () => {
    sound.playClick();
    try {
      await googleSignOut();
    } catch (e) {
      // ignore
    }
    const defaultName = 'Minha Fazenda';
    const defaultAvatar = '👨‍🌾';
    setEditingName(defaultName);
    setEditingAvatar(defaultAvatar);
    onUpdateProfile(defaultName, defaultAvatar);
    
    localStorage.removeItem('hayday_google_logged_in');
    localStorage.removeItem('hayday_google_user_data');
    setGoogleUser(null);
    setIsLoggedIn(false);

    // Force page reload to return to the block login screen
    window.location.reload();
  };

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    sound.playClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      alert('📲 Para instalar no Android: abra no Google Chrome pelo celular, clique no menu de 3 pontinhos (⋮) e selecione "Instalar aplicativo" ou "Adicionar à tela inicial"!');
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    if (isOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#451a03',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    sound.playClick();
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleSaveProfile = () => {
    sound.playDing();
    onUpdateProfile(editingName.trim() || 'Minha Fazenda', editingAvatar);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#f59e0b] border-4 border-amber-800 rounded-3xl p-5 sm:p-6 shadow-2xl max-w-xl w-full relative flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-700/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌐</span>
            <div>
              <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
                Conectar Aparelhos & Multiplayer
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span>Servidor Ativo</span>
                <span>•</span>
                <span className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  👥 {onlineCount} {onlineCount === 1 ? 'fazenda online' : 'fazendas online'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white font-black flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('apk');
            }}
            className={`flex-1 py-2 px-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-emerald-700 text-white border-white shadow-md'
                : 'bg-white/80 text-amber-950 border-amber-300 hover:bg-white'
            }`}
          >
            <span>📥</span> Baixar / Instalar App
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('connect');
            }}
            className={`flex-1 py-2 px-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'connect'
                ? 'bg-amber-800 text-white border-white shadow-md'
                : 'bg-white/80 text-amber-950 border-amber-300 hover:bg-white'
            }`}
          >
            <span>📱</span> Conectar Celular / QR
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('neighbors');
            }}
            className={`flex-1 py-2 px-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'neighbors'
                ? 'bg-amber-800 text-white border-white shadow-md'
                : 'bg-white/80 text-amber-950 border-amber-300 hover:bg-white'
            }`}
          >
            <span>👥</span> Vizinhos ({onlineFarms.length})
          </button>
        </div>

        {/* Content Tab 0: APK / Instalar App no Celular */}
        {activeTab === 'apk' && (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 max-h-[60vh]">
            {/* Main APK banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl p-4 text-white shadow-md border-2 border-emerald-400 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl p-1.5 flex items-center justify-center shadow-inner border border-white/40 shrink-0">
                <img
                  src="/icon.png"
                  alt="Hay Day Icon"
                  className="w-full h-full object-cover rounded-xl shadow"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    APK Nativo PWA • 100% Online
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Hay Day Farm Simulator (Android / iOS)
                </h3>
                <p className="text-xs text-emerald-100 mt-1 leading-snug">
                  Instale diretamente no seu celular como um app real com ícone próprio, tela cheia e sincronização multiplayer online contínua.
                </p>
              </div>
            </div>

            {/* Quick Install Button for Chrome/Android */}
            <div className="bg-white/95 rounded-2xl p-4 border-2 border-amber-300 shadow-sm flex flex-col items-center gap-3">
              <button
                onClick={handleInstallPWA}
                className="w-full max-w-md py-3.5 px-6 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-black text-sm sm:text-base shadow-lg border-2 border-white active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span className="text-xl">📲</span>
                <span>{isInstallable ? 'Instalar App no Celular Agora' : 'Baixar / Adicionar à Tela Inicial'}</span>
              </button>
              <p className="text-[11px] text-amber-800 text-center font-medium">
                Funciona em qualquer celular Android (Google Chrome) ou iPhone (Safari) sem precisar de Play Store!
              </p>
            </div>

            {/* Step by step guides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Android Tutorial */}
              <div className="bg-white/90 rounded-2xl p-3.5 border-2 border-amber-300 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 font-black text-xs text-emerald-800 border-b border-amber-200 pb-1.5">
                  <span className="text-base">🤖</span>
                  <span>No Celular Android (Chrome)</span>
                </div>
                <ol className="text-[11px] text-amber-950 flex flex-col gap-1.5 list-decimal list-inside leading-snug">
                  <li>Abra o link da fazenda no <strong>Google Chrome</strong>.</li>
                  <li>Toque nos <strong>3 pontinhos (⋮)</strong> no canto superior direito.</li>
                  <li>Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
                  <li>Pronto! O ícone do Hay Day ficará na sua lista de aplicativos e rodará em tela cheia com multiplayer!</li>
                </ol>
              </div>

              {/* iOS / iPhone Tutorial */}
              <div className="bg-white/90 rounded-2xl p-3.5 border-2 border-amber-300 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 font-black text-xs text-indigo-800 border-b border-amber-200 pb-1.5">
                  <span className="text-base">🍏</span>
                  <span>No iPhone / iPad (Safari)</span>
                </div>
                <ol className="text-[11px] text-amber-950 flex flex-col gap-1.5 list-decimal list-inside leading-snug">
                  <li>Abra o link da fazenda no navegador <strong>Safari</strong>.</li>
                  <li>Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima ⎋).</li>
                  <li>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</li>
                  <li>Toque em <strong>"Adicionar"</strong> no canto superior direito!</li>
                </ol>
              </div>
            </div>

            {/* Online Server Notice */}
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2.5">
              <span className="text-lg">🌐</span>
              <div className="leading-snug text-[11px]">
                <strong className="text-emerald-900 block font-bold mb-0.5">Multiplayer Online Totalmente Ativo:</strong>
                O app instalado no celular se conecta em tempo real com o servidor. Todas as vendas na banca, anúncios no jornal e visitas de amigos acontecem ao vivo entre seu PC e celular!
              </div>
            </div>
          </div>
        )}

        {/* Content Tab 1: Connect Devices */}
        {activeTab === 'connect' && (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Instruction banner */}
            <div className="bg-white/90 rounded-2xl p-3.5 border-2 border-amber-300 shadow-sm text-xs text-amber-950 flex flex-col gap-1.5">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <span>🚜</span>
                <span>Seu servidor está pronto e aceita múltiplos aparelhos!</span>
              </p>
              <p className="text-amber-800 leading-relaxed">
                Tudo o que você colocar à venda na sua <strong>Banca de Vendas</strong> com o selo <strong>"Anunciar no Jornal"</strong> aparecerá automaticamente no <strong>Jornal da Cidade</strong> de qualquer celular ou PC conectado!
              </p>
            </div>

            {/* QR Code & Link Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-white/80 rounded-2xl p-4 border-2 border-amber-300 shadow-inner">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center gap-2">
                {qrDataUrl ? (
                  <div className="p-2 bg-white rounded-2xl shadow-md border-2 border-amber-400">
                    <img
                      src={qrDataUrl}
                      alt="QR Code para conectar outro aparelho"
                      className="w-36 h-36 sm:w-44 sm:h-44 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-36 h-36 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-bold text-xs">
                    Gerando QR Code...
                  </div>
                )}
                <span className="text-[11px] font-black text-amber-900 text-center">
                  📷 Aponte a câmera do seu celular
                </span>
              </div>

              {/* URL & Copy Button */}
              <div className="flex flex-col justify-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black text-amber-950">
                    Link Direto para Enviar:
                  </label>
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-300 font-mono text-[11px] text-amber-900 break-all select-all shadow-inner">
                    {shareUrl}
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className={`w-full py-3 px-4 rounded-xl font-black text-sm shadow-md border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-200 active:scale-95'
                  }`}
                >
                  <span>{copied ? '✅' : '📋'}</span>
                  <span>{copied ? 'Link Copiado para Área de Transferência!' : 'Copiar Link da Fazenda'}</span>
                </button>

                <div className="bg-amber-100/90 p-2.5 rounded-xl border border-amber-400 text-[11px] text-amber-950 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <span>⚠️</span>
                    <span>Deu "Erro 403 / Forbidden" ao abrir no Celular?</span>
                  </div>
                  <p className="leading-snug text-amber-900 text-[10.5px]">
                    O link de teste interno (<code className="bg-white/70 px-1 py-0.5 rounded font-mono">ais-dev-...</code>) é privado e exige login com a sua conta Google no navegador do celular.
                  </p>
                  <p className="leading-snug text-amber-900 font-semibold text-[10.5px]">
                    👉 <strong>Solução para Celular / Amigos:</strong> Clique no botão <strong>"Share" (Compartilhar)</strong> no menu superior do Google AI Studio para gerar o link público de acesso livre!
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Customization */}
            <div className="bg-white/90 rounded-2xl p-4 border-2 border-amber-300 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <h3 className="font-black text-xs text-amber-950 uppercase tracking-wide">
                  Identidade da Sua Fazenda no Jornal
                </h3>
                {isLoggedIn ? (
                  <button
                    onClick={handleGoogleSignOut}
                    className="bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-[10px] px-2 py-1 rounded-lg border border-red-200 transition-all cursor-pointer"
                  >
                    Sair da Conta Google
                  </button>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    className="bg-white hover:bg-amber-50 text-amber-900 font-black text-[10px] px-2.5 py-1.5 rounded-lg border border-amber-300 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                    <span>Entrar com o Google</span>
                  </button>
                )}
              </div>

              {isLoggedIn && googleUser && (
                <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200 text-[10px] text-blue-950 flex items-center gap-2">
                  <span className="text-base">👤</span>
                  <div className="flex-1">
                    Conectado como <strong className="text-blue-900">{googleUser.email}</strong>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-3xl p-2 bg-amber-100 rounded-2xl border border-amber-300 flex items-center justify-center w-14 h-14 overflow-hidden">
                    {editingAvatar && editingAvatar.startsWith('http') ? (
                      <img src={editingAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      editingAvatar
                    )}
                  </span>
                  <div className="flex-1 sm:w-56">
                    <label className="text-[10px] font-bold text-amber-800">
                      Nome da Fazenda:
                    </label>
                    <input
                      type="text"
                      maxLength={24}
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-1.5 text-xs font-black text-amber-950 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-black text-xs px-4 py-2.5 rounded-xl border border-white shadow active:scale-95 transition-all cursor-pointer"
                >
                  Salvar Perfil
                </button>
              </div>

              {/* Avatar Picker */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 w-full">
                  Escolha seu Avatar:
                </span>
                {AVATAR_CHOICES.map((av) => (
                  <button
                    key={av}
                    onClick={() => {
                      setEditingAvatar(av);
                      onUpdateProfile(editingName, av);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                      editingAvatar === av
                        ? 'bg-amber-400 border-2 border-amber-800 scale-110 shadow'
                        : 'bg-amber-100 hover:bg-amber-200 border border-amber-300'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab 2: Neighbors Online */}
        {activeTab === 'neighbors' && (
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[55vh]">
            <p className="text-xs text-amber-900 font-bold">
              Fazendas conectadas ao servidor. Você pode visitar qualquer vizinho e ver a fazenda dele!
            </p>

            {onlineFarms.length === 0 ? (
              <div className="p-8 text-center bg-white/70 rounded-2xl border-2 border-dashed border-amber-300 text-amber-800">
                <span className="text-4xl block mb-2">🌾</span>
                <p className="font-black text-sm">Nenhum outro jogador conectado ainda.</p>
                <p className="text-xs mt-1 text-amber-700">
                  Abra o link em outro aparelho ou aba para entrar no mesmo mundo!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {onlineFarms.map((farm) => {
                  const isMe = farm.farmId === farmId;

                  return (
                    <div
                      key={farm.farmId}
                      className={`p-3 rounded-2xl border-2 shadow-xs flex items-center justify-between gap-3 ${
                        isMe
                          ? 'bg-amber-100/90 border-amber-500 ring-2 ring-amber-400/50'
                          : 'bg-white border-amber-300 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-amber-100 rounded-2xl border border-amber-300 flex items-center justify-center text-2xl relative shadow-inner overflow-hidden">
                          {farm.avatar && farm.avatar.startsWith('http') ? (
                            <img src={farm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            farm.avatar || '👨‍🌾'
                          )}
                          {farm.isOnline && (
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xs sm:text-sm text-amber-950">
                              {farm.farmName}
                            </h4>
                            {isMe && (
                              <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                Você
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
                            <span>⭐ Nível {farm.level}</span>
                            <span>•</span>
                            <span>🏪 {farm.offersCount || 0} produtos à venda</span>
                            {farm.likes > 0 && (
                              <>
                                <span>•</span>
                                <span>❤️ {farm.likes} curtidas</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {!isMe && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onVisitFarm(farm.farmId);
                            onClose();
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow border border-white active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>🚶</span>
                          <span>Visitar</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

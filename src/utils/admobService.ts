import {
  AdMob,
  RewardAdOptions,
  RewardAdPluginEvents,
  AdmobConsentStatus,
} from '@capacitor-community/admob';

export const ADMOB_CONFIG = {
  // Official Google AdMob & AdSense Publisher IDs
  publisherId: 'ca-pub-2377512488351478',
  appId: 'ca-app-pub-2377512488351478~9895529416',
  rewardedAdUnitId: 'ca-app-pub-2377512488351478/8190958508',
  webSlotId: '8190958508',

  // Official Google Mobile Ads Test Unit ID for development & testing
  testRewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917',

  // Use test ID in development / non-production builds to avoid AdMob policy violations
  useTestAds: false,

  rewardAmount: 5, // 5 Gems per rewarded ad completed
};

class AdMobService {
  private isInitialized: boolean = false;
  private isAdLoaded: boolean = false;
  private isLoadingAd: boolean = false;

  /**
   * Check if native Capacitor AdMob plugin is available
   */
  public isNative(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!(window as any).Capacitor?.isNativePlatform?.()
    );
  }

  /**
   * Initialize Google Mobile Ads SDK (Native) or verify AdSense (Web)
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    console.log('[AdMob/Init] Initializing Google Mobile Ads / AdSense SDK...');
    try {
      if (!this.isNative()) {
        console.log(
          '[AdMob/Init] Ambiente Web/Navegador detectado. Google AdSense / H5 Ads ativo para ca-pub-2377512488351478.'
        );
        this.isInitialized = true;
        return true;
      }

      await AdMob.initialize({
        initializeForTesting: ADMOB_CONFIG.useTestAds,
      });

      console.log('[AdMob/Init] Google Mobile Ads SDK inicializado com sucesso!');
      this.isInitialized = true;
      return true;
    } catch (err: any) {
      console.error('[AdMob/Init] Falha ao inicializar Google Mobile Ads SDK:', err);
      return false;
    }
  }

  /**
   * Load and Prepare a Rewarded Video Ad using Google Mobile Ads SDK
   */
  public async prepareRewardedAd(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isNative()) {
        // Na Web, o carregamento é gerido pelo AdSense / H5 Ads
        return { success: true };
      }

      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          error: 'Falha ao inicializar o Google AdMob.',
        };
      }

      const adId = ADMOB_CONFIG.useTestAds
        ? ADMOB_CONFIG.testRewardedAdUnitId
        : ADMOB_CONFIG.rewardedAdUnitId;

      console.log(`[AdMob/Prepare] Solicitando anúncio premiado AdUnit ID: ${adId} (useTestAds=${ADMOB_CONFIG.useTestAds})`);
      this.isLoadingAd = true;

      const options: RewardAdOptions = {
        adId,
        isTesting: ADMOB_CONFIG.useTestAds,
      };

      await AdMob.prepareRewardVideoAd(options);
      this.isAdLoaded = true;
      this.isLoadingAd = false;
      console.log('[AdMob/Load] Anúncio premiado carregado com sucesso dos servidores do Google!');
      return { success: true };
    } catch (err: any) {
      this.isLoadingAd = false;
      this.isAdLoaded = false;
      console.error('[AdMob/Load] Erro ao carregar anúncio premiado do Google AdMob:', err);
      return {
        success: false,
        error: err?.message || 'Falha ao carregar anúncio do Google AdMob. Verifique sua conexão.',
      };
    }
  }

  /**
   * Show the Rewarded Ad and await official reward callback from Google Mobile Ads SDK or Web AdSense
   * @param onReward Official callback fired only when user completes watching the full ad
   */
  public async showRewardedAd(
    onReward: (rewardAmount: number) => void
  ): Promise<{ success: boolean; rewarded: boolean; isWeb?: boolean; error?: string }> {
    console.log('[AdMob/Show] Iniciando exibição do anúncio premiado...');

    // 1. Tratamento para Ambiente Web (Google AdSense / H5 Games Ads)
    if (!this.isNative()) {
      console.log('[AdMob/Show] Ambiente Web detectado. Acionando anúncio Google AdSense / H5 Games Ads...');
      const win = typeof window !== 'undefined' ? (window as any) : null;

      // Tentativa 1: Google H5 Games adBreak (se disponível no navegador)
      if (win && typeof win.adBreak === 'function') {
        const h5Promise = new Promise<{ success: boolean; rewarded: boolean; isWeb?: boolean; error?: string }>((resolve) => {
          let rewarded = false;
          let handled = false;
          try {
            win.adBreak({
              type: 'reward',
              name: 'fazenda_reward_gems',
              beforeAd: () => {
                console.log('[AdSense/H5] Exibindo anúncio Google H5 Games...');
              },
              afterAd: () => {
                console.log('[AdSense/H5] Anúncio H5 finalizado.');
              },
              beforeReward: (showAdFn: () => void) => {
                showAdFn();
              },
              adViewed: () => {
                console.log('[AdSense/H5] Recompensa concedida via Google H5 Games!');
                rewarded = true;
                handled = true;
                onReward(ADMOB_CONFIG.rewardAmount);
                resolve({ success: true, rewarded: true });
              },
              adDismissed: () => {
                handled = true;
                if (rewarded) {
                  resolve({ success: true, rewarded: true });
                } else {
                  resolve({
                    success: true,
                    rewarded: false,
                    error: 'Você fechou o anúncio antes de concluir. Assista até o final.',
                  });
                }
              },
            });

            // Se adBreak não responder em 3s, delegar para o Web AdSense Player
            setTimeout(() => {
              if (!handled) {
                resolve({ success: true, rewarded: false, isWeb: true });
              }
            }, 3000);
          } catch (e: any) {
            resolve({ success: true, rewarded: false, isWeb: true });
          }
        });

        const h5Result = await h5Promise;
        if (h5Result.rewarded) {
          return h5Result;
        }
        if (h5Result.error && !h5Result.isWeb) {
          return h5Result;
        }
      }

      // Tentativa 2: Abre o player de anúncio AdSense interativo no navegador
      return { success: true, rewarded: false, isWeb: true };
    }

    // 2. Tratamento Nativo para Android / iOS (APK via Capacitor)
    try {
      const prepRes = await this.prepareRewardedAd();
      if (!prepRes.success) {
        return { success: false, rewarded: false, error: prepRes.error };
      }

      return new Promise((resolve) => {
        let userRewarded = false;

        // 1. Escutar evento oficial de recompensa do Google AdMob
        const rewardSub = AdMob.addListener(
          RewardAdPluginEvents.Rewarded,
          (reward: any) => {
            console.log('[AdMob/Reward] Callback oficial de recompensa recebido do Google AdMob:', reward);
            userRewarded = true;
            onReward(ADMOB_CONFIG.rewardAmount);
          }
        );

        // 2. Escutar evento de fechamento do anúncio
        const dismissSub = AdMob.addListener(
          RewardAdPluginEvents.Dismissed,
          async () => {
            console.log('[AdMob/Dismiss] Anúncio fechado pelo usuário.');
            this.isAdLoaded = false;
            (await rewardSub).remove();
            (await dismissSub).remove();

            if (userRewarded) {
              console.log(`[AdMob/Reward] Recompensa de +${ADMOB_CONFIG.rewardAmount} diamantes validada e concedida com sucesso!`);
              resolve({ success: true, rewarded: true });
            } else {
              console.warn('[AdMob/Dismiss] Usuário fechou o anúncio antes de concluir. Nenhuma recompensa concedida.');
              resolve({
                success: true,
                rewarded: false,
                error: 'Você fechou o anúncio antes de concluir. Assista até o final para receber a recompensa.',
              });
            }
          }
        );

        // 3. Escutar falha na exibição
        const failSub = AdMob.addListener(
          RewardAdPluginEvents.FailedToShow,
          async (error: any) => {
            console.error('[AdMob/Show] Falha ao exibir anúncio:', error);
            this.isAdLoaded = false;
            (await rewardSub).remove();
            (await dismissSub).remove();
            (await failSub).remove();
            resolve({
              success: false,
              rewarded: false,
              error: 'Falha ao exibir o anúncio do Google AdMob. Tente novamente.',
            });
          }
        );

        // 4. Apresentar o anúncio em tela cheia
        AdMob.showRewardVideoAd().catch(async (showErr: any) => {
          console.error('[AdMob/Show] Erro na chamada showRewardVideoAd:', showErr);
          (await rewardSub).remove();
          (await dismissSub).remove();
          resolve({
            success: false,
            rewarded: false,
            error: showErr?.message || 'Erro ao abrir anúncio.',
          });
        });
      });
    } catch (err: any) {
      console.error('[AdMob/Show] Erro inesperado ao exibir anúncio premiado:', err);
      return {
        success: false,
        rewarded: false,
        error: err?.message || 'Erro ao carregar o anúncio premiado.',
      };
    }
  }
}

export const admobService = new AdMobService();

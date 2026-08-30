/**
 * Google AdMob Integration Service
 * Configured with App ID and Rewarded Ad Unit ID for Free Gems
 */

export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-2377512488351478~9895529416',
  rewardedAdUnitId: 'ca-app-pub-2377512488351478/8190958508',
  rewardAmount: 5, // 5 Gems per rewarded ad watched
};

class AdMobService {
  private isInitialized: boolean = false;

  public async initialize() {
    if (this.isInitialized) return;

    try {
      // Check if running in native Capacitor environment with AdMob plugin
      const AdMob = (window as any).Capacitor?.Plugins?.AdMob;
      if (AdMob) {
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          initializeForTesting: false,
        });
        console.log('[AdMob] Initialized successfully with App ID:', ADMOB_CONFIG.appId);
        this.isInitialized = true;
      }
    } catch (err) {
      console.warn('[AdMob] Native initialization skipped or failed:', err);
    }
  }

  /**
   * Request and present a Rewarded Video Ad
   * @param onReward Callback fired when user earns the reward
   * @returns true if native ad was shown, false if web fallback simulation should be displayed
   */
  public async showRewardedAd(
    onReward: (rewardAmount: number) => void,
    onError?: (err: any) => void
  ): Promise<boolean> {
    try {
      const AdMob = (window as any).Capacitor?.Plugins?.AdMob;

      if (AdMob) {
        await this.initialize();

        console.log('[AdMob] Preparing Rewarded Ad with Unit ID:', ADMOB_CONFIG.rewardedAdUnitId);

        // Prepare Rewarded Video
        await AdMob.prepareRewardVideoAd({
          adId: ADMOB_CONFIG.rewardedAdUnitId,
          isTesting: false,
        });

        // Set up reward listener
        let rewarded = false;
        const rewardListener = await AdMob.addListener('onRewarded', (reward: any) => {
          console.log('[AdMob] User earned reward:', reward);
          rewarded = true;
          onReward(ADMOB_CONFIG.rewardAmount);
        });

        const dismissListener = await AdMob.addListener('onRewardVideoDismiss', () => {
          console.log('[AdMob] Ad closed by user.');
          rewardListener.remove();
          dismissListener.remove();
          if (!rewarded) {
            console.log('[AdMob] User closed before completing ad.');
          }
        });

        // Show ad
        await AdMob.showRewardVideoAd();
        return true;
      }
    } catch (err) {
      console.warn('[AdMob] Native show failed, fallback to in-game cinema player:', err);
      if (onError) onError(err);
    }

    return false;
  }
}

export const admobService = new AdMobService();

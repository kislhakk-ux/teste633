import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBUdH7wEtis4LzVII69oXK0uSFQfu80EpM",
  authDomain: "fazenda-5eaec.firebaseapp.com",
  projectId: "fazenda-5eaec",
  storageBucket: "fazenda-5eaec.firebasestorage.app",
  messagingSenderId: "1091471592373",
  appId: "1:1091471592373:android:c651a8970661fe1109e7fc"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * Detects if the app is running inside Capacitor (native Android/iOS).
 * On a plain web browser, window.Capacitor is undefined.
 */
const isNative = (): boolean => {
  return !!(window as any).Capacitor?.isNativePlatform?.();
};

/**
 * Unified Google Sign-In:
 * - Native (Android/iOS via Capacitor): uses @codetrix-studio/capacitor-google-auth
 * - Web browser: uses Firebase signInWithPopup (no plugin needed)
 *
 * Returns a Firebase User object.
 */
export const googleSignIn = async () => {
  if (isNative()) {
    // Native path — dynamically import to avoid issues in web context
    const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
    const user = await GoogleAuth.signIn();
    if (!user?.authentication?.idToken) {
      throw new Error('Não foi possível obter as credenciais do Google (nativo).');
    }
    const credential = GoogleAuthProvider.credential(user.authentication.idToken);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } else {
    // Web path — Firebase popup, works in any browser
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }
};

/**
 * Signs out from Firebase (and Capacitor GoogleAuth if on native).
 */
export const googleSignOut = async () => {
  await auth.signOut();
  if (isNative()) {
    try {
      const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
      await GoogleAuth.signOut();
    } catch (_) {
      // ignore
    }
  }
};

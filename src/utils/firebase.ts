import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { GameState } from '../types/game';
import { getInitialGameState } from './storage';

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
export const db = getFirestore(app);
export { onAuthStateChanged };
export type { User };

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

/**
 * Loads the farm progress from Firestore for the given UID.
 * Returns null if no document exists (new user).
 */
export const loadFarmFromFirestore = async (uid: string): Promise<GameState | null> => {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data() as Partial<GameState>;
    const initial = getInitialGameState();

    // Merge with initial state to ensure all fields exist
    const merged: GameState = {
      ...initial,
      ...data,
      inventory: { ...initial.inventory, ...(data.inventory || {}) },
      stats: { ...initial.stats, ...(data.stats || {}) },
    };

    // Ensure entities have proper arrays (same guard as loadGameState in storage.ts)
    if (Array.isArray(merged.entities) && merged.entities.length > 0) {
      merged.entities = merged.entities.map((e: any) => {
        if (!e) return e;
        if (e.type === 'building' && e.buildingData) {
          e.buildingData.queue = Array.isArray(e.buildingData.queue) ? e.buildingData.queue : [];
          e.buildingData.completedItems = Array.isArray(e.buildingData.completedItems)
            ? e.buildingData.completedItems
            : [];
          e.buildingData.totalCrafted = e.buildingData.totalCrafted || 0;
        }
        return e;
      });
    } else {
      merged.entities = initial.entities;
    }

    // Ensure orders array
    if (!Array.isArray(merged.orders) || merged.orders.length === 0) {
      merged.orders = initial.orders;
    } else {
      merged.orders = merged.orders.map((ord: any) => {
        if (!ord) return ord;
        if (!Array.isArray(ord.items)) ord.items = [{ itemId: 'wheat', count: 3 }];
        if (!ord.state) ord.state = 'available';
        return ord;
      });
    }

    // Ensure roadsideBoxes
    if (!Array.isArray(merged.roadsideBoxes) || merged.roadsideBoxes.length === 0) {
      merged.roadsideBoxes = initial.roadsideBoxes;
    }

    // Always use 3d_rendered graphics style
    merged.graphicsStyle = '3d_rendered';

    return merged;
  } catch (e) {
    console.error('[Firestore] Error loading farm:', e);
    return null;
  }
};

/**
 * Saves the farm progress to Firestore under users/{uid}.
 * Uses merge: true so partial updates don't wipe other fields.
 */
export const saveFarmToFirestore = async (uid: string, state: GameState): Promise<void> => {
  try {
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { ...state, savedAt: Date.now() }, { merge: true });
  } catch (e) {
    console.error('[Firestore] Error saving farm:', e);
  }
};

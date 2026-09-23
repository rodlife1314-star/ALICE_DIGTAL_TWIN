import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import rawFirebaseConfig from '../../firebase-applet-config.json';
import { DigitalTwin } from '../types';

// Single initialization with strict config
const app = getApps().length > 0 ? getApps()[0] : initializeApp(rawFirebaseConfig);

/* CRITICAL: The app will break without this line */
export const db = getFirestore(app, rawFirebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Global guard for Firebase Auth internal popup assertion and user cancellations
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason?.message || event.reason || '');
    const codeStr = String(event.reason?.code || '');
    if (
      reasonStr.includes('Pending promise was never set') ||
      reasonStr.includes('popup-closed-by-user') ||
      reasonStr.includes('cancelled-popup-request') ||
      codeStr.includes('popup-closed-by-user') ||
      codeStr.includes('cancelled-popup-request')
    ) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const errorStr = String(event.error?.message || event.message || '');
    if (
      errorStr.includes('Pending promise was never set') ||
      errorStr.includes('popup-closed-by-user')
    ) {
      event.preventDefault();
    }
  });
}

let isSignInInProgress = false;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[FIREBASE] Connection verified successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Authentication Helpers
export async function loginWithGoogle(): Promise<User | null> {
  if (isSignInInProgress) {
    console.log('[FIREBASE AUTH] Sign-in already in progress, ignoring duplicate request.');
    return null;
  }

  isSignInInProgress = true;
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    const code = error?.code || '';
    const message = error?.message || '';

    // Handle normal user cancellation gracefully
    if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      message.includes('popup-closed-by-user') ||
      message.includes('Pending promise was never set')
    ) {
      console.log('[FIREBASE AUTH] Sign-in popup closed by user.');
      return null;
    }

    if (code === 'auth/popup-blocked') {
      console.warn('[FIREBASE AUTH] Sign-in popup was blocked by browser. Please allow popups.');
      return null;
    }

    console.warn('[FIREBASE AUTH] Non-fatal sign-in notice:', message || code);
    return null;
  } finally {
    // Reset guard after short delay to debounce rapid clicks
    setTimeout(() => {
      isSignInInProgress = false;
    }, 400);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    throw error;
  }
}

// Firestore Twin Operations with explicit error handling
export async function saveTwinToFirestore(twin: DigitalTwin): Promise<void> {
  const path = `twins/${twin.id}`;
  try {
    const cleanTwin = JSON.parse(JSON.stringify(twin));
    await setDoc(doc(db, 'twins', twin.id), cleanTwin);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTwinFromFirestore(twinId: string): Promise<void> {
  const path = `twins/${twinId}`;
  try {
    await deleteDoc(doc(db, 'twins', twinId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchTwinsFromFirestore(): Promise<DigitalTwin[]> {
  const path = 'twins';
  try {
    const snap = await getDocs(collection(db, path));
    const twins: DigitalTwin[] = [];
    snap.forEach((d) => {
      twins.push(d.data() as DigitalTwin);
    });
    return twins;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export function subscribeToTwins(
  onUpdate: (twins: DigitalTwin[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'twins';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const twins: DigitalTwin[] = [];
      snapshot.forEach((d) => {
        twins.push(d.data() as DigitalTwin);
      });
      onUpdate(twins);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      if (onError) onError(error);
    }
  );
}


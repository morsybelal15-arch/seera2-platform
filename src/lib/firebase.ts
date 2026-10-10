import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const explicitFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey || "AIzaSyDoWZB8lrwU4cuQEZyWiANhBKS8I_F4ORY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || "third-jigsaw-0smzh.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId || "third-jigsaw-0smzh",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || "third-jigsaw-0smzh.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || "480264026494",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId || "1:480264026494:web:05601e9fc4eef6efc65b2f",
};

export const isFirebaseConfigured = Boolean(
  explicitFirebaseConfig.apiKey &&
  explicitFirebaseConfig.projectId
);

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(explicitFirebaseConfig);
    authInstance = getAuth(appInstance);
    // Initialize Firestore with specific database ID if available
    firestoreInstance = getFirestore(appInstance, (firebaseConfig as any).firestoreDatabaseId || undefined);
    googleProviderInstance = new GoogleAuthProvider();
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
    appInstance = null;
    authInstance = null;
    firestoreInstance = null;
    googleProviderInstance = null;
  }
}

export const app = appInstance as FirebaseApp;
export const auth = authInstance as Auth;
export const firestoreDb = firestoreInstance;
export const googleProvider = googleProviderInstance as GoogleAuthProvider;

export { signInWithPopup, signOut };


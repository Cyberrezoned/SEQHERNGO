import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// WARNING: This file initializes the Firebase client SDK and runs in the
// browser. Never place service account credentials, admin secrets, or any
// server-only keys here. For privileged server-side operations (user role
// management, Firestore admin writes, secret rotation), use the Firebase
// Admin SDK on server-only code (API routes, server functions) where
// environment variables are not exposed to the client bundle.
// Example (server-only):
// import { initializeApp, cert } from 'firebase-admin/app'
// initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) })

// Initialize Firebase app only once. Many Firebase client SDK functions
// (notably auth) expect to run in a browser environment. When Next.js does
// server-side rendering (or builds pages), calling `getAuth()` here can
// trigger runtime checks and throw if client env vars (apiKey) are missing or
// invalid. To avoid that, only initialize client-only services when running
// in the browser.

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Client-only SDK instances. These remain `null` on the server to prevent
// SSR-time initialization errors. Use the Firebase Admin SDK in server-only
// code (API routes) for privileged operations.
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let functions: ReturnType<typeof getFunctions> | null = null;

if (typeof window !== 'undefined') {
    // We're in the browser — initialize client SDKs.
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);

    // Connect to emulators in development (client side)
    if (process.env.NODE_ENV === 'development') {
        try {
            connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, '127.0.0.1', 8080);
            connectFunctionsEmulator(functions, '127.0.0.1', 5001);
        } catch (error) {
            console.error("Error connecting to Firebase emulators. Is `firebase emulators:start` running?", error);
        }
    }
}

export { app, auth, db, functions };

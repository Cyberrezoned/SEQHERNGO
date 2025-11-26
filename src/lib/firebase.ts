import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Detect whether Firebase client config is present. When building/running
// without Firebase, these will be unset and we should avoid initializing
// the SDK to prevent runtime errors or exposing admin credentials.
// Require the API key as well — initializing without it will cause the
// client SDK to throw an auth/invalid-api-key error.
const hasFirebaseClientConfig = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
);

// WARNING: This file initializes the Firebase client SDK and runs in the
// browser. Never place service account credentials, admin secrets, or any
// server-only keys here. For privileged server-side operations (user role
// management, Firestore admin writes, secret rotation), use the Firebase
// Admin SDK on server-only code (API routes, server functions) where
// environment variables are not exposed to the client bundle.
// Example (server-only):
// import { initializeApp, cert } from 'firebase-admin/app'
// initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) })

// Initialize Firebase only when a client config exists and we're in the
// browser. Otherwise export nulls so the rest of the app can run without
// Firebase.
let app: FirebaseApp | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let functions: ReturnType<typeof getFunctions> | null = null;

if (hasFirebaseClientConfig && typeof window !== 'undefined') {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    } catch (err) {
        // If initialization fails (for example invalid api key), log and skip
        // Firebase initialization so the app can continue running without it.
        // eslint-disable-next-line no-console
        console.error('Failed to initialize Firebase app (skipping).', err);
        app = null;
    }

    if (app) {
        // Client-only SDK instances. Wrap each in try/catch so a single failing
        // service (invalid config for auth, for example) doesn't break the app.
        try {
            auth = getAuth(app);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize Firebase Auth (skipping).', e);
            auth = null;
        }

        try {
            db = getFirestore(app);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize Firestore (skipping).', e);
            db = null;
        }

        try {
            functions = getFunctions(app);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize Functions (skipping).', e);
            functions = null;
        }

        // Connect to emulators in development (client side)
        if (process.env.NODE_ENV === 'development') {
            try {
                if (auth) connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
                if (db) connectFirestoreEmulator(db, '127.0.0.1', 8080);
                if (functions) connectFunctionsEmulator(functions, '127.0.0.1', 5001);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error connecting to Firebase emulators. Is `firebase emulators:start` running?", error);
            }
        }
    }
} else if (!hasFirebaseClientConfig) {
    // Helpful message during development — don't throw, just act as a no-op.
    if (process.env.NODE_ENV === 'development') {
        // Use console.debug to avoid noisy logs in production.
        // eslint-disable-next-line no-console
        console.debug('Firebase client config not found. Firebase client SDK will not be initialized.');
    }
}

export { app, auth, db, functions };

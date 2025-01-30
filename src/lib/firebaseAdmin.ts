import admin from "firebase-admin";

// ✅ Vérifie si Firebase Admin est déjà initialisé
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)),
    });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
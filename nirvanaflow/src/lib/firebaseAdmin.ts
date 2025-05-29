import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
  });
}

export const verifyFirebaseToken = async (token: string) => {
  return admin.auth().verifyIdToken(token); // returns { uid, email, ... }
};

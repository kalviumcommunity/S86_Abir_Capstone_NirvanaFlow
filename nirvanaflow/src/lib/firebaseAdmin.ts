import admin from 'firebase-admin'




if (!admin.apps.length) {
  console.log('Initializing Firebase Admin...');
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

// Debug: Log environment variables (be careful in production!)
console.log('Environment variables check:');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('Private Key exists:', !!process.env.FIREBASE_PRIVATE_KEY);
console.log('Private Key length:', process.env.FIREBASE_PRIVATE_KEY?.length);

export const verifyFirebaseToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // returns { uid, email, ... }
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
};

// Optional: Export admin instance for other uses
export { admin };
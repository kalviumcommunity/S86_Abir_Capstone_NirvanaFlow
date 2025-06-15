import { cookies } from 'next/headers';
import { verifyFirebaseToken } from './firebaseAdmin';

export async function verifyUserFromFirebase(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('firebaseToken')?.value;
    // console.log(token)
    
    if (!token) {
      throw new Error('No Firebase token found in cookies');
    }
    
    const decodedToken = await verifyFirebaseToken(token);
    
    if (!decodedToken.uid) {
      throw new Error('Invalid token: no user ID found');
    }
    
    return decodedToken.uid;
  } catch (error) {
    console.error('Firebase verification failed:', error);
    throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
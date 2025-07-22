import { NextRequest, NextResponse } from 'next/server';
import { oauth2Client, SCOPES } from '@/lib/google';
import { verifyUserFromFirebase } from '@/lib/firebase-verify';

export async function GET(req: NextRequest) {
  try {
    const uid = await verifyUserFromFirebase(req);
    
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
      state: uid, 
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
}
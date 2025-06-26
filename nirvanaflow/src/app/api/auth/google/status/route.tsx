import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/Users';
import { verifyUserFromFirebase } from '@/lib/firebase-verify';

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const uid = await verifyUserFromFirebase(req);
    const user = await User.findOne({ uid });

    const isConnected = !!(user?.googleAccessToken && user?.googleRefreshToken);

    return NextResponse.json({ connected: isConnected });
  } catch (err) {
    console.error("Google status check failed", err);
    return NextResponse.json({ connected: false }, { status: 200 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { oauth2Client } from "@/lib/google";
import User from "@/models/Users";
import connectDb from "@/lib/db";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const firebaseToken = req.cookies.get("firebaseToken")?.value;

  if (!code || !firebaseToken) {
    return NextResponse.json(
      { error: "token aur code is not provided" },
      { status: 400 }
    );
  }

  const { uid } = await verifyFirebaseToken(firebaseToken);
  await connectDb();

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  await User.findOneAndUpdate(
    { uid },
    {
      googleAccessToken: tokens.access_token,
      googleRefreshToken: tokens.refresh_token,
    },
    { upsert: true, new: true }
  );

  return NextResponse.redirect(new URL("/dashboard", req.url));
}

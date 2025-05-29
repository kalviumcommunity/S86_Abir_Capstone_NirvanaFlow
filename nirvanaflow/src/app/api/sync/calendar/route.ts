import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { getUserTokens } from "@/lib/google-auth-utils";
import { verifyFirebaseToken } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const firebaseToken: string | undefined  = req.cookies.get("firebaseToken")?.value;
    if(!firebaseToken){
        return NextResponse.json({message:'token is not provided '})
    }
    const { uid } = await verifyFirebaseToken(firebaseToken);
    const tokens = await getUserTokens(uid);

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);

    const calendar = google.calendar({version:'v3',auth:oAuth2Client})

    const now :string = new Date().toISOString();
    const {data}=await calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      maxResults: 3,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = data.items?.map(event => ({
      id: event.id,
      title: event.summary,
      description: event.description || '',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
    })) || [];

    return NextResponse.json({events})


  } catch (error) {
    console.error("Calendar fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

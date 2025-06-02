import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getUserTokens } from "@/lib/google-auth-utils";
import { verifyUserFromFirebase } from "@/lib/firebase-verify";

export async function GET() {
  try {
    // Verify user authentication
    const uid = await verifyUserFromFirebase();
    
    // Get user's Google OAuth tokens
    const tokens = await getUserTokens(uid);
    
    // Set up Google OAuth2 client
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);
    
    // Initialize Calendar API
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
    
    // Fetch calendar events for today only
    const { data } = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay,
      timeMax: endOfDay,
      maxResults: 3,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    // Transform top 3 events for today
    const events = data.items?.map(event => ({
      id: event.id,
      title: event.summary || 'No Title',
      description: event.description || '',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
    })) || [];
    
    return NextResponse.json({ 
      events,
      date: today.toDateString(),
      total: events.length
    });
    
  } catch (error) {
    console.error("Calendar fetch failed:", error);
    
    
    if (error instanceof Error) {
      
      if (error.message.includes('Firebase token')) {
        return NextResponse.json(
          { error: "Authentication failed" },
          { status: 401 }
        );
      }
      
      // Google API errors
      if (error.message.includes('insufficient authentication scopes')) {
        return NextResponse.json(
          { error: "Insufficient calendar permissions" },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}
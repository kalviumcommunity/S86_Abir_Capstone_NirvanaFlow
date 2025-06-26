import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { getUserTokens } from "@/lib/google-auth-utils";
import { verifyUserFromFirebase } from "@/lib/firebase-verify";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
}

interface CalendarResponse {
  events: CalendarEvent[];
  date: string;
  total: number;
}

interface ErrorResponse {
  error: string;
  details?: string;
  requiredScopes?: string[];
}

export async function GET(req: NextRequest): Promise<NextResponse<CalendarResponse | ErrorResponse>> {
  try {
    console.log("Starting Calendar sync...");
    
    // Verify user authentication
    const uid = await verifyUserFromFirebase(req);
    console.log("User verified:", uid);
    
    // Get user's Google OAuth tokens
    const tokens = await getUserTokens(uid);
    console.log("Tokens retrieved:", { 
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      tokenType: tokens.token_type,
      expiry: tokens.expiry_date
    });
    
    // Set up Google OAuth2 client with proper configuration
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    // Set credentials
    oAuth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date
    });
    
    console.log("OAuth2 client configured");
    
    // Initialize Calendar API
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    
    // Test API access first
    try {
      const calendarList = await calendar.calendarList.list({ maxResults: 1 });
      console.log("Calendar API access successful, calendars found:", calendarList.data.items?.length || 0);
    } catch (testError) {
      console.error("Failed to access Calendar API:", testError);
      throw new Error("Calendar API access failed - check permissions");
    }
    
    const today = new Date();
    
    // Create more robust date ranges
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const timeMin = startOfDay.toISOString();
    const timeMax = endOfDay.toISOString();
    
    console.log("Fetching events for:", {
      timeMin,
      timeMax,
      date: today.toDateString()
    });
    
    // Fetch calendar events for today only with error handling
    let eventsData;
    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      eventsData = response.data;
      console.log("Events fetched successfully:", eventsData.items?.length || 0);
    } catch (eventsError: any) {
      console.error("Failed to fetch events:", eventsError);
      
      // Try without time constraints as fallback
      try {
        console.log("Trying fallback query without time constraints...");
        const fallbackResponse = await calendar.events.list({
          calendarId: 'primary',
          maxResults: 5,
          singleEvents: true,
          orderBy: 'startTime',
        });
        eventsData = fallbackResponse.data;
        console.log("Fallback events fetched:", eventsData.items?.length || 0);
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        throw eventsError; // Throw original error
      }
    }
    
    // Transform events with better error handling
    const events: CalendarEvent[] = [];
    
    if (eventsData.items && eventsData.items.length > 0) {
      for (const event of eventsData.items) {
        try {
          // More robust event transformation
          const transformedEvent: CalendarEvent = {
            id: event.id || 'unknown',
            title: event.summary || 'No Title',
            description: event.description || '',
            start: event.start?.dateTime || event.start?.date || '',
            end: event.end?.dateTime || event.end?.date || '',
          };
          
          // Filter for today's events if we got broader results
          if (transformedEvent.start) {
            const eventDate = new Date(transformedEvent.start);
            const eventDay = eventDate.toDateString();
            const todayString = today.toDateString();
            
            if (eventDay === todayString) {
              events.push(transformedEvent);
            }
          } else {
            // Include events without dates (all-day events, etc.)
            events.push(transformedEvent);
          }
        } catch (transformError) {
          console.error("Failed to transform event:", event.id, transformError);
          // Continue with other events
        }
      }
    }
    
    // Limit to top 3 events
    const limitedEvents = events
    
    console.log("Final events to return:", limitedEvents.length);
    
    return NextResponse.json<CalendarResponse>({ 
      events: limitedEvents,
      date: today.toDateString(),
      total: limitedEvents.length
    });
    
  } catch (error: unknown) {
    console.error("Calendar fetch failed:", error);
    
    if (error instanceof Error) {
      // Log full error details for debugging
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Firebase authentication errors
      if (error.message.includes('Firebase token') || error.message.includes('Authentication failed')) {
        return NextResponse.json<ErrorResponse>(
          { 
            error: "Authentication failed",
            details: error.message
          },
          { status: 401 }
        );
      }
      
      // Google API errors
      if (error.message.includes('insufficient authentication scopes') || 
          error.message.includes('The request does not have valid authentication credentials')) {
        return NextResponse.json<ErrorResponse>(
          { 
            error: "Insufficient calendar permissions",
            requiredScopes: [
              "https://www.googleapis.com/auth/calendar.readonly",
              "https://www.googleapis.com/auth/calendar.events.readonly"
            ],
            details: error.message
          },
          { status: 403 }
        );
      }
      
      // Token refresh errors
      if (error.message.includes('invalid_grant') || error.message.includes('Token has been expired')) {
        return NextResponse.json<ErrorResponse>(
          { 
            error: "OAuth token expired - please re-authenticate",
            details: error.message
          },
          { status: 401 }
        );
      }
      
      // Rate limit errors
      if (error.message.includes('quota exceeded') || error.message.includes('rate limit')) {
        return NextResponse.json<ErrorResponse>(
          { 
            error: "Rate limit exceeded - please try again later",
            details: error.message
          },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json<ErrorResponse>(
      { 
        error: "Failed to fetch calendar events",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
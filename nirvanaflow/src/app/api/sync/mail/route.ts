import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { getUserTokens } from "@/lib/google-auth-utils";
import { verifyUserFromFirebase } from "@/lib/firebase-verify";

// Type definitions
interface EmailHeader {
  name: string;
  value: string;
}

interface EmailPayload {
  headers: EmailHeader[];
  body?: {
    data?: string;
  };
  parts?: EmailPayload[];
  mimeType?: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet: string;
  payload: EmailPayload;
  internalDate: string;
}

interface TransformedEmail {
  id: string;
  subject: string;
  from: string;
  importanceScore: number;
  isUnread: boolean;
}

interface EmailWithScore {
  email: GmailMessage;
  score: number;
}

interface ApiResponse {
  mostImportantEmail: TransformedEmail | null;
  totalEmails: number;
  lastUpdated: string;
  nextUpdate?: string;
  importanceThreshold?: number;
  topScores?: Array<{
    subject: string;
    score: number;
    from: string;
  }>;
  message?: string;
}

interface ErrorResponse {
  error: string;
  lastUpdated?: string;
  requiredScopes?: string[];
  retryAfter?: string;
  details?: any;
}

// Email importance scoring algorithm
function calculateEmailImportance(email: GmailMessage): number {
  let score: number = 0;
  
  // Time-based scoring (newer emails get higher scores)
  const emailDate: Date = new Date(parseInt(email.internalDate));
  const now: Date = new Date();
  const hoursSinceReceived: number = (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60);
  
  // Recent emails (last 24 hours) get bonus points
  if (hoursSinceReceived <= 24) {
    score += 50 - (hoursSinceReceived * 2); // Max 50, decreases over time
  }
  
  // Sender importance
  const fromHeader: string = email.payload.headers.find((h: EmailHeader) => h.name === 'From')?.value || '';
  const senderEmail: string = fromHeader.toLowerCase();
  
  // VIP senders (customize this list based on user preferences)
  const vipDomains: string[] = ['company.com', 'important-client.com', 'bank.com'];
  const vipKeywords: string[] = ['ceo', 'manager', 'director', 'urgent', 'important'];
  
  if (vipDomains.some((domain: string) => senderEmail.includes(domain))) {
    score += 30;
  }
  
  if (vipKeywords.some((keyword: string) => senderEmail.includes(keyword))) {
    score += 20;
  }
  
  // Subject line importance
  const subject: string = email.payload.headers.find((h: EmailHeader) => h.name === 'Subject')?.value || '';
  const subjectLower: string = subject.toLowerCase();
  
  const urgentKeywords: string[] = ['urgent', 'asap', 'immediate', 'emergency', 'deadline'];
  const importantKeywords: string[] = ['important', 'priority', 'action required', 'response needed'];
  
  urgentKeywords.forEach((keyword: string) => {
    if (subjectLower.includes(keyword)) score += 25;
  });
  
  importantKeywords.forEach((keyword: string) => {
    if (subjectLower.includes(keyword)) score += 15;
  });
  
  // Unread emails get priority
  if (email.labelIds?.includes('UNREAD')) {
    score += 10; // Fixed: UNREAD emails should get bonus, not penalty
  }
  
  // Starred emails get bonus
  if (email.labelIds?.includes('STARRED')) {
    score += 20;
  }
  
  // Spam/promotions get penalty
  if (email.labelIds?.includes('SPAM') || email.labelIds?.includes('CATEGORY_PROMOTIONS')) {
    score -= 50;
  }
  
  return Math.max(0, score); // Ensure score is never negative
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse | ErrorResponse>> {
  try {
    console.log("Starting Gmail sync...");
    
    // Verify user authentication
    const uid: string = await verifyUserFromFirebase(req);
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
    
    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    
    // Test API access first with a simple call
    try {
      const profile = await gmail.users.getProfile({ userId: 'me' });
      console.log("Gmail profile accessed successfully:", profile.data.emailAddress);
    } catch (profileError) {
      console.error("Failed to access Gmail profile:", profileError);
      throw new Error("Gmail API access failed - check permissions");
    }
    
    // Get current time for dynamic filtering
    const now: Date = new Date();
    const last48Hours: Date = new Date(now.getTime() - (48 * 60 * 60 * 1000));
    
    // Use a simpler query first to test
    const query: string = `newer_than:2d -in:spam -in:trash`;
    console.log("Using query:", query);
    
    // Fetch recent emails with error handling
    let messageList;
    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 20,
      });
      messageList = response.data;
      console.log("Messages fetched:", messageList.messages?.length || 0);
    } catch (listError: any) {
      console.error("Failed to list messages:", listError);
      
      // Try without query as fallback
      try {
        console.log("Trying fallback query...");
        const fallbackResponse = await gmail.users.messages.list({
          userId: 'me',
          maxResults: 10,
        });
        messageList = fallbackResponse.data;
        console.log("Fallback messages fetched:", messageList.messages?.length || 0);
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        throw listError; // Throw original error
      }
    }
    
    if (!messageList.messages || messageList.messages.length === 0) {
      return NextResponse.json<ApiResponse>({
        mostImportantEmail: null,
        totalEmails: 0,
        lastUpdated: now.toISOString(),
        message: "No recent emails found"
      });
    }
    
    // Fetch detailed information for each email with error handling
    const emails: GmailMessage[] = [];
    const maxEmailsToProcess = Math.min(messageList.messages.length, 10); // Limit to prevent timeouts
    
    for (let i = 0; i < maxEmailsToProcess; i++) {
      try {
        const message = messageList.messages[i];
        const { data: email } = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full'
        });
        emails.push(email as GmailMessage);
      } catch (emailError) {
        console.error(`Failed to fetch email ${messageList.messages[i].id}:`, emailError);
        // Continue with other emails
      }
    }
    
    console.log("Detailed emails fetched:", emails.length);
    
    if (emails.length === 0) {
      return NextResponse.json<ApiResponse>({
        mostImportantEmail: null,
        totalEmails: 0,
        lastUpdated: now.toISOString(),
        message: "Failed to fetch email details"
      });
    }
    
    // Calculate importance scores and find the most important email
    const emailsWithScores: EmailWithScore[] = emails.map((email: GmailMessage) => ({
      email,
      score: calculateEmailImportance(email)
    }));
    
    // Sort by importance score (highest first)
    emailsWithScores.sort((a: EmailWithScore, b: EmailWithScore) => b.score - a.score);
    
    const mostImportant: EmailWithScore | undefined = emailsWithScores[0];
    
    if (!mostImportant || mostImportant.score === 0) {
      return NextResponse.json<ApiResponse>({
        mostImportantEmail: null,
        totalEmails: emails.length,
        lastUpdated: now.toISOString(),
        message: "No important emails found"
      });
    }
    
    const email: GmailMessage = mostImportant.email;
    const headers: EmailHeader[] = email.payload.headers;
    
    // Transform the most important email - only essential info
    const transformedEmail: TransformedEmail = {
      id: email.id,
      subject: headers.find((h: EmailHeader) => h.name === 'Subject')?.value || 'No Subject',
      from: headers.find((h: EmailHeader) => h.name === 'From')?.value || 'Unknown Sender',
      importanceScore: mostImportant.score,
      isUnread: email.labelIds?.includes('UNREAD') || false
    };
    
    console.log("Most important email found:", transformedEmail.subject, "Score:", transformedEmail.importanceScore);
    
    // Return the most important email with metadata
    return NextResponse.json<ApiResponse>({
      mostImportantEmail: transformedEmail,
      totalEmails: emails.length,
      lastUpdated: now.toISOString(),
      nextUpdate: new Date(now.getTime() + (5 * 60 * 1000)).toISOString(),
      importanceThreshold: mostImportant.score,
      topScores: emailsWithScores.slice(0, 3).map((e: EmailWithScore) => ({
        subject: e.email.payload.headers.find((h: EmailHeader) => h.name === 'Subject')?.value || 'No Subject',
        score: e.score,
        from: e.email.payload.headers.find((h: EmailHeader) => h.name === 'From')?.value || 'Unknown'
      }))
    });
    
  } catch (error: unknown) {
    console.error("Gmail sync failed:", error);
    
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
          { error: "Authentication failed", details: error.message },
          { status: 401 }
        );
      }
      
      // Google API errors
      if (error.message.includes('insufficient authentication scopes') || 
          error.message.includes('The request does not have valid authentication credentials')) {
        return NextResponse.json<ErrorResponse>(
          { 
            error: "Insufficient Gmail permissions",
            requiredScopes: [
              "https://www.googleapis.com/auth/gmail.readonly",
              "https://www.googleapis.com/auth/gmail.metadata"
            ],
            details: error.message
          },
          { status: 403 }
        );
      }
      
      // Rate limit errors
      if (error.message.includes('quota exceeded') || error.message.includes('rate limit')) {
        return NextResponse.json<ErrorResponse>(
          { 
            error: "Rate limit exceeded",
            retryAfter: new Date(Date.now() + 60000).toISOString(),
            details: error.message
          },
          { status: 429 }
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
    }
    
    return NextResponse.json<ErrorResponse>(
      { 
        error: "Failed to sync emails",
        lastUpdated: new Date().toISOString(),
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
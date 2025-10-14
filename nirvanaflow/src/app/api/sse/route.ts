import { verifyUserFromFirebase } from "@/lib/firebase-verify";
import Events from "@/models/Events";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const write = (msg: string) => controller.enqueue(encoder.encode(msg));
      
      let userId: string | null = null;
      let intervalId: NodeJS.Timeout | null = null;
      let isInitialized = false;

      // Initialize auth and DB connection
      const initialize = async () => {
        try {
          userId = await verifyUserFromFirebase(req);
          await connectDb();
          isInitialized = true;
          
          // Send connection established event
          write(`event: connected\ndata: "Connection established"\n\n`);
          
          // Perform initial check immediately
          await checkOverdueEvents();
          
          console.log(`✅ SSE initialized for user: ${userId}`);
        } catch (err) {
          console.error("❌ SSE auth/db init failed:", err);
          write(
            `event: error\ndata: ${JSON.stringify({ 
              message: "Authentication or DB connection failed",
              error: err instanceof Error ? err.message : "Unknown error"
            })}\n\n`
          );
          controller.close();
          return;
        }
      };

      // Check for overdue events
      const checkOverdueEvents = async () => {
        if (!userId || !isInitialized) return;

        try {
          const now = new Date();
          const overdueEvents = await Events.find({
            userId,
            deadline: { $lt: now },
            completedAt: null,
          }).select('_id title deadline priority description createdAt'); 

          if (overdueEvents.length > 0) {
            write(
              `event: deadline-missed\ndata: ${JSON.stringify({
                count: overdueEvents.length,
                events: overdueEvents
              })}\n\n`
            );
            
            console.log(`⚠️ Found ${overdueEvents.length} overdue events for user: ${userId}`);
          } else {
            // Optional: send heartbeat to confirm connection is alive
            write(`event: heartbeat\ndata: ${JSON.stringify({ timestamp: now.toISOString() })}\n\n`);
          }
        } catch (err) {
          console.error("❌ SSE interval check failed:", err);
          write(
            `event: error\ndata: ${JSON.stringify({
              message: "Internal error during deadline check",
              error: err instanceof Error ? err.message : "Unknown error"
            })}\n\n`
          );
        }
      };

      // Start initialization
      initialize().then(() => {
        // Set up interval only after successful initialization
        if (isInitialized && userId) {
          intervalId = setInterval(checkOverdueEvents, 30_000); // 30 seconds
        }
      });

      // Handle connection close
      req.signal.addEventListener('abort', () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        isInitialized = false;
        console.log(`🔌 SSE connection closed for user: ${userId || 'unknown'}`);
        
        try {
          controller.close();
        } catch (err) {
          console.error("Error closing controller:", err);
        }
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
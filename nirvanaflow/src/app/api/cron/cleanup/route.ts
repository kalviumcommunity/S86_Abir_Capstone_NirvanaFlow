import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Events from "@/models/Events";
import Subtask from "@/models/Subtask";

export async function GET() {
  try {
    await connectDb();

    // Find completed events first to get their IDs
    const completedEvents = await Events.find({ completedAt: "done" }).select('_id');
    const eventIds = completedEvents.map(event => event._id);

    if (eventIds.length === 0) {
      return NextResponse.json({ 
        message: "No completed events to cleanup", 
        deletedEvents: 0, 
        deletedSubtasks: 0 
      });
    }

    // Delete subtasks for these events in batch
    const deletedSubtasks = await Subtask.deleteMany({ 
      eventId: { $in: eventIds } 
    });

    // Delete the events in batch
    const deletedEvents = await Events.deleteMany({ 
      completedAt: "done" 
    });

    return NextResponse.json({
      message: "Cleanup completed successfully",
      deletedEvents: deletedEvents.deletedCount,
      deletedSubtasks: deletedSubtasks.deletedCount
    });

  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json(
      { 
        message: "Cleanup failed", 
        error: err instanceof Error ? err.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
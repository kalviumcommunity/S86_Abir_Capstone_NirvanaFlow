import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Events from "@/models/Events";
import Subtask from "@/models/Subtask";
import { verifyUserFromFirebase } from "@/lib/firebase-verify";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const userId = await verifyUserFromFirebase();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "Missing event ID" }, { status: 400 });
    }

    
    const event = await Events.findOne({ _id: id, userId });

    if (!event) {
      return NextResponse.json({ message: "Event not found or unauthorized" }, { status: 404 });
    }

    
    await Subtask.deleteMany({ eventId: id });

    
    await Events.findByIdAndDelete(id);

    return NextResponse.json({ message: "Event and its subtasks deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ message: "Server error while deleting event" }, { status: 500 });
  }
}

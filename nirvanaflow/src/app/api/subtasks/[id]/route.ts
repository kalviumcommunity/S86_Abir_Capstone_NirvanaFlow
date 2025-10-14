import { NextRequest, NextResponse } from "next/server";
import Subtask from "@/models/Subtask";
import Events from "@/models/Events";
import connectDb from "@/lib/db";

interface UpdateSubtaskBody {
  status: string;
  completedAt: Date | null;
}

export async function PUT(
  req: NextRequest, 
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing subtask ID" },
        { status: 400 }
      );
    }

    await connectDb(); // Connect before parsing body for better error handling
    const body = await req.json();
    const { status } = body;

    if (status === undefined) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const updateData: UpdateSubtaskBody = {
      status,
      completedAt: status === "done" ? new Date() : null,
    };

    const updatedSubtask = await Subtask.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedSubtask) {
      return NextResponse.json(
        { message: "Subtask not found" },
        { status: 404 }
      );
    }

    // Check if all subtasks for this event are done
    const eventId = updatedSubtask.eventId;
    const event_subtasks = await Subtask.find({ eventId });

    
    const allDone = event_subtasks.length > 0 && event_subtasks.every(t => t.status === "done");

    // Update parent event completion status
    await Events.findByIdAndUpdate(
      eventId,
      { completedAt: allDone ? new Date() : null }, // Fixed: new Date() not new Date
      { new: true }
    );

    return NextResponse.json({
      success: true,
      subtask: updatedSubtask,
      allSubtasksDone: allDone
    });

  } catch (error) {
    console.error("Error updating the subtasks for this event:", error);
    return NextResponse.json(
      { message: "Error updating the subtask", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest, 
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing subtask ID" },
        { status: 400 }
      );
    }
    
    console.log('delete called for', id);
    await connectDb();

    const deletedSubtask = await Subtask.findByIdAndDelete(id);
    
    if (!deletedSubtask) {
      return NextResponse.json(
        { message: "Subtask not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting the subtask:", error);
    return NextResponse.json(
      { message: "Error removing the subtask" },
      { status: 500 }
    );
  }
}
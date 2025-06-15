import { NextRequest, NextResponse } from "next/server";
import Subtask from "@/models/Subtask";
import connectDb from "@/lib/db";

export async function PUT(
 req: NextRequest, context: { params: { id: string } }
) {
  try {
    
    const { id } =  context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing subtask ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    await connectDb();

    const { status } = body;

    if (status === undefined) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const updatedSubtask = await Subtask.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSubtask) {
      return NextResponse.json(
        { message: "Subtask not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubtask);
  } catch (error) {
    console.error("Error updating the subtasks for this event:", error);
    return NextResponse.json(
      { message: "Error updating the subtask" },
      { status: 500 }
    );
  }
}
export async function DELETE({ params }: { params: { id: string } }) {
  try {
    const { id } = params;
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
    console.error("Error fetching the Subtasks for This Event", error);
    return NextResponse.json(
      { message: "Error removing the subtask" },
      { status: 500 }
    );
  }
}

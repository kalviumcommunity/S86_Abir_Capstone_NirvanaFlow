import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import Events from "@/models/Events";
import { verifyUserFromFirebase } from "@/lib/firebase-verify";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb;
    const { id } = params;
    const userId = await verifyUserFromFirebase(req);

    if (!id) {
      return NextResponse.json(
        { message: "Missing Event id" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const { deadline } = body;

    if (!deadline) {
      return NextResponse.json(
        { message: "Invalid Deadline format" },
        { status: 400 }
      );
    }
    const existingEvent = await Events.findOne({ _id: id, userId });
    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    if (existingEvent.completedAt) {
      return NextResponse.json(
        {
          message: "Cannot extend deadline for completed event",
        },
        { status: 409 }
      ); // 409 Conflict
    }

    const extendedEvent = await Events.findOneAndUpdate(
      { _id: id, userId },
      {
        deadline: deadline,
      },
      { new: true, runValidators: true }
    );

    if (!extendedEvent) {
      return NextResponse.json(
        { message: "Event not found or unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Deadline extended successfully",
      event: {
        id: extendedEvent._id,
        title: extendedEvent.title,
        oldDeadline: existingEvent.deadline,
        newDeadline: extendedEvent.deadline,
        timeExtended:
          deadline.getTime() - new Date(existingEvent.deadline).getTime(),
      },
    });
  } catch (error) {
    console.error(
      "Error occured while marking the event as completed :",
      error
    );

    return NextResponse.json(
      { message: "Server error while extending deadline" },

      { status: 500 }
    );
  }
}

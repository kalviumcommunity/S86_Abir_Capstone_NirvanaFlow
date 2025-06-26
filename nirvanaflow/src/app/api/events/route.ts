import { NextResponse, NextRequest } from "next/server";
import connectDb from "@/lib/db";
import Events from "@/models/Events";
import { verifyUserFromFirebase } from "@/lib/firebase-verify";
import { generateSubtasks } from "@/lib/gemini";
import Subtask from "@/models/Subtask";

interface GeneratedSubtask {
  title: string;
  priority: "low" | "medium" | "high";
}

export async function GET(req:NextRequest) {
  try {
    const userId = await verifyUserFromFirebase(req);
    await connectDb();
    const events = await Events.find({ userId });

    return NextResponse.json(events);
  } catch (error) {
    console.log("error fetching the Events", error);
    return NextResponse.json(
      { message: "Error fetching the Events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = await verifyUserFromFirebase(req);
    await connectDb();
    const { title, description, deadline } = body;

    if (!title || !description || !deadline) {
      return NextResponse.json(
        { message: "Missing required fields: title, description, or deadline" },
        { status: 400 }
      );
    }
    // console.log(userId)

    const newEvent = await Events.create({
      userId: userId,
      title: title,
      description: description,
      deadline: deadline,
    });

    const generatedSubtasks = await generateSubtasks(title, description);

    const subDocs = generatedSubtasks.map((sub: GeneratedSubtask) => ({
      eventId: newEvent._id,
      userId: userId,
      title: sub.title,
      status: "todo",
      priority: sub.priority,
    }));

    const inserted = await Subtask.insertMany(subDocs);
    await Events.findByIdAndUpdate(newEvent._id, {
      $push: { subtasks: { $each: inserted.map((s) => s._id) } },
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.log("error creating the event", error);
    return NextResponse.json(
      { message: "Error creating the Event" },
      { status: 500 }
    );
  }
}

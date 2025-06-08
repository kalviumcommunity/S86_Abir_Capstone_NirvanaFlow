import connectDb from "@/lib/db";
import Subtask from "@/models/Subtask";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await connectDb();

       
        const subtasks = await Subtask.find({ eventId: id });

        return NextResponse.json({ subtasks });
    } catch (error) {
        console.error("Error fetching the Subtasks for This Event", error);
        return NextResponse.json(
            { message: "Error fetching the Subtasks for This Event" },
            { status: 500 }
        );
    }
}
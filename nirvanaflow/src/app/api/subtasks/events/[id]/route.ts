import connectDb from "@/lib/db";
import Subtask from "@/models/Subtask";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        console.log(context.params.id)
        const  id  = context.params.id;
        await connectDb();
       
        const subtasks = await Subtask.find({ eventId: id });
        return NextResponse.json( subtasks );
    } catch (error) {
        console.error("Error fetching the Subtasks for This Event", error);
        return NextResponse.json(
            { message: "Error fetching the Subtasks for This Event" },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from "next/server";
import Subtask from "@/models/Subtask";
import connectDb from "@/lib/db";


export async function PATCH(req:NextRequest,{ params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body=await req.json()
        await connectDb();

        const {status} = body
       
        const updatedSubtask = await Subtask.findByIdAndUpdate(id,{status},{upsert:true,new:true});
        if (!updatedSubtask) {
            return NextResponse.json(
                { message: "Subtask not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedSubtask);
    } catch (error) {
        console.error("Error Updating the Subtasks for This Event", error);
        return NextResponse.json(
            { message: "Error Updating the subtask" },
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

        return NextResponse.json({ message:'Deleted successfully' },{status:200});
    } catch (error) {
        console.error("Error fetching the Subtasks for This Event", error);
        return NextResponse.json(
            { message: "Error removing the subtask" },
            { status: 500 }
        );
    }
}
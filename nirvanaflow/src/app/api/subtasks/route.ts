import { NextResponse } from "next/server";
import Subtask from "@/models/Subtask";
import connectDb from "@/lib/db";
import { verifyUserFromFirebase } from "@/lib/firebase-verify";

export async function GET() {
    const userId=await verifyUserFromFirebase()
    try{
        await connectDb()
        const subtasks=await Subtask.find({userId})

        return NextResponse.json(subtasks)

    }catch(error){
        console.log('Error fetching the subtasks ',error)
        return NextResponse.json({message:'Error while Fetching the subtasks'},{status:500})
    }
}
import { NextRequest,NextResponse } from "next/server";
import Events from "@/models/Events";
import Subtask from "@/models/Subtask";
import connectDb from "@/lib/db";
import { verifyUserFromFirebase } from "@/lib/firebase-verify";
import { generateSubtasks } from "@/lib/gemini";

interface GeneratedSubtask {
    title: string;
    priority: 'low' | 'medium' | 'high';
}


export async function Post(req:NextRequest) {
    try{
        connectDb();
        const userId=await verifyUserFromFirebase()
        const body=await req.json()

        const{title,description,deadline}=body

        if (!title || !description || !deadline) {
            return NextResponse.json(
                { message: 'Missing required fields: title, description, or deadline' },
                { status: 400 }
            );
        }


        const newEvent=await Events.create({
            userId,
            title,
            description,
            deadline
        })

        const generatedSubtasks = await generateSubtasks(title, description);

        const subtaskDocs = generatedSubtasks.map((sub:GeneratedSubtask) => ({
            eventId: newEvent._id,
            title: sub.title,
            status: 'todo',
            priority: sub.priority,
            }));


    await Subtask.insertMany(subtaskDocs)

    return NextResponse.json({ message: 'Event + Subtasks created successfully' });

    }catch(error){
        console.log('error while adding the calander Events',error)
        NextResponse.json({message:'error while creating events'},{status:500})
    }
    
}
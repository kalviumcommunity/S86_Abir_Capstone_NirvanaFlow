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
    const userId = await verifyUserFromFirebase(req);
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



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

  try {

    await connectDb();

    const userId = await verifyUserFromFirebase(req);

    const { id } = params;

    if (!id) {

      return NextResponse.json({ message: "Missing event ID" }, { status: 400 });

    }

    const body = await req.json();

    const{completedAt}=body

    if(!completedAt){
      return NextResponse.json({ message: "Invalid completion date format" }, 
        { status: 400 } )
    }

    const markedCompleted= await Events.findOneAndUpdate({_id:id,userId},{
      completedAt
    },{new:true,runValidators:true})

    if(!markedCompleted){
      return NextResponse.json( { message: "Event not found or unauthorized" }, 
        { status: 404 })
    }

    const updatedSubtasks= await Subtask.updateMany({eventId:id,userId},{
      status:"done",
      completedAt:completedAt
    })
    

    return NextResponse.json({
      message: "Event marked as completed successfully",
      event: {
        id: markedCompleted._id,
        title: markedCompleted.title,
        completedAt: markedCompleted.completedAt
      },
      subtasksUpdated: updatedSubtasks.modifiedCount
    });

    
   

  } catch (error) {

    console.error("Error occured while marking the event as completed :", error);

    return NextResponse.json(

      { message: "Server error while extending deadline" }, 

      { status: 500 }

    );

  }

}
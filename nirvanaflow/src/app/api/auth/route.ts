import connectDb from "@/lib/db";
import User from "@/models/Users";
import { NextResponse } from 'next/server'



export async function Post(req:Request) {
    
    const body=await req.json();
    const {uid,name,email}=body

    try{
        await connectDb()
        const existingUser= await User.findOne({uid})
        
        if(!existingUser){
            await User.create({uid,name,email})
        }
        return NextResponse.json({message:'User Saved sucessfully'})
    }catch(err){
        console.log(err)
        return NextResponse.json({message:'Internal server error'},{status:500})
    }
}



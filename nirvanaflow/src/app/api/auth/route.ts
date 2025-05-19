import connectDb from "@/lib/db";
import User from "@/models/Users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { uid, name, email } = body;

  try {
    await connectDb();

    const existingUser = await User.findOne({ uid });

    if (!existingUser) {
      await User.create({ uid, name, email });
    }

    return NextResponse.json({ message: "User saved successfully" });
  } catch (err: unknown) {
    console.error("Database error:", err);

    if (err instanceof Error) {
      return NextResponse.json(
        { message: "Database connection failed", error: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Database connection failed", error: "Unknown error" },
      { status: 500 }
    );
  }
}

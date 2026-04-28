import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import { connectToDatabase } from "@/lib/db";

export async function POST(req) {
    
  await connectToDatabase();
 // 1. Get the raw body
  const body = await req.json();
  
  // 2. Log exactly what arrived in the terminal
  console.log("SERVER RECEIVED BODY:", body);

  const { userId, propertyId } = body;

  // 3. Add a safety check
  if (!userId || !propertyId) {
    return NextResponse.json(
      { error: "Missing required fields in request body" }, 
      { status: 400 }
    );
  }

  try {
    // Check if it exists
    const existing = await Wishlist.findOne({ userId, propertyId });

    if (existing) {
      // Remove it (Unlike)
      await Wishlist.deleteOne({ _id: existing._id });
      return NextResponse.json({ status: "removed" });
    } else {
      // Add it (Like)
      await Wishlist.create({ userId, propertyId });
      return NextResponse.json({ status: "added" });
    }
  }  catch (error) {
  console.error("Detailed Server Error:", error); // Check your VS Code terminal for this
  return NextResponse.json(
    { error: error.message || "Unknown error occurred" }, 
    { status: 500 }
  );
  }
}
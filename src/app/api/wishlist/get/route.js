import { NextResponse } from "next/server";
import Wishlist from "@/models/Wishlist";
import { connectToDatabase } from "@/lib/db";
// IMPORTANT: Make sure to import your Property model so Mongoose knows what to populate
import Project from "@/models/Project";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    
    // .populate('propertyId') grabs the actual data from the 'Property' collection
    const wishlist = await Wishlist.find({ userId }).populate('propertyId');
    
    return NextResponse.json(wishlist);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}
import { connectToDatabase } from "@/lib/db";
import Review from "@/models/Review";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const showOn = searchParams.get("showOn"); // 'homepage' or 'about'

  const query = showOn === 'homepage' ? { showOnHomepage: true } : 
                showOn === 'about' ? { showOnAboutUs: true } : {};
                
  const reviews = await Review.find(query).sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();
  const newReview = await Review.create(body);
  return NextResponse.json(newReview, { status: 201 });
}
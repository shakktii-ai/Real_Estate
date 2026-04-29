import { connectToDatabase } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { NextResponse } from "next/server";

// GET: Fetch all testimonials
export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all testimonials and sort by newest first
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" }, 
      { status: 500 }
    );
  }
}

// POST: Keep your existing POST handler here to allow adding new testimonials
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("📝 Testimonial POST body:", body);
    const newTestimonial = await Testimonial.create(body);
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("❌ Testimonial POST error:", error.message, error.errors);
    return NextResponse.json({ error: "Failed to create testimonial", details: error.message }, { status: 500 });
  }
}
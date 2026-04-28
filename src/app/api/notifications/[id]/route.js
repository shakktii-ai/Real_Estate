// app/api/notifications/[id]/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Notification from "@/models/Notification";

export async function PATCH(req, { params }) {
  // Await the params for Next.js 15+
  const { id } = await params;
  const body = await req.json();

  try {
    await connectToDatabase();
    
    const updated = await Notification.findByIdAndUpdate(
      id, 
      { isRead: body.isRead }, 
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
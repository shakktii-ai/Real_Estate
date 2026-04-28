import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db"; // Assuming you have a DB connection util
import SiteVisit from "@/models/SiteVisit";
import User from "@/models/User";
import Notification from "@/models/Notification";
import Project from "@/models/Project";
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Find the MongoDB user by Firebase uid or email
    const user = await User.findOne({ uid: body.userId });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const newBooking = await SiteVisit.create({
      ...body,
      userId: user._id,
      propertyId: new mongoose.Types.ObjectId(body.propertyId),
      status: "pending",
    });
    await Notification.create({
      receiverRole: "admin",
      type: "booking",
      title: "New Booking",
      message: `New Site Visit is booked by ${user.phone}`,
    });
    return NextResponse.json(
      { success: true, data: newBooking },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const firebaseUid = searchParams.get("userId");

  // ✅ ADMIN MODE (no userId)
  if (!firebaseUid) {
    const visits = await SiteVisit.find()
      .populate("propertyId", "projectName")
      .populate("userId", "fullName email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json(visits);
  }

  // ✅ USER MODE
  const user = await User.findOne({ uid: firebaseUid });

  if (!user) return NextResponse.json([]);

  const visits = await SiteVisit.find({ userId: user._id })
    .populate("propertyId", "projectName")
    .populate("userId", "fullName email phone")
    .sort({ createdAt: -1 });

  return NextResponse.json(visits);
}
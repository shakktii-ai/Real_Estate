import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";
export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);

  const firebaseUid = searchParams.get("userId");
  const role = searchParams.get("role"); // 👈 IMPORTANT

  // ✅ ADMIN
  if (role === "admin") {
    const notifications = await Notification.find({
      receiverRole: "admin",
    }).sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  }

  // ✅ USER
  const user = await User.findOne({ uid: firebaseUid });

  const notifications = await Notification.find({
    userId: user?._id,
    receiverRole: "user",
  }).sort({ createdAt: -1 });

  return NextResponse.json(notifications);
}

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db"; // Assuming you have a DB connection util
import VirtualTour from "@/models/VirtualTour";
import User from "@/models/User";
import Project from "@/models/Project";
import Notification from "@/models/Notification";
import { createLeadPlussLead } from "@/lib/leadPluss";
import Lead from "@/models/LeadsAll"; // Import the LeadsAll model
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Find the MongoDB user by Firebase uid or email
    const user = await User.findById(body.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const newBooking = await VirtualTour.create({
      ...body,
      userId: user._id,
      propertyId: new mongoose.Types.ObjectId(body.propertyId),
      status: "pending",
    });
   await Notification.create({
     receiverRole: "admin",
     type: "booking",
     title: "New Booking",
     message: `New Virtual Tour booked by ${user.phone}`,
   });
   const project = await Project.findById(body.propertyId);
await Lead.create({
  userId: user._id,
  propertyId: body.propertyId,

  firstName: body.name || user.fullName || "",
  phone: body.phone || user.phone || "",
  email: body.email || user.email || "",

  state: project?.state || "",
  city: project?.city || "",
  location: project?.location || "",
  project: project?.projectName || "",
  pincode: project?.pincode || "",

  propertyFor: "",
  property: "",
  propertyType: "",

  budget: "",

  message: `Virtual Tour Booked | ${body.date} | ${body.time}`,

  sourceType: "virtual_tour",
  leadSource: "Website",
});
try {
  await createLeadPlussLead({
    FirstName: body.name,
    Phone: body.phone,
    EmailId: body.email || "",
    State: project?.state || "",
    City: project?.city || "",
    Location: project?.location || "",
    Project: project?.projectName || "",
    Pincode: project?.pincode || "",
    PropertyFor: "",
    Property: "",
    PropertyType:"",
    Message: `Virtual Tour Booked | ${body.date} | ${body.time}`,
    LeadSource: "Website",
    budget:"",
  });
} catch (err) {
  console.error("LeadPluss Error:", err);
}
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

  // ✅ ADMIN MODE (no userId → fetch all)
  if (!firebaseUid) {
    const visits = await VirtualTour.find()
      .populate("propertyId", "projectName")
      .populate("userId", "fullName email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json(visits);
  }

  // ✅ USER MODE
  const user = await User.findOne({ uid: firebaseUid });

  if (!user) {
    return NextResponse.json([]);
  }

  const visits = await VirtualTour.find({ userId: user._id })
    .populate("propertyId", "projectName")
    .populate("userId", "fullName email phone")
    .sort({ createdAt: -1 });

  return NextResponse.json(visits);
}

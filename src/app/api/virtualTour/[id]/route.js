import { connectToDatabase } from "@/lib/db";
import VirtualTour from "@/models/VirtualTour";
import { NextResponse } from "next/server";
import Notification from "@/models/Notification";

export async function PUT(req, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const body = await req.json();

    //  Get tour with user info
    const tour = await VirtualTour.findById(id).populate("userId");

    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    // Update booking
    const updated = await VirtualTour.findByIdAndUpdate(
      id,
      {
        status: body.status,
        meetingLink: body.meetLink,
        date: body.date,
        time: body.time,
      },
      { returnDocument: "after" }
    );

    //  Send notification ONLY when confirmed
    if (body.status === "confirmed") {
      await Notification.create({
        userId: tour.userId._id,
        receiverRole: "user",
        type: "confirmation",
        title: "Virtual Tour Confirmed",
        message: "Your virtual tour has been confirmed",
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT ERROR:", error); 
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
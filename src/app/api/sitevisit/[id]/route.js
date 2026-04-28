import { connectToDatabase } from "@/lib/db";
import SiteVisit from "@/models/SiteVisit";
import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
export async function PUT(req, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const body = await req.json();
const Site = await SiteVisit.findById(id).populate("userId");

    if (!Site) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }
    const updated = await SiteVisit.findByIdAndUpdate(
      id,
      {
        status: body.status,
        date: body.date,
        time: body.time,
      },
      { returnDocument: "after" }
    );
 if (body.status === "confirmed") {
      await Notification.create({
        userId: Site.userId._id,
        receiverRole: "user",
        type: "confirmation",
        title: "Site Visit Confirmed",
        message: "Your Site Visit has been confirmed",
      });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
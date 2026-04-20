// app/api/user/profile/route.js
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { uid, phone, budget, buyingTimeline, purpose } = body;

    if (!uid || !phone) {
      return NextResponse.json(
        { error: "UID and phone are required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ uid });

    if (user) {
      user.budget = budget || user.budget;
      user.buyingTimeline = buyingTimeline || user.buyingTimeline;
      user.purpose = purpose || user.purpose;
      user.profileCompleted = true;

      await user.save();
    } else {
      user = await User.create({
        uid,
        phone,
        budget,
        buyingTimeline,
        purpose,
        profileCompleted: true,
      });
    }

    return NextResponse.json(
      {
        message: "Profile saved successfully",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const user = await User.findOneAndUpdate(
      { uid: body.uid },
      {
        fullName: body.fullName,
        email: body.email,
      
       
      },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "User details updated",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user details" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
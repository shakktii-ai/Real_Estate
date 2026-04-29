// app/api/user/profile/route.js
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const {
      uid,
      phone,
      budget,
      buyingTimeline,
      purpose,
      referralCodeUsed,
    } = body;

    if (!uid || !phone) {
      return NextResponse.json(
        { error: "UID and phone are required" },
        { status: 400 }
      );
    }

    // Find existing user
    let user = await User.findOne({ uid });
    const wasAlreadyReferred = !!user?.referredBy;
    // Find referrer if referral code entered
    let referrer = null;

    if (referralCodeUsed) {
      referrer = await User.findOne({
        referralCode: referralCodeUsed.trim().toUpperCase(),
      });
      if (!referrer) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 400 }
        );
      }
      if (!referrer) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 400 }
        );
      }
    }

    if (user) {
      user.budget = budget || user.budget;
      user.buyingTimeline = buyingTimeline || user.buyingTimeline;
      user.purpose = purpose || user.purpose;
      user.profileCompleted = true;

      // Only set referredBy once
      if (!user.referredBy && referrer) {
        user.referredBy = referrer._id;
      }

      await user.save();
    } else {
      const generatedReferralCode =
        "USER" + uid.slice(-5).toUpperCase();
      user = await User.create({
        uid,
        phone,
        budget,
        buyingTimeline,
        purpose,
        profileCompleted: true,

        referralCode: generatedReferralCode,


      });
    }


    // Reward only if this user was not already referred
    if (referrer && !wasAlreadyReferred) {
      user.referredBy = referrer._id;

      referrer.referralCount += 1;
      referrer.rewardPoints += 500;

      // Welcome bonus for the new user
      user.rewardPoints = (user.rewardPoints || 0) + 50;

      await user.save();
      await referrer.save();
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
export async function GET(req) {
  try {
    await connectToDatabase();

    // 1. Check if a UID was provided in the URL (e.g., /api/user/profile?uid=123)
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (uid) {
      // Logic for your Login Modal: Find one specific user
      const user = await User.findOne({ uid });
      
      return NextResponse.json({
        exists: !!user,
        profileCompleted: user?.profileCompleted || false,
        // Optional: return basic user data if needed for the UI
        user: user || null 
      });
    }

    // 2. Logic for your existing code: Fetch all users
    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json(users);

  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
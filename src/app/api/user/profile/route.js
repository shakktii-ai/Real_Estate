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
      email,
      name,
      budget,
      buyingTimeline,
      purpose,
      referralCodeUsed,
    } = body;

    if (!uid) {
      return NextResponse.json(
        { error: "UID is required" },
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
      if (user && referrer._id.toString() === user._id.toString()) {
        return NextResponse.json(
          { error: "You cannot use your own referral code" },
          { status: 400 }
        );
      }
    }

    if (user) {
      if (phone !== undefined) {
        user.phone = (phone && phone.trim()) ? phone.trim() : undefined;
      }
      user.email = email || user.email;
      user.fullName = name || user.fullName;
      user.budget = budget || user.budget;
      user.buyingTimeline = buyingTimeline || user.buyingTimeline;
      user.purpose = purpose || user.purpose;

      // Only mark profile as completed when actual profile data is submitted
      if (budget && buyingTimeline && purpose) {
        user.profileCompleted = true;
      }

      // Only set referredBy once
      if (!user.referredBy && referrer) {
        user.referredBy = referrer._id;
      }

      await user.save();
    } else {
      const generatedReferralCode = "USER" + uid.slice(-5).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
      const hasFullProfile = !!(budget && buyingTimeline && purpose);
      const newUserData = {
        uid,
        profileCompleted: hasFullProfile,
        referralCode: generatedReferralCode,
      };
      // Only set these if they have actual values to avoid unique index conflicts
      if (phone && phone.trim()) newUserData.phone = phone.trim();
      if (email && email.trim()) newUserData.email = email.trim().toLowerCase();
      if (name && name.trim()) newUserData.fullName = name.trim();
      if (budget) newUserData.budget = budget;
      if (buyingTimeline) newUserData.buyingTimeline = buyingTimeline;
      if (purpose) newUserData.purpose = purpose;

      user = await User.create(newUserData);
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
    console.error("POST Profile Error:", error);

    // Self-healing: if we hit a duplicate phone: null error
    if (error.code === 11000 && error.message.includes("phone_1")) {
      console.log("Detected duplicate phone key error in POST. Attempting self-healing...");
      try {
        await User.updateMany(
          { phone: null },
          { $unset: { phone: "" } }
        );
        return NextResponse.json(
          { error: "Database conflict detected and resolved. Please click 'Complete Profile' again." },
          { status: 409 }
        );
      } catch (cleanupError) {
        console.error("Self-healing failed:", cleanupError);
      }
    }

    return NextResponse.json(
      { error: "Failed to save profile: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { uid, phone, fullName, email, budget, buyingTimeline, purpose } = body;

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    const hasFullProfile = !!(budget && buyingTimeline && purpose);
    
    // Use upsert to create if not exists
    let user = await User.findOne({ uid });

    if (user) {
      // Update existing
      if (phone !== undefined) {
        if (phone && phone.trim()) {
          user.phone = phone.trim();
        } else {
          user.phone = undefined;
        }
      }
      if (fullName !== undefined) {
        user.fullName = fullName || user.fullName;
      }
      if (email !== undefined) {
        user.email = (email && email.trim()) ? email.trim().toLowerCase() : user.email;
      }
      user.budget = budget !== undefined ? budget : user.budget;
      user.buyingTimeline = buyingTimeline !== undefined ? buyingTimeline : user.buyingTimeline;
      user.purpose = purpose !== undefined ? purpose : user.purpose;
      
      if (hasFullProfile) user.profileCompleted = true;
      await user.save();
    } else {
      // Create new (upsert case for old accounts)
      const generatedReferralCode = "USER" + uid.slice(-5).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
      
      const newUserData = {
        uid,
        profileCompleted: hasFullProfile,
        referralCode: generatedReferralCode,
      };

      if (phone && phone.trim()) newUserData.phone = phone.trim();
      if (fullName && fullName.trim()) newUserData.fullName = fullName.trim();
      if (email && email.trim()) newUserData.email = email.trim().toLowerCase();
      if (budget) newUserData.budget = budget;
      if (buyingTimeline) newUserData.buyingTimeline = buyingTimeline;
      if (purpose) newUserData.purpose = purpose;

      user = await User.create(newUserData);
    }

    return NextResponse.json(
      { message: "User details updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);

    // Self-healing: if we hit a duplicate phone: null error, it means the DB is corrupted with null values.
    // We should have run the cleanup, but let's try to handle it gracefully.
    if (error.code === 11000 && error.message.includes("phone_1")) {
      console.log("Detected duplicate phone key error. Attempting self-healing cleanup...");
      try {
        await User.updateMany(
          { phone: null },
          { $unset: { phone: "" } }
        );
        // After cleanup, we don't retry automatically to avoid loops, 
        // but the next request should work.
        return NextResponse.json(
          { error: "Database conflict detected and resolved. Please try again." },
          { status: 409 }
        );
      } catch (cleanupError) {
        console.error("Self-healing failed:", cleanupError);
      }
    }

    return NextResponse.json(
      { error: "Failed to update user details: " + error.message },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await connectToDatabase();
    // 1. Check for cleanup trigger
    const { searchParams } = new URL(req.url);
    const triggerCleanup = searchParams.get("cleanup");

    if (triggerCleanup === "true") {
      // 1. Unset all null/empty phones
      const result = await User.updateMany(
        { $or: [{ phone: null }, { phone: "" }] },
        { $unset: { phone: "" } }
      );
      
      // 2. Drop the index and let it be recreated by Mongoose
      try {
        await User.collection.dropIndex("phone_1");
      } catch (err) {
        console.log("Index phone_1 not found or already dropped");
      }

      return NextResponse.json({
        message: `Cleanup successful. Updated ${result.modifiedCount} documents and reset phone index.`,
        result
      });
    }

    // 2. Check if a UID was provided in the URL (e.g., /api/user/profile?uid=123)
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
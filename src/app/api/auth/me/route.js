import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        uid: user.uid,
        phone: user.phone,
        fullName: user.fullName,
        email: user.email,
        profileCompleted: user.profileCompleted,
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        rewardPoints: user.rewardPoints,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('auth/me error', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

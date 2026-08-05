import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { NextResponse } from "next/server";

const normalizeMobile = (mobile) => {
  if (!mobile || typeof mobile !== "string") return null;

  const digits = mobile.replace(/\D/g, "");

  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);

  return null;
};

export async function POST(req) {
  try {
    const { mobile, otp } = await req.json();

    const normalizedMobile = normalizeMobile(mobile);

    if (!normalizedMobile || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number and OTP are required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectToDatabase();

    const otpEntry = await Otp.findOne({
      mobile: normalizedMobile,
      otp,
      used: false,
    });

    if (!otpEntry) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP.",
        },
        {
          status: 400,
        }
      );
    }

    if (new Date() > otpEntry.expiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP expired.",
        },
        {
          status: 400,
        }
      );
    }

    otpEntry.used = true;
    await otpEntry.save();

   let user = await User.findOne({
  phone: normalizedMobile,
});

// If user exists, mark phone as verified
if (user) {
  user.phoneVerified = true;
  await user.save();
}
    return NextResponse.json({
  success: true,
  verified: true,
  message: "OTP verified successfully.",
  user: user
    ? {
        id: user._id,
        uid: user.uid,
        phone: user.phone,
        fullName: user.fullName || "",
      }
    : null,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify OTP.",
      },
      {
        status: 500,
      }
    );
  }
}
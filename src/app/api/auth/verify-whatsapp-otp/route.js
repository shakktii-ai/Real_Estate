import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { createJwtToken } from "@/lib/auth";
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
    const body = await req.json();
    const { mobile, otp } = body;
    const normalizedMobile = normalizeMobile(mobile);

    if (!normalizedMobile || !otp) {
      return NextResponse.json(
        { error: "Mobile number and OTP are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const otpEntry = await Otp.findOne({ mobile: normalizedMobile, otp, used: false });
    if (!otpEntry) {
      return NextResponse.json({ error: "Invalid or missing OTP." }, { status: 400 });
    }

    if (new Date() > otpEntry.expiresAt) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    otpEntry.used = true;
    await otpEntry.save();

    let user = await User.findOne({ phone: normalizedMobile });
    const generatedReferralCode =
      "USER" +
      Date.now().toString().slice(-5) +
      Math.random().toString(36).slice(2, 5).toUpperCase();

    if (!user) {
      user = await User.create({
        uid: `phone-${normalizedMobile}`,
        phone: normalizedMobile,
        phoneVerified: true,
        referralCode: generatedReferralCode
      });
    } else {
      user.phoneVerified = true;
      user.phone = normalizedMobile;
      if (!user.referralCode) {
        user.referralCode = generatedReferralCode;
      }
      await user.save();
    }

    const token = createJwtToken(user);
    const cookieParts = [`token=${token}`, `Path=/`, `HttpOnly`, `Max-Age=${7*24*60*60}`, `SameSite=Lax`];
    if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');

    return NextResponse.json({ message: "OTP verified successfully.", uid: user.uid, id: user._id.toString() }, { status: 200, headers: { 'Set-Cookie': cookieParts.join('; ') } });
  } catch (error) {
    console.error("verify-whatsapp-otp error:", error);
    return NextResponse.json(
      { error: "Unable to verify OTP." },
      { status: 500 }
    );
  }
}

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
    const body = await req.json();
    const { mobile } = body;

    const normalizedMobile = normalizeMobile(mobile);
    if (!normalizedMobile) {
      return NextResponse.json(
        { error: "Mobile number must be a valid 10-digit Indian number." },
        { status: 400 }
      );
    }

    const apiKey = process.env.WHATSAPP_API_KEY;
    const userid = process.env.WHATSAPP_USERID;
    const wabaNumber = process.env.WHATSAPP_WABA_NUMBER;
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "otp_temp_2";
    const footer = process.env.WHATSAPP_TEMPLATE_FOOTER || "This code expires in 10 minute.";
    const apiUrl = process.env.WHATSAPP_API_URL || "https://theultimate.io/WAApi/send";

    if (!apiKey || !userid || !wabaNumber) {
      return NextResponse.json(
        { error: "WhatsApp OTP provider is not configured properly." },
        { status: 500 }
      );
    }

    await connectToDatabase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save to OTP collection (one-time codes)
    await Otp.create({ mobile: normalizedMobile, otp, expiresAt: expiry });

    // Determine uid to return (if user exists)
    const existingUser = await User.findOne({ phone: normalizedMobile });
    const responseUid = existingUser ? existingUser.uid : `phone-${normalizedMobile}`;

    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("msg", `${otp} is your verification code.`);
    formData.append("wabaNumber", wabaNumber);
    formData.append("output", "json");
    formData.append("mobile", `91${normalizedMobile}`);
    formData.append("sendMethod", "quick");
    formData.append("msgType", "text");
    formData.append("templateName", templateName);
    formData.append("footer", footer);

    const externalRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        apikey: apiKey,
      },
      body: formData,
    });

    const externalPayload = await externalRes.json().catch(() => null);
    if (!externalRes.ok) {
      console.error("WhatsApp API error:", externalPayload || "No response body");
      return NextResponse.json(
        { error: "Failed to send WhatsApp OTP." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP sent successfully.",
        uid: responseUid,
        externalResponse: externalPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("send-whatsapp-otp error:", error);
    return NextResponse.json(
      { error: "Unable to process WhatsApp OTP request." },
      { status: 500 }
    );
  }
}

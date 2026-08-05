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
    const { mobile } = await req.json();

    const normalizedMobile = normalizeMobile(mobile);

    if (!normalizedMobile) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mobile number",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({
      mobile: normalizedMobile,
      otp,
      expiresAt: expiry,
    });

    const apiKey = process.env.WHATSAPP_API_KEY;
    const templateName =
      process.env.WHATSAPP_TEMPLATE_NAME || "otp_temp_2";

    const apiUrl =
      process.env.WHATSAPP_API_URL ||
      "https://api.pingmate.app/api/v1/messages/send";

    const externalRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        to: `91${normalizedMobile}`,
        message: {
          message_type: "template",
          template_name: templateName,
          template_language: "en",
          body_variables: [otp],
          buttons: [
            {
              button_type: "url",
              button_payload: otp,
            },
          ],
        },
      }),
    });

    const externalPayload = await externalRes.json().catch(() => null);

    if (!externalRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to send OTP",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
      externalResponse: externalPayload,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}
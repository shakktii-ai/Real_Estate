import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import SubAdmin from "@/models/SubAdmin";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email address is required" },
                { status: 400 }
            );
        }

        // 1. Check if email exists in Admin or SubAdmin collection
        let user = await Admin.findOne({ email });
        let userModel = Admin;

        if (!user) {
            user = await SubAdmin.findOne({ email });
            userModel = SubAdmin;
        }

        if (!user) {
            return NextResponse.json(
                { error: "No account found with this email address." },
                { status: 404 }
            );
        }

        // 2. Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // 3. Save OTP and Expiry to DB
        user.resetOtp = otp;
        user.resetOtpExpiry = expiry;
        await user.save();

        // 4. Send Email using Nodemailer
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing EMAIL_USER or EMAIL_PASS in .env file");
            return NextResponse.json(
                { error: "Email service not configured. Please add EMAIL_USER and EMAIL_PASS to your .env file." },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Password Reset OTP - Admin Panel",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #742E85;">Password Reset OTP</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
            ${otp}
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
          <br />
          <p>Regards,<br />Admin Dashboard Team</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully to your email address."
        });

    } catch (error) {
        console.error("Send OTP API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

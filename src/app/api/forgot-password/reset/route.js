import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import SubAdmin from "@/models/SubAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { error: "Email, OTP, and new password are required." },
                { status: 400 }
            );
        }

        // 1. Find user in Admin or SubAdmin
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

        // 2. Validate OTP
        if (!user.resetOtp || user.resetOtp !== otp) {
            return NextResponse.json(
                { error: "Invalid OTP. Please try again." },
                { status: 401 }
            );
        }

        // 3. Check Expiry
        if (new Date() > user.resetOtpExpiry) {
            return NextResponse.json(
                { error: "OTP has expired. Please request a new one." },
                { status: 401 }
            );
        }

        // 4. Update Password and Clear OTP fields
        user.password = newPassword;
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password reset successfully. You can now log in."
        });

    } catch (error) {
        console.error("Password Reset API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

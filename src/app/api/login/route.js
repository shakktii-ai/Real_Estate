import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import SubAdmin from "@/models/SubAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // 1. Check Main Admin
        const mainAdmin = await Admin.findOne({ email, password });
        if (mainAdmin) {
            return NextResponse.json({
                success: true,
                user: {
                    id: mainAdmin._id,
                    name: mainAdmin.fullName,
                    email: mainAdmin.email,
                    role: mainAdmin.role,
                    image: mainAdmin.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    type: "MainAdmin"
                }
            });
        }

        // 2. Check Sub Admin (from SubAdmin collection)
        const subAdmin = await SubAdmin.findOne({ email, password });
        if (subAdmin) {
            if (subAdmin.status === "Inactive") {
                return NextResponse.json(
                    { error: "Account is inactive. Please contact the main administrator." },
                    { status: 403 }
                );
            }

            return NextResponse.json({
                success: true,
                user: {
                    id: subAdmin._id,
                    name: subAdmin.name,
                    email: subAdmin.email,
                    role: subAdmin.role,
                    image: subAdmin.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    type: "SubAdmin"
                }
            });
        }

        // 3. Check Connected Accounts in Admin model
        const adminWithAccount = await Admin.findOne({
            "connectedAccounts.email": email,
            "connectedAccounts.password": password
        });

        if (adminWithAccount) {
            const account = adminWithAccount.connectedAccounts.find(
                acc => acc.email === email && acc.password === password
            );

            if (account.status === "Inactive") {
                return NextResponse.json(
                    { error: "Account is inactive. Please contact the main administrator." },
                    { status: 403 }
                );
            }

            return NextResponse.json({
                success: true,
                user: {
                    id: account._id,
                    name: account.name,
                    email: account.email,
                    role: account.role,
                    image: account.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    type: "SubAdmin"
                }
            });
        }

        // If neither found
        return NextResponse.json(
            { error: "Invalid credentials. Please try again." },
            { status: 401 }
        );

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

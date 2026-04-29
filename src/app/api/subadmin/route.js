import { connectToDatabase } from "@/lib/db";
import SubAdmin from "@/models/SubAdmin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        const subAdmins = await SubAdmin.find().sort({ createdAt: -1 });
        return NextResponse.json(subAdmins);
    } catch (error) {
        console.error("Fetch SubAdmins Error:", error);
        return NextResponse.json({ error: "Failed to fetch sub-admins" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const newSubAdmin = await SubAdmin.create(body);

        return NextResponse.json(newSubAdmin, { status: 201 });
    } catch (error) {
        console.error("Create SubAdmin Error:", error);
        return NextResponse.json({ error: "Failed to create sub-admin" }, { status: 500 });
    }
}

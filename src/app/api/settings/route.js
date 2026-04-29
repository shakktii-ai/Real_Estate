import { connectToDatabase } from "@/lib/db";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function GET() {
    console.log("GET /api/settings hit");
    try {
        await connectToDatabase();
        let admin = await Admin.findOne();

        if (!admin) {
            // Create default admin if none exists
            admin = await Admin.create({
                fullName: "John Doe",
                email: "admin@example.com",
                role: "Admin",
                connectedAccounts: [
                    {
                        name: "Parth",
                        email: "parth@example.com",
                        role: "Editor",
                        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
                        status: "Active"
                    },
                    {
                        name: "John Snow",
                        email: "john@example.com",
                        role: "Accountant",
                        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                        status: "Active"
                    },
                    {
                        name: "Arya Stark",
                        email: "arya@example.com",
                        role: "Viewer",
                        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                        status: "Active"
                    }
                ]
            });
        }

        return NextResponse.json(admin);
    } catch (error) {
        console.error("Fetch Settings Error:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        let admin = await Admin.findOne();
        if (!admin) {
            admin = new Admin();
        }

        // Update fields using Mongoose's native set method to ensure nested arrays are properly tracked
        admin.set(body);
        await admin.save();

        return NextResponse.json(admin);
    } catch (error) {
        console.error("Update Settings Error:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}

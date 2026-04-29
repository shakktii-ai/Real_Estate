import { connectToDatabase } from "@/lib/db";
import SubAdmin from "@/models/SubAdmin";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const deletedAdmin = await SubAdmin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return NextResponse.json({ error: "SubAdmin not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "SubAdmin deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete SubAdmin Error:", error);
        return NextResponse.json({ error: "Failed to delete sub-admin" }, { status: 500 });
    }
}

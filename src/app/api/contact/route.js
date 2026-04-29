// import { connectToDatabase } from "@/lib/db";
// import Contact from "@/models/Contact";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await connectToDatabase();
//     const body = await req.json();

//     // Basic server-side validation
//     const { fullName, phoneNumber, projectName, budget, configuration, message } = body;
//     if (!fullName || !phoneNumber || !projectName || !budget || !configuration || !message) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const newContact = await Contact.create(body);

//     return NextResponse.json(
//       { message: "Your message has been sent successfully!", id: newContact._id },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Contact Submission Error:", error);
//     return NextResponse.json(
//       { error: "Failed to send message. Please try again later." },
//       { status: 500 }
//     );
//   }
// }
import { connectToDatabase } from "@/lib/db";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

// GET: Fetch all inquiries
export async function GET() {
  try {
    await connectToDatabase();
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Fetch Inquiries Error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

// PATCH: Update inquiry status
export async function PATCH(req) {
  try {
    await connectToDatabase();
    const { id, status } = await req.json();

    const inquiry = await Contact.findById(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Use provided status or toggle if not provided
    const newStatus = status || (inquiry.status === "Read" ? "Unread" : "Read");
    const updatedInquiry = await Contact.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: false }
    );

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("Update Inquiry Error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

// DELETE: Remove an inquiry
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedInquiry = await Contact.findByIdAndDelete(id);
    if (!deletedInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Delete Inquiry Error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}

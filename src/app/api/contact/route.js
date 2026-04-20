import { connectToDatabase } from "@/lib/db";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Basic server-side validation
    const { fullName, phoneNumber, projectName, budget, configuration, message } = body;
    if (!fullName || !phoneNumber || !projectName || !budget || !configuration || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newContact = await Contact.create(body);

    return NextResponse.json(
      { message: "Your message has been sent successfully!", id: newContact._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

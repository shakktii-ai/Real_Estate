import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Lead from "@/models/LeadsAll";
import ChatbotLead from "@/models/ChatbotLead";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const sourceType = searchParams.get("sourceType") ?? "all";

    const filter = {};

    if (sourceType !== "all" && sourceType !== "chatbot") {
      filter.sourceType = sourceType;
    }

    const baseLeads = await Lead.find(filter)
      .populate("userId", "fullName email phone")
      .populate("propertyId", "projectName city state")
      .sort({ createdAt: -1 });

    const chatbotLeads = sourceType === "all" || sourceType === "chatbot"
      ? await ChatbotLead.find({}).sort({ createdAt: -1 })
      : [];

    const normalizedChatbotLeads = chatbotLeads.map((lead) => ({
      _id: lead._id,
      firstName: lead.name || "",
      name: lead.name || "",
      phone: lead.phone || "",
      email: lead.email || "",
      project: lead.projectName || "",
      city: lead.preferredLocation || "",
      location: lead.preferredLocation || "",
      budget: lead.budget || "",
      message: lead.basicDetails || lead.message || "",
      sourceType: "chatbot",
      leadSource: "AI Chatbot",
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }));

    const mergedLeads =
      sourceType === "chatbot"
        ? normalizedChatbotLeads
        : sourceType === "all"
          ? [...baseLeads, ...normalizedChatbotLeads]
          : baseLeads;

    return NextResponse.json({
      success: true,
      data: mergedLeads,
    });
  } catch (error) {
    console.error("Admin Leads GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
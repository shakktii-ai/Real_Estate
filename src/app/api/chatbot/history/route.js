import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import ChatbotConversation from "@/models/ChatbotConversation";

export async function GET(request) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const conversation = await ChatbotConversation.findOne({
      userId: sessionUser._id,
    }).lean();

    return NextResponse.json({
      conversation: conversation || null,
    });
  } catch (error) {
    console.error("Error fetching chatbot history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chatbot history" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    const update = {
      uid: sessionUser.uid,
      messages: Array.isArray(body.messages) ? body.messages : [],
      currentStepIndex:
        typeof body.currentStepIndex === "number" ? body.currentStepIndex : -1,
      leadData: body.leadData && typeof body.leadData === "object" ? body.leadData : {},
      isSubmitted: Boolean(body.isSubmitted),
      activeMenu: typeof body.activeMenu === "string" ? body.activeMenu : "main",
      selectedLocation:
        typeof body.selectedLocation === "string" ? body.selectedLocation : null,
      selectedPriceRange:
        typeof body.selectedPriceRange === "string" ? body.selectedPriceRange : null,
      projects: Array.isArray(body.projects) ? body.projects : [],
      selectedProject:
        body.selectedProject && typeof body.selectedProject === "object"
          ? body.selectedProject
          : null,
    };

    const conversation = await ChatbotConversation.findOneAndUpdate(
      { userId: sessionUser._id },
      {
        $set: update,
        $setOnInsert: {
          userId: sessionUser._id,
        },
      },
      {
        new: true,
        upsert: true,
      }
    ).lean();

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Error saving chatbot history:", error);
    return NextResponse.json(
      { error: "Failed to save chatbot history" },
      { status: 500 }
    );
  }
}

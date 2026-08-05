import { connectToDatabase } from '@/lib/db';
import ChatbotLead from '@/models/ChatbotLead';
import { createLeadPlussLead } from "../../../../lib/leadPluss";
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Compile a structured, human-readable summary of the 10-step questionnaire answers
    // to map to the legacy "basicDetails" field in case the strict DB schema doesn't have the new properties yet.
    const summaryParts = [];
    if (body.configuration) summaryParts.push(`• Configuration: ${body.configuration}`);
    if (body.possession) summaryParts.push(`• Possession Timeline: ${body.possession}`);
    if (body.purchasePurpose) summaryParts.push(`• Purpose of Purchase: ${body.purchasePurpose}`);
    if (body.visitedProject) summaryParts.push(`• Visited any project: ${body.visitedProject}`);
    if (body.projectName) summaryParts.push(`• Project Name of interest: ${body.projectName}`);
    if (body.siteVisit) summaryParts.push(`• Scheduled Site Visit: ${body.siteVisit}`);

    const compiledDetails = summaryParts.length > 0
      ? summaryParts.join('\n')
      : body.basicDetails || 'No details provided.';

    const compiledMessage = body.message || `10-step chatbot questionnaire lead form submitted.`;

    // Create lead document mapping both explicit properties and compiled summaries safely
    console.log("Lead Request Body:", body);
    const lead = await ChatbotLead.create({
      name: body.name,
      phone: body.phone,
      email: body.email || '',
      budget: body.budget,
      preferredLocation: body.preferredLocation,
      propertyType: body.propertyType || 'Residential',
      basicDetails: compiledDetails,
      message: compiledMessage,
      status: 'new',

      // Explicitly saving the individual properties if your schema defines them (or strict is disabled)
      configuration: body.configuration || '',
      possession: body.possession || '',
      purchasePurpose: body.purchasePurpose || '',
      visitedProject: body.visitedProject || '',
      projectName: body.projectName || '',
      siteVisit: body.siteVisit || '',
    });
    try {
      const [firstName, ...lastNameParts] = (lead.name || "").trim().split(" ");

      await createLeadPlussLead({
        FirstName: firstName || "Customer",
        LastName: lastNameParts.join(" "),

        ISD: "+91",

        Phone: lead.phone,

        EmailId: lead.email || "",

        State: "Maharashtra",

        City: "Pune",

        Location: lead.preferredLocation || "",

        budget: lead.budget || "",

        Project: lead.projectName || "",

        Pincode: "",

        PropertyFor: "",

        Property: "",

        PropertyType: lead.configuration || "",

        LeadSource: "AI Chatbot",

        Message: ` Chatbot Lead Details:
Configuration: ${lead.configuration || ""}
Budget: ${lead.budget || ""}
Preferred Location: ${lead.preferredLocation || ""}
Possession Timeline: ${lead.possession || ""}
Purchase Purpose: ${lead.purchasePurpose || ""}
Visited Project: ${lead.visitedProject || ""}
Project Name: ${lead.projectName || ""}
Preferred Site Visit: ${lead.siteVisit || ""}
  `.trim(),
      });
    } catch (error) {
      console.error("LeadPluss Error:", error);
    }
    return Response.json(
      { message: 'Lead saved successfully', lead },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving lead:', error);
    return Response.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();

    const { status } = request.nextUrl.searchParams;

    let query = {};
    if (status) {
      query.status = status;
    }

    const leads = await ChatbotLead.find(query).sort({ createdAt: -1 });

    return Response.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return Response.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
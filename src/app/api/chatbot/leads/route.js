import { connectToDatabase } from '@/lib/db';
import ChatbotLead from '@/models/ChatbotLead';

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const lead = await ChatbotLead.create({
      name: body.name,
      phone: body.phone,
      email: body.email,
      budget: body.budget,
      preferredLocation: body.preferredLocation,
      message: body.message,
      status: 'new',
    });

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

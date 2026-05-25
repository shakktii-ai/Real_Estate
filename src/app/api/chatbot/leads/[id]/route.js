import { connectToDatabase } from '@/lib/db';
import ChatbotLead from '@/models/ChatbotLead';

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    await ChatbotLead.findByIdAndDelete(id);

    return Response.json(
      { message: 'Lead deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting lead:', error);
    return Response.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

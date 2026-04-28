import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Ensure you have this DB connector
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    
    // Filter by the boolean field in your schema
    const projects = await Project.find({ 
      "priceDrop.isEnabled": true 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}
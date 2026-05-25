import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

export async function GET(request) {
  try {
    await connectToDatabase();

    const id = request.nextUrl.searchParams.get('id');
    const slug = request.nextUrl.searchParams.get('slug');

    if (!id && !slug) {
      return Response.json(
        { error: 'Project ID or slug required' },
        { status: 400 }
      );
    }

    const project = id
      ? await Project.findById(id)
      : await Project.findOne({ slug });

    if (!project) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const projectObj = project.toObject ? project.toObject() : project;
    projectObj.location =
      projectObj.location ||
      [projectObj.address?.area, projectObj.address?.city].filter(Boolean).join(', ') ||
      'Unknown location';

    return Response.json(projectObj);
  } catch (error) {
    console.error('Error fetching project details:', error);
    return Response.json(
      { error: 'Failed to fetch project details' },
      { status: 500 }
    );
  }
}

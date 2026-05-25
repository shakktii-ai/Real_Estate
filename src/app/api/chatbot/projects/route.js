import { connectToDatabase } from '@/lib/db';
import Project from '@/models/Project';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function GET(request) {
  try {
    await connectToDatabase();

    const location = request.nextUrl.searchParams.get('location')?.trim();
    let projects;

    if (location) {
      const regex = new RegExp(escapeRegExp(location), 'i');
      projects = await Project.find({
        $or: [
          { 'address.area': { $regex: regex } },
          { 'address.city': { $regex: regex } },
        ],
      }).select(
        'projectName builderName address pricing configuration reraNumber amenities brochureUrl slug'
      ).lean();
    } else {
      projects = await Project.find({}).select(
        'projectName builderName address pricing configuration reraNumber amenities brochureUrl slug'
      ).lean();
    }

    const mappedProjects = projects.map((project) => ({
      ...project,
      location:
        project.location ||
        [project.address?.area, project.address?.city].filter(Boolean).join(', '),
    }));

    return Response.json({ projects: mappedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return Response.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

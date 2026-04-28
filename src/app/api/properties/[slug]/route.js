import { connectToDatabase } from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { slug } =await params;

    const project = await Project.findOne({ slug });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();

  const { slug: id } = await params;
    const body = await req.json();

const project = await Project.findById(id);
    // const project = await Project.findOne({ slug });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Update fields
    Object.assign(project, body);

    await project.save();

    return NextResponse.json(
      { message: "Project updated successfully", project },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
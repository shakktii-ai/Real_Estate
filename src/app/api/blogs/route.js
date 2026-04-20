import { connectToDatabase } from "@/lib/db";
import Blog from "@/models/Blog";

import { NextResponse } from "next/server";

// GET: Fetch all blogs
export async function GET() {
  try {
    await connectToDatabase();

    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST: Create Blog with uploaded image
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
let slug;
    let exists = true;

    while (exists) {
      slug = Math.floor(100000 + Math.random() * 900000).toString();

      const existingProject = await Blog.findOne({ slug });

      if (!existingProject) {
        exists = false;
      }
    }
    if (!body.title || !body.description || !body.image) {
      return NextResponse.json(
        {
          error: "Title, description and image are required",
        },
        { status: 400 }
      );
    }

    const newBlog = await Blog.create({
      title: body.title,
      description: body.description,
      image: body.image,
      slug
    });

    return NextResponse.json(
      {
        message: "Blog created successfully",
        blog: newBlog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Blog Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "A blog with this title already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create blog",
      },
      { status: 500 }
    );
  }
}
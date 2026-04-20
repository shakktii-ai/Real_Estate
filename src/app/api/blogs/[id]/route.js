import { connectToDatabase } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

// DELETE a blog
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// GET a single blog for the Edit Page
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const blog = await Blog.findById(params.id);
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
}

// UPDATE a blog
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const updatedBlog = await Blog.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
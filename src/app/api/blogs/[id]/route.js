import { connectToDatabase } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

// DELETE
export async function DELETE(req, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    await Blog.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Blog deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}

// GET single blog
export async function GET(req, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Blog not found" },
      { status: 404 }
    );
  }
}

// UPDATE
export async function PUT(req, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const body = await req.json();

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      body,
      {
        returnDocument: "after", // ✅ replaces deprecated { new: true }
      }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 400 }
    );
  }
}
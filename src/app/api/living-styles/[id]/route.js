import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import LivingStyle from "@/models/LivingStyle";
export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { id } = await params;

  await LivingStyle.findByIdAndDelete(id);

  return Response.json({ success: true });
}

export async function PUT(req, { params }) {
  await connectToDatabase();
  const { id } = await params;
  const body = await req.json();

  const updated = await LivingStyle.findByIdAndUpdate(
    id,
    body,
    { returnDocument: "after" }
  );

  return Response.json(updated);
}
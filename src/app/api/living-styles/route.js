import { connectToDatabase } from "@/lib/db";
import LivingStyle from "@/models/LivingStyle";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const cards = await LivingStyle.find({}).sort({ createdAt: 1 });
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    const newCard = await LivingStyle.create({
      title: formData.get("title"),
      categoryTag: formData.get("categoryTag"),
      cardColor: formData.get("cardColor"),
      description: formData.get("description"),
      pricingRange: formData.get("pricingRange"),
      features: JSON.parse(formData.get("features")),
      image: formData.get("image"), // Cloudinary URL
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Creation failed" },
      { status: 500 }
    );
  }
}
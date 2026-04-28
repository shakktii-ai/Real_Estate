import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Review from "@/models/Review";

// ✅ UPDATE REVIEW (PUT)
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();

    const { id } =await params;
    const body = await req.json();

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        customerName: body.customerName,
        reviewText: body.reviewText,
        rating: body.rating,
        googleLink: body.googleLink,
        showOnHomepage: body.showOnHomepage,
        showOnAboutUs: body.showOnAboutUs,
      },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// ✅ DELETE REVIEW
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    const { id } =await params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
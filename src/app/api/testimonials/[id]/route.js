import { NextResponse } from 'next/server';
import {connectToDatabase} from '@/lib/db'; // Ensure your DB connection helper is imported
import Testimonial from '@/models/Testimonial'; // Ensure your Mongoose model is imported

export async function PUT(request, { params }) {
    const { id } = await params; // Get the ID from the URL
    const body = await request.json(); // Get the updated data from the form

    try {
        await connectToDatabase();

        // Update the document in MongoDB
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            id, 
            { $set: body }, // Update only the fields provided in body
            { new: true, runValidators: true } // Return the updated doc, validate data
        );

        if (!updatedTestimonial) {
            return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedTestimonial }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
export async function DELETE(request, { params }) {
    const { id } = await params;

    try {
        await connectToDatabase();
        const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

        if (!deletedTestimonial) {
            return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
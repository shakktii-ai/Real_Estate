import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import Booking from "@/models/SiteVisit";
import tourBook from "@/models/VirtualTour"
export async function GET() {
  await connectToDatabase();

  const users = await User.countDocuments();
  const projects = await Project.countDocuments();
  const bookings = await Booking.countDocuments();
  const pending = await Booking.countDocuments();
   const Tourbooking = await tourBook.countDocuments();
  const Tourpending = await tourBook.countDocuments();
  return Response.json({
    users,
    projects,
    bookings,
    pending,
    Tourbooking,
    Tourpending
  });
}
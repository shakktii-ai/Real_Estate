import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import SiteVisit from "@/models/SiteVisit";
import VirtualTour from "@/models/VirtualTour";

export async function GET() {
  await connectToDatabase();

  // 🟣 USER REGISTRATIONS (Monthly)
  const users = await User.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  // 🔵 SITE VISITS
  const siteVisits = await SiteVisit.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
  ]);

  // 🟢 VIRTUAL TOURS
  const tours = await VirtualTour.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
  ]);

  // 🧠 Merge into one structure
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = months.map((month, i) => {
    const user = users.find(u => u._id === i + 1);
    const visit = siteVisits.find(v => v._id === i + 1);
    const tour = tours.find(t => t._id === i + 1);

    return {
      month,
      users: user?.count || 0,
      siteVisits: visit?.count || 0,
      tours: tour?.count || 0,
    };
  });

  return Response.json(chartData);
}
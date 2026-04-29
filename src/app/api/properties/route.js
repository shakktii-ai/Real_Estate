import { connectToDatabase } from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";
import Notification from "@/models/Notification";

// 1. GET: Fetch projects for the Index Page & Admin Dashboard
export async function GET(req) {
  try {
    await connectToDatabase();

    // Extract search filters from the URL (e.g., ?area=Wakad&config=2BHK)
    const { searchParams } = new URL(req.url);
    const area = searchParams.get("area");
    const city = searchParams.get("city");
    const status = searchParams.get("status");
    const config = searchParams.get("config");

    let query = {};

    if (area) query["address.area"] = area;
    if (city) query["address.city"] = city;
    if (status) query.status = status;
    if (config) query.configuration = { $in: [config] };// Matches if config exists in array

    const projects = await Project.find(query).sort({ createdAt: -1 });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// 2. POST: Add a New Project (from Screenshot 80/82 Modal)
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Generate unique 6 digit slug
    let slug;
    let exists = true;

    while (exists) {
      slug = Math.floor(100000 + Math.random() * 900000).toString();

      const existingProject = await Project.findOne({ slug });

      if (!existingProject) {
        exists = false;
      }
    }

    const projectData = {
      ...body,
      slug,


      reraNumber: body.reraNumber || "",

      pricing: {
        ...body.pricing,

      },
      priceDrop: {
        isEnabled: body.priceDrop?.isEnabled || false,
        oldPrice: Number(body.priceDrop?.oldPrice) || 0,
        newPrice: Number(body.priceDrop?.newPrice) || 0,
      },

      qrCodeUrl: body.qrCodeUrl || "",
      configuration: body.configuration
        ? Array.isArray(body.configuration)
          ? body.configuration.flatMap((item) =>
            item.split(",").map((i) => i.trim())
          )
          : body.configuration.split(",").map((item) => item.trim())
        : [],

      amenities: body.amenities
        ? Array.isArray(body.amenities)
          ? body.amenities.flatMap((item) =>
            item.split(",").map((i) => i.trim())
          )
          : body.amenities.split(",").map((item) => item.trim())
        : [],
    };

    const newProject = await Project.create(projectData);
  

    //Trigger notification ONLY if valid price drop
    if (
      projectData.priceDrop?.isEnabled &&
      projectData.priceDrop.oldPrice > projectData.priceDrop.newPrice
    ) {
      const dropAmount =
        projectData.priceDrop.oldPrice - projectData.priceDrop.newPrice;

      const percentage = Math.round(
        (dropAmount / projectData.priceDrop.oldPrice) * 100
      );

      await Notification.create({
        receiverRole: "user",
        type: "priceDrop",
        title: "Price Drop Alert",
        message: `${projectData.projectName} price dropped by ₹${dropAmount.toLocaleString(
          "en-IN"
        )} (${percentage}%). Check it now!`,
      });
    }
    return NextResponse.json(
      { message: "Project created!", id: newProject._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Creation Error:", error);

    return NextResponse.json(
      { error: error.message || "Validation failed" },
      { status: 400 }
    );
  }
}
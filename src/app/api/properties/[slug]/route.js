import { connectToDatabase } from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import {
  MAX_PROJECT_IMAGES,
  getProjectImages,
  isValidProjectImageUrl,
  normalizeProjectImages,
} from "@/lib/projectImages";

class ProjectImageValidationError extends Error {}

function validateGallery(images, mainImage, projectName) {
  if (images !== undefined && !Array.isArray(images)) {
    throw new ProjectImageValidationError("The project image gallery is invalid.");
  }

  if (mainImage && !isValidProjectImageUrl(mainImage)) {
    throw new ProjectImageValidationError("The project cover image URL is invalid.");
  }

  if (!Array.isArray(images)) {
    return null;
  }

  if (images.length > MAX_PROJECT_IMAGES) {
    throw new ProjectImageValidationError(
      `A project can have up to ${MAX_PROJECT_IMAGES} images.`
    );
  }

  if (
    images.some(
      (image) =>
        !image ||
        !isValidProjectImageUrl(image.url) ||
        (image.category !== undefined &&
          typeof image.category !== "string") ||
        (image.alt !== undefined && typeof image.alt !== "string")
    )
  ) {
    throw new ProjectImageValidationError(
      "One or more project image details are invalid."
    );
  }

  return normalizeProjectImages(images, mainImage, projectName || "");
}

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { slug } = await params;

    const project = await Project.findOne({ slug });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function PUT(req, { params }) {
  try {
    await connectToDatabase();

    const { slug: id } = await params;
    const body = await req.json();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Store OLD values
    const oldPrice = project.priceDrop?.oldPrice || 0;
    const oldNewPrice = project.priceDrop?.newPrice || 0;

    //Get NEW values from body
    const newOldPrice = Number(body.priceDrop?.oldPrice) || 0;
    const newNewPrice = Number(body.priceDrop?.newPrice) || 0;
    const isEnabled = body.priceDrop?.isEnabled;

    // Check if price changed
    const priceChanged =
      oldPrice !== newOldPrice || oldNewPrice !== newNewPrice;

    const gallery = validateGallery(
      body.images,
      body.mainImage,
      body.projectName || project.projectName
    );
    if (gallery) {
      body.images = gallery;
      body.mainImage = gallery.find((image) => image.isCover)?.url || "";
    } else if (body.mainImage !== undefined) {
      const currentImages = getProjectImages(project);
      const updatedImages = currentImages.some(
        (image) => image.url === body.mainImage
      )
        ? currentImages
        : [
            ...currentImages,
            {
              url: body.mainImage,
              isCover: true,
              order: currentImages.length,
              alt: project.projectName || "",
            },
          ];
      body.images = normalizeProjectImages(
        updatedImages,
        body.mainImage,
        project.projectName || ""
      );
      body.mainImage = body.images.find((image) => image.isCover)?.url || "";
    }

    Object.assign(project, body);

    // Handle priceDrop safely
    if (body.priceDrop?.isEnabled) {
      project.priceDrop = {
        isEnabled: true,
        oldPrice: Number(body.priceDrop.oldPrice) || 0,
        newPrice: Number(body.priceDrop.newPrice) || 0,
      };
    } else {
      project.priceDrop = {
        isEnabled: false,
        oldPrice: 0,
        newPrice: 0,
      };
    }
    await project.save();

    //Trigger notification ONLY if valid drop
    if (
      isEnabled &&
      priceChanged &&
      newOldPrice > newNewPrice
    ) {
      const dropAmount = newOldPrice - newNewPrice;

      const percentage = Math.round(
        (dropAmount / newOldPrice) * 100
      );

      await Notification.create({
        receiverRole: "user",
        type: "priceDrop",
        title: "Price Drop Alert",
        message: `${project.projectName} price dropped by ₹${dropAmount.toLocaleString(
          "en-IN"
        )} (${percentage}%). Check it now!`,
        projectId: project._id,
        isGlobal: true,
      });
    }

    return NextResponse.json(
      { message: "Project updated successfully", project },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof ProjectImageValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
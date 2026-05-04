import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

  const mimeType = file.type;

const isPdf = mimeType === "application/pdf";

const result = await new Promise((resolve, reject) => {
  cloudinary.uploader
    .upload_stream(
      {
        folder: "real-estate-projects",
        resource_type: isPdf ? "raw" : "image", // 🔥 key fix
        type: "upload",
        access_mode: "public", // ensure public
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    )
    .end(buffer);
});

    return NextResponse.json({
      url: result.secure_url,
    });
  } catch (error) {
  console.error("UPLOAD ERROR:", error); // ✅ VERY IMPORTANT

  return NextResponse.json(
    { error: error.message || "Upload failed" },
    { status: 500 }
  );
}
}
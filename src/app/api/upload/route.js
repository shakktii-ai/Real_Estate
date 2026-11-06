import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_PDF_SIZE = 25 * 1024 * 1024;
const IMAGE_SIGNATURES = {
  "image/jpeg": (buffer) =>
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff,
  "image/png": (buffer) =>
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  "image/webp": (buffer) =>
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP",
  "image/avif": (buffer) =>
    buffer.length >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp" &&
    ["avif", "avis"].includes(buffer.toString("ascii", 8, 12)),
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const mimeType = file.type;
    const isPdf = mimeType === "application/pdf";
    const isImage = Object.hasOwn(IMAGE_SIGNATURES, mimeType);
    const maxSize = isPdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;

    if (!isPdf && !isImage) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload an image or PDF." },
        { status: 415 }
      );
    }

    if (file.size <= 0 || file.size > maxSize) {
      return NextResponse.json(
        {
          error: isPdf
            ? "PDF files must be 25 MB or smaller."
            : "Images must be 10 MB or smaller.",
        },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const signatureIsValid = isPdf
      ? buffer.subarray(0, 5).toString("ascii") === "%PDF-"
      : IMAGE_SIGNATURES[mimeType](buffer);

    if (!signatureIsValid) {
      return NextResponse.json(
        { error: "The uploaded file content does not match its file type." },
        { status: 415 }
      );
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "real-estate-projects",
            resource_type: isPdf ? "raw" : "image",
            type: "upload",
            access_mode: "public",
            use_filename: true,
            unique_filename: true,
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          }
        )
        .end(buffer);
    });

    if (!result?.secure_url) {
      throw new Error("Storage did not return an uploaded file URL.");
    }
    return NextResponse.json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Star, Trash2, Upload } from "lucide-react";
import ProjectImage from "@/components/ProjectImage";
import {
  MAX_PROJECT_IMAGE_SIZE,
  MAX_PROJECT_IMAGES,
  PROJECT_IMAGE_TYPES,
} from "@/lib/projectImages";

const IMAGE_CATEGORIES = [
  ["", "Uncategorized"],
  ["Exterior", "Exterior"],
  ["Interior", "Interior"],
  ["Amenities", "Amenities"],
  ["Floor Plans", "Floor Plans"],
  ["Master Plan", "Master Plan"],
  ["Location Map", "Location Map"],
  ["Brochure", "Brochure"],
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ProjectImageManager({
  images,
  onChange,
  projectName,
  uploadProgress = {},
  disabled = false,
}) {
  const [error, setError] = useState("");
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState(null);
  const inputRef = useRef(null);
  const objectUrls = useRef(new Set());

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    },
    []
  );

  const addFiles = (fileList) => {
    if (disabled) return;
    const files = Array.from(fileList || []);
    const availableSlots = MAX_PROJECT_IMAGES - images.length;
    const validFiles = [];
    const errors = [];

    if (availableSlots <= 0) {
      setError(`A project can have up to ${MAX_PROJECT_IMAGES} images.`);
      return;
    }

    files.forEach((file) => {
      if (!PROJECT_IMAGE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: use JPEG, PNG, WebP, or AVIF.`);
      } else if (file.size > MAX_PROJECT_IMAGE_SIZE) {
        errors.push(`${file.name}: image must be 10 MB or smaller.`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > availableSlots) {
      errors.push(
        `Only ${availableSlots} more image${availableSlots === 1 ? "" : "s"} can be added.`
      );
    }

    const acceptedFiles = validFiles.slice(0, availableSlots);
    if (acceptedFiles.length) {
      const newImages = acceptedFiles.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        objectUrls.current.add(previewUrl);
        return {
          id: createId(),
          file,
          previewUrl,
          url: "",
          isCover: images.length === 0 && acceptedFiles[0] === file,
          order: images.length,
          alt: projectName || "",
          category: "",
        };
      });

      onChange([...images, ...newImages]);
    }

    setError(errors.join(" "));
  };

  const removeImage = (imageId) => {
    const imageToRemove = images.find((image) => image.id === imageId);
    if (imageToRemove?.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
      objectUrls.current.delete(imageToRemove.previewUrl);
    }

    const remaining = images
      .filter((image) => image.id !== imageId)
      .map((image, index) => ({ ...image, order: index }));
    if (imageToRemove?.isCover && remaining.length) {
      remaining[0] = { ...remaining[0], isCover: true };
    }
    onChange(remaining);
    setError("");
  };

  const selectCover = (imageId) => {
    onChange(
      images.map((image) => ({
        ...image,
        isCover: image.id === imageId,
      }))
    );
  };

  const updateImage = (imageId, field, value) => {
    onChange(
      images.map((image) =>
        image.id === imageId ? { ...image, [field]: value } : image
      )
    );
  };

  const moveImage = (targetId) => {
    if (!draggedImageId || draggedImageId === targetId) return;
    const reordered = [...images];
    const sourceIndex = reordered.findIndex(
      (image) => image.id === draggedImageId
    );
    const targetIndex = reordered.findIndex((image) => image.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [movedImage] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedImage);
    onChange(reordered.map((image, index) => ({ ...image, order: index })));
    setDraggedImageId(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-black">Project Image Gallery</h3>
          <p className="mt-1 text-xs text-gray-600">
            Choose the cover shown on project cards. Drag images to change their order.
          </p>
        </div>
        <span className="text-xs font-medium text-gray-600">
          {images.length}/{MAX_PROJECT_IMAGES} images
        </span>
      </div>

      <button
        type="button"
        disabled={disabled || images.length >= MAX_PROJECT_IMAGES}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDraggingFiles(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDraggingFiles(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDraggingFiles(false);
          addFiles(event.dataTransfer.files);
        }}
        className={`flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition ${
          isDraggingFiles
            ? "border-[#742E85] bg-purple-50"
            : "border-gray-300 bg-gray-50 hover:border-[#742E85]"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <ImagePlus className="text-[#742E85]" size={24} />
        <span className="text-sm font-semibold text-black">
          Drop project photos here or browse
        </span>
        <span className="text-xs text-gray-500">
          JPEG, PNG, WebP, or AVIF · Up to 10 MB each
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={PROJECT_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        disabled={disabled || images.length >= MAX_PROJECT_IMAGES}
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <article
              key={image.id || `${image.url}-${index}`}
              draggable={!disabled}
              onDragStart={() => setDraggedImageId(image.id)}
              onDragEnd={() => setDraggedImageId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                moveImage(image.id);
              }}
              className={`overflow-hidden rounded-xl border bg-white ${
                draggedImageId === image.id
                  ? "border-[#742E85] opacity-60"
                  : image.isCover
                    ? "border-[#742E85] ring-2 ring-[#742E85]/20"
                    : "border-gray-200"
              }`}
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <ProjectImage
                  src={image.previewUrl || image.url}
                  alt={image.alt || projectName || "Project photo"}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
                {image.isCover && (
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#742E85] px-2 py-1 text-[10px] font-semibold text-white">
                    <Star size={11} fill="currentColor" />
                    Cover image
                  </span>
                )}
                {uploadProgress[image.id] !== undefined && (
                  <div
                    className="absolute inset-x-0 bottom-0 h-1 bg-gray-200"
                    aria-label={`Uploading image ${uploadProgress[image.id]}%`}
                  >
                    <div
                      className="h-full bg-[#E5097F] transition-[width]"
                      style={{ width: `${uploadProgress[image.id]}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2 p-2">
                <p className="truncate text-[11px] text-gray-600">
                  {image.file?.name || image.url}
                </p>
                <select
                  value={image.category || ""}
                  disabled={disabled}
                  onChange={(event) =>
                    updateImage(image.id, "category", event.target.value)
                  }
                  aria-label={`Category for image ${index + 1}`}
                  className="w-full rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-black"
                >
                  {IMAGE_CATEGORIES.map(([value, label]) => (
                    <option key={value || "uncategorized"} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={disabled || image.isCover}
                    onClick={() => selectCover(image.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-[#742E85] disabled:cursor-default disabled:bg-purple-50"
                  >
                    <Star size={12} />
                    {image.isCover ? "Selected cover" : "Set as cover"}
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeImage(image.id)}
                    aria-label={`Remove image ${index + 1}`}
                    className="rounded-md border border-red-100 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {uploadProgress[image.id] !== undefined && (
                  <p className="flex items-center gap-1 text-[10px] text-gray-600">
                    <Upload size={11} />
                    Uploading {uploadProgress[image.id]}%
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-500">
          No project photos selected yet.
        </p>
      )}
    </section>
  );
}

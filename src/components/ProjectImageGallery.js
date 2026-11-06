"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import ProjectImage from "@/components/ProjectImage";
import { getProjectImages } from "@/lib/projectImages";

export default function ProjectImageGallery({ project, children }) {
  const images = getProjectImages(project);
  const [activeIndex, setActiveIndex] = useState(() => {
    const coverIndex = images.findIndex((image) => image.isCover);
    return coverIndex >= 0 ? coverIndex : 0;
  });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(null);
  const activeImage = images[activeIndex];

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  };
  const showNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  useEffect(() => {
    if (!isLightboxOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % images.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, images.length]);

  if (!images.length) {
    return (
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 text-center text-sm text-gray-500">
        <div>
          <Images className="mx-auto mb-2 text-gray-400" size={32} />
          Project photos are not available.
        </div>
        {children}
      </div>
    );
  }

  return (
    <>
      <section
        aria-label={`${project.projectName || "Project"} photo gallery`}
        className="flex flex-col gap-3"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-gray-100 shadow-xl">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label={`Open photo ${activeIndex + 1} of ${images.length}`}
            className="absolute inset-0 z-10 block h-full w-full cursor-zoom-in"
          >
            <ProjectImage
              src={activeImage.url}
              alt={activeImage.alt || project.projectName || "Project photo"}
              sizes="(max-width: 1024px) 100vw, 65vw"
              preload
              className="h-full w-full object-cover"
            />
          </button>
          {children && <div className="pointer-events-none absolute inset-0 z-20">{children}</div>}
          {/* {images.length > 1 && (
            <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
              {activeIndex + 1}/{images.length}
            </span>
          )} */}
        </div>

        {images.length > 1 && (
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image.url}-${index}`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show photo ${index + 1}`}
                    aria-pressed={index === activeIndex}
                    className={`group relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-[#742E85] sm:h-24 sm:w-32 ${
                      index === activeIndex
                        ? "ring-2 ring-[#742E85] ring-offset-2"
                        : ""
                    }`}
                  >
                    <ProjectImage
                      src={image.url}
                      alt={image.alt || project.projectName || "Project photo"}
                      sizes="(max-width: 640px) 112px, 128px"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#742E85] transition hover:bg-purple-50"
            >
              <Images size={17} />
              View All Images ({images.length})
            </button>
          </div>
        )}
      </section>

      {/* {images.length === 1 && (
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#742E85] transition hover:bg-purple-50"
        >
          <Images size={17} />
          View All Photos (1)
        </button>
      )} */}

      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project photo viewer"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-3 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close photo gallery"
            className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>

          <span className="absolute left-4 top-5 z-20 rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white">
            {activeIndex + 1}/{images.length}
          </span>

          <div
            className="relative flex h-full w-full max-w-7xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const startX = touchStartX.current;
              const endX = event.changedTouches[0]?.clientX;
              if (startX === null || endX === undefined) return;
              if (startX - endX > 45) showNext();
              if (endX - startX > 45) showPrevious();
              touchStartX.current = null;
            }}
          >
            <ProjectImage
              src={activeImage.url}
              alt={activeImage.alt || project.projectName || "Project photo"}
              sizes="100vw"
              className="h-full w-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/75 sm:left-4"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/75 sm:right-4"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
